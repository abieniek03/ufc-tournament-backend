import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateTournamentDto,
  UpdateTournamentDto,
} from './dto/tournaments.dto';
import { Tournament } from '@prisma/client';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  private async createTournamentScore(
    tournament: Tournament,
    allFighters: string[],
  ) {
    if (tournament) {
      for (const fighter of allFighters) {
        try {
          await this.prisma.score.create({
            data: {
              userId: tournament.userId,
              tournamentId: tournament.id,
              fighterId: fighter.split('#')[0],
              ranking:
                fighter.split('#')[1] === 'NR'
                  ? null
                  : parseInt(fighter.split('#')[1]),
            },
          });
        } catch (error: any) {
          throw error;
        }
      }
    }
  }

  private async setUpTournamentFights(tournamentId: string): Promise<void> {
    try {
      const allFighters = await this.prisma.score.findMany({
        orderBy: { ranking: 'asc' },
        select: {
          fighterId: true,
        },
      });

      const firstRoundFights: number = allFighters.length / 2;
      const mostRankedFighters = allFighters.slice(0, firstRoundFights);

      if (allFighters.length) {
        for (const fighter of mostRankedFighters) {
          try {
            await this.prisma.fight.create({
              data: {
                tournamentId,
                level: 'ROUND_1',
                redFighterId: fighter.fighterId,
              },
            });
          } catch (error: any) {
            throw error;
          }
        }
      }
    } catch (error: any) {
      throw error;
    }
  }

  public async createTournament(
    userId: string,
    data: CreateTournamentDto,
  ): Promise<Tournament> {
    try {
      const fightersCount = data.fighters.length;

      if (fightersCount === 8 || fightersCount === 6) {
        const createdTournament = await this.prisma.tournament.create({
          data: {
            ...data,
            userId,
            fighters: fightersCount,
          },
        });

        await this.createTournamentScore(createdTournament, data.fighters);
        await this.setUpTournamentFights(createdTournament.id);
        return createdTournament;
      } else {
        throw new BadRequestException('You must select 8 or 16 fighters.');
      }
    } catch (error: any) {
      throw error;
    }
  }

  public async getAllTournaments(userId: string): Promise<Tournament[]> {
    try {
      const tournaments = await this.prisma.tournament.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          weightclass: {
            select: {
              name: true,
              limit: true,
            },
          },
        },
      });

      if (!tournaments.length)
        throw new NotFoundException('No tournament was found.');

      return tournaments;
    } catch (error: any) {
      throw error;
    }
  }

  public async getTournamentById(
    userId: string,
    id: string,
  ): Promise<Tournament> {
    try {
      const tournament = await this.prisma.tournament.findUnique({
        where: { id },
        include: {
          weightclass: {
            select: {
              name: true,
              limit: true,
            },
          },
        },
      });

      if (!tournament) throw new NotFoundException('Tournament not found.');

      if (tournament.userId !== userId)
        throw new ForbiddenException('You are not owner of this tournament.');

      return tournament;
    } catch (error: any) {
      throw error;
    }
  }

  public async editTournament(
    userId: string,
    id: string,
    data: UpdateTournamentDto,
  ): Promise<Tournament> {
    const fightersCount = data.fighters.length;

    try {
      const tournament = await this.prisma.tournament.findUnique({
        where: { id },
      });

      if (!tournament) throw new NotFoundException('Tournament not found.');

      if (tournament.userId !== userId)
        throw new ForbiddenException('You are not owner of this tournament.');

      if (fightersCount === 8 || fightersCount === 16) {
        return await this.prisma.tournament.update({
          where: { id },
          data: { ...data, fighters: fightersCount },
        });
      } else {
        throw new BadRequestException('You must select 8 or 16 fighters.');
      }
    } catch (error: any) {
      throw error;
    }
  }

  public async deleteTournament(userId: string, id: string): Promise<any> {
    try {
      const tournament = await this.prisma.tournament.delete({ where: { id } });

      if (tournament.userId !== userId)
        throw new ForbiddenException('You are not owner of this tournament.');
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Tournament not found in ranking.');
      }

      throw error;
    }
  }
}
