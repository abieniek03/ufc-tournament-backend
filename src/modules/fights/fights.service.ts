import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Level, Score } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Fight } from '@prisma/client';
import { UpdateFightResultDto } from './dto/fight.dto';

@Injectable()
export class FightsService {
  constructor(private readonly prisma: PrismaService) {}

  private calcNextBracketPosition(level: Level, value: number): number {
    const nextBracketPosition = value / 2;

    if (level !== 'FINAL') {
      switch (nextBracketPosition) {
        case 0.5:
          return Math.ceil(nextBracketPosition);
        case 1.5:
          return Math.round(nextBracketPosition);
        default:
          return nextBracketPosition === 1 ? 2 : nextBracketPosition;
      }
    }

    return Math.ceil(nextBracketPosition);
  }

  public async getTournamentFights(
    userId: string,
    tournamentId: string,
    level: Level,
  ): Promise<Fight[]> {
    try {
      const tournamentFights = await this.prisma.fight.findMany({
        where: { tournamentId, level },
        include: {
          redFighter: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          blueFighter: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          tournament: {
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: level === 'ROUND_2' ? 'desc' : 'asc',
        },
      });

      if (!tournamentFights.length) {
        throw new NotFoundException('Any fight was not found.');
      }

      tournamentFights.forEach((el) => {
        if (el.tournament.userId !== userId)
          throw new ForbiddenException('You are not owner of this tournament.');
      });

      return tournamentFights;
    } catch (error: any) {
      throw error;
    }
  }

  private async updateFighterScore(
    fighter: Score,
    data: UpdateFightResultDto,
  ): Promise<void> {
    const calcPoints = (fighter: Score, data: UpdateFightResultDto) => {
      if (data.winner === 'DRAW') {
        return fighter.points + 1;
      }

      if (fighter.fighterId === data.winner) {
        let bonusPoints = 0;
        if (data.method[1] !== 'D') {
          switch (data.round) {
            case 1:
              bonusPoints = 3;
              break;
            case 2:
              bonusPoints = 2;
              break;
            default:
              bonusPoints = 1;
          }
        }
        return fighter.points + 3 + bonusPoints;
      }

      return fighter.points;
    };

    await this.prisma.score.update({
      where: {
        id: fighter.id,
      },
      data: {
        fights: fighter.fights + 1,
        win: data.winner === fighter.fighterId ? fighter.win + 1 : fighter.win,
        lose:
          data.winner !== fighter.fighterId && data.winner !== 'DRAW'
            ? fighter.lose + 1
            : fighter.lose,
        draw: data.winner === 'DRAW' ? fighter.draw + 1 : fighter.draw,
        firstRoundFinish:
          data.winner === fighter.fighterId && data.round === 1
            ? fighter.firstRoundFinish + 1
            : fighter.firstRoundFinish,
        secondRoundFinish:
          data.winner === fighter.fighterId && data.round === 2
            ? fighter.secondRoundFinish + 1
            : fighter.secondRoundFinish,
        thirdRoundFinish:
          data.winner === fighter.fighterId &&
          data.round === 3 &&
          data.method[1] !== 'D'
            ? fighter.thirdRoundFinish + 1
            : fighter.thirdRoundFinish,
        points: calcPoints(fighter, data),
        positionIndex:
          data.winner === fighter.fighterId
            ? fighter.positionIndex + 1
            : data.winner === 'DRAW'
              ? fighter.positionIndex
              : fighter.positionIndex - 1,
      },
    });
  }

  public async updateResult(
    userId: string,
    fightId: string,
    data: UpdateFightResultDto,
  ): Promise<Fight> {
    try {
      const fight = await this.prisma.fight.findUnique({
        where: { id: fightId },
        include: {
          tournament: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!fight) throw new NotFoundException('Fight not found.');

      if (fight.tournament.userId !== userId)
        throw new ForbiddenException('You are not owner of this tournament.');

      if (data.round > 5)
        throw new BadRequestException('Final bout has 5 rounds.');

      if (data.round > 3 && fight.level !== 'FINAL')
        throw new BadRequestException('This bout has 3 rounds.');

      const updatedFight = await this.prisma.fight.update({
        where: { id: fightId },
        data,
      });

      if (fight.level === 'ROUND_1' || fight.level === 'ROUND_2') {
        const redFighterScore = await this.prisma.score.findFirst({
          where: {
            tournamentId: fight.tournamentId,
            fighterId: fight.redFighterId,
          },
        });

        const blueFighterScore = await this.prisma.score.findFirst({
          where: {
            tournamentId: fight.tournamentId,
            fighterId: fight.blueFighterId,
          },
        });

        await this.updateFighterScore(redFighterScore, data);
        await this.updateFighterScore(blueFighterScore, data);
      } else {
        if (updatedFight.level !== 'FINAL') {
          let nextLevel: Level;

          updatedFight.level === 'QUARTERFINAL'
            ? (nextLevel = 'SEMIFINAL')
            : (nextLevel = 'FINAL');

          const bracket = await this.prisma.bracket.findFirst({
            where: {
              fightId: updatedFight.id,
            },
          });

          const nextBracketPosition = this.calcNextBracketPosition(
            nextLevel,
            bracket.position,
          );

          const nextBracketExist = await this.prisma.bracket.findFirst({
            where: {
              tournamentId: fight.tournamentId,
              level: nextLevel,
              position: nextBracketPosition,
            },
          });

          if (nextBracketExist) {
            const fightData = await this.prisma.fight.findUnique({
              where: { id: nextBracketExist.fightId },
            });

            await this.prisma.fight.update({
              where: {
                id: nextBracketExist.fightId,
              },
              data: {
                redFighterId: fightData.redFighterId
                  ? fightData.redFighterId
                  : data.winner,
                blueFighterId: fightData.blueFighterId
                  ? fightData.blueFighterId
                  : data.winner,
              },
            });
          } else {
            const nextFight = await this.prisma.fight.create({
              data: {
                tournamentId: updatedFight.tournamentId,
                level: nextLevel,
                redFighterId: updatedFight.winner,
              },
            });

            await this.prisma.bracket.create({
              data: {
                tournamentId: nextFight.tournamentId,
                fightId: nextFight.id,
                level: nextLevel,
                position: nextBracketPosition,
              },
            });
          }
        }
      }

      return updatedFight;
    } catch (error: any) {
      throw error;
    }
  }

  public async deleteTournamentFights(id: string): Promise<void> {
    try {
      await this.prisma.fight.deleteMany({ where: { tournamentId: id } });
    } catch (error: any) {
      throw error;
    }
  }
}
