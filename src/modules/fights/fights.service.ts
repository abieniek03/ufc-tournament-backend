import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Level, Score } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ClerkAuthGuard } from 'src/ guards/clerk-auth.guard';
import { Fight } from '@prisma/client';
import { FightBaseResponse } from './types/fight.types';
import { UpdateFightResultDto } from './dto/fight.dto';

@UseGuards(new ClerkAuthGuard())
@Injectable()
export class FightsService {
  constructor(private readonly prisma: PrismaService) {}

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

  private async fightersFree(level: Level, allRoaster: any) {
    const fights = await this.prisma.fight.findMany({ where: { level } });

    const fightersBusy = [];

    fights.forEach((el) =>
      fightersBusy.push(el.redFighterId, el.blueFighterId),
    );

    const fightersFree = allRoaster.filter(
      (el: string) => !fightersBusy.includes(el),
    );

    return fightersFree;
  }

  public async drawOponent(
    userId: string,
    tournamentId: string,
    level: Level,
  ): Promise<FightBaseResponse[]> {
    if (level === 'ROUND_1') {
      try {
        const allFights = await this.prisma.fight.findMany({
          where: { tournamentId, level },
          include: {
            tournament: {
              select: {
                userId: true,
              },
            },
          },
        });

        if (allFights[0].tournament.userId !== userId)
          throw new ForbiddenException('You are not owner of this tournament.');

        allFights.forEach((el) => {
          if (el.blueFighterId)
            throw new ConflictException(
              'All fights already booked for this round.',
            );
        });

        const allFighters = await this.prisma.score.findMany({
          orderBy: { ranking: 'desc' },
          select: {
            fighterId: true,
          },
        });

        const opponentsAll = allFighters.slice(0, allFighters.length / 2);

        for (const fight of allFights) {
          const opponentsBusy = await this.prisma.fight.findMany({
            where: { tournamentId: fight.tournamentId },
            select: {
              blueFighterId: true,
            },
          });

          const opponentsFree = opponentsAll.filter(
            (opponent) =>
              !opponentsBusy.some(
                (budsyOpponent) =>
                  budsyOpponent.blueFighterId === opponent.fighterId,
              ),
          );

          await this.prisma.fight.update({
            where: {
              id: fight.id,
            },
            data: {
              blueFighterId:
                opponentsFree[Math.floor(Math.random() * opponentsFree.length)]
                  .fighterId,
            },
          });
        }

        return await this.prisma.fight.findMany({
          where: { tournamentId },
          select: {
            id: true,
            tournamentId: true,
            redFighterId: true,
            blueFighterId: true,
          },
        });
      } catch (error: any) {
        throw error;
      }
    }

    if (level === 'ROUND_2') {
      try {
        const allWinners = await this.prisma.score.findMany({
          where: {
            win: 1,
          },
          orderBy: [
            { positionIndex: 'desc' },
            { points: 'desc' },
            { ranking: 'asc' },
          ],
          select: {
            fighterId: true,
          },
        });

        const winnersRoaster = [];

        allWinners.forEach((el) => winnersRoaster.push(el.fighterId));

        if (winnersRoaster.length % 2 !== 0) {
          const drawFighters = await this.prisma.score.findMany({
            where: {
              draw: 1,
            },
            orderBy: {
              ranking: 'asc',
            },
            select: {
              fighterId: true,
            },
          });

          const luckyFighters = drawFighters.slice(0, drawFighters.length / 2);
          luckyFighters.forEach((el) => winnersRoaster.push(el.fighterId));
        }

        const fightersFree = await this.fightersFree(level, winnersRoaster);
        console.log(fightersFree);

        for (let i = 0; i < winnersRoaster.length / 2; i++) {
          console.log('elo');
        }
      } catch (error: any) {
        console.log(error);
        throw error;
      }
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
              bonusPoints = 3;
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
  ): Promise<any> {
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

      return await this.prisma.fight.update({
        where: { id: fightId },
        data,
      });
    } catch (error: any) {
      throw error;
    }
  }
}
