import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Level } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ClerkAuthGuard } from 'src/guards/clerk-auth.guard';
import { FighterDraw, FirstFight } from '../fights/types/fight.types';

@UseGuards(new ClerkAuthGuard())
@Injectable()
export class DrawService {
  constructor(private readonly prisma: PrismaService) {}

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

  private selectCorners(fighter: FighterDraw, opponent: FighterDraw) {
    const redFighter =
      fighter.index > opponent.index ? opponent.id : fighter.id;
    const blueFighter =
      fighter.index > opponent.index ? fighter.id : opponent.id;

    return { redFighter, blueFighter };
  }

  private async drawFights(
    tournamentId: string,
    level: Level,
    firstFight: FirstFight,
  ): Promise<void> {
    try {
      const allFighters = await this.prisma.score.findMany({
        where: {
          win: firstFight === 'WIN' ? 1 : 0,
          lose: firstFight === 'LOSE' ? 1 : 0,
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

      const roaster: string[] = [];

      allFighters.forEach((el) => roaster.push(el.fighterId));

      if (roaster.length % 2 !== 0) {
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

        const luckyFighters = drawFighters.slice(
          firstFight === 'WIN' ? 0 : drawFighters.length / 2,
          firstFight === 'WIN' ? drawFighters.length / 2 : undefined,
        );
        luckyFighters.forEach((el) => roaster.push(el.fighterId));
      }

      for (let i = 0; i < allFighters.length / 2; i++) {
        const fightersFree: string[] = await this.fightersFree(level, roaster);

        const drawFighterIndex = Math.floor(
          Math.random() * fightersFree.length,
        );
        const fighter: FighterDraw = {
          id: fightersFree[drawFighterIndex],
          index: drawFighterIndex,
        };

        const possibleOpponents = fightersFree.filter(
          (el) => el !== fighter.id,
        );

        const drawOpponentIndex = Math.floor(
          Math.random() * possibleOpponents.length,
        );

        const opponent: FighterDraw = {
          id: possibleOpponents[drawOpponentIndex],
          index: drawOpponentIndex,
        };

        const corners = this.selectCorners(fighter, opponent);

        await this.prisma.fight.create({
          data: {
            tournamentId,
            level,
            redFighterId: corners.redFighter,
            blueFighterId: corners.blueFighter,
          },
        });
      }
    } catch (error: any) {
      throw error;
    }
  }

  public async draw(
    userId: string,
    tournamentId: string,
    level: Level,
  ): Promise<void> {
    console.log(tournamentId);
    console.log('===');
    console.log('siema');
    console.log(level);

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
      } catch (error: any) {
        throw error;
      }
    }

    if (level === 'ROUND_2') {
      try {
        await this.drawFights(tournamentId, level, 'WIN');
        await this.drawFights(tournamentId, level, 'LOSE');
      } catch (error: any) {
        throw error;
      }
    }
  }
}
