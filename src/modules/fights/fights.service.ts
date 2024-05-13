import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Level } from '@prisma/client';
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
            select: { userId: true },
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

      console.log(redFighterScore);
      console.log(blueFighterScore);

      await this.prisma.score.update({
        where: {
          id: redFighterScore.id,
        },
        data: {
          win: redFighterScore.win + 1,
        },
      });

      await this.prisma.score.update({
        where: {
          id: redFighterScore.id,
        },
        data: {
          win: redFighterScore.win + 1,
        },
      });

      return await this.prisma.fight.update({
        where: { id: fightId },
        data,
      });
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
}
