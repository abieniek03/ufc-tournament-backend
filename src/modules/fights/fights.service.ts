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
    fightId: string,
    level: Level,
  ): Promise<any> {
    if (level === 'ROUND_1') {
      try {
        const fight = await this.prisma.fight.findUnique({
          where: { id: fightId },
          select: {
            id: true,
            tournamentId: true,
            redFighterId: true,
            blueFighterId: true,
          },
        });

        if (fight.blueFighterId)
          throw new ConflictException('This fight is already booked.');

        const allFighters = await this.prisma.score.findMany({
          orderBy: { ranking: 'desc' },
          select: {
            fighterId: true,
          },
        });

        const opponentsAll = allFighters.slice(0, allFighters.length / 2);
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
        return await this.prisma.fight.update({
          where: {
            id: fight.id,
          },
          data: {
            blueFighterId:
              opponentsFree[Math.floor(Math.random() * opponentsAll.length)]
                .fighterId,
          },
        });
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }
  }
}
