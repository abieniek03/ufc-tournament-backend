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

  public async createTournament(
    userId: string,
    data: CreateTournamentDto,
  ): Promise<Tournament> {
    try {
      const fighters = data.fighters.length;

      if (fighters === 8 || fighters === 16) {
        return await this.prisma.tournament.create({
          data: {
            ...data,
            userId,
            fighters,
          },
        });
      } else {
        throw new BadRequestException('You must select 8 or 16 fighters.');
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  public async getAllTournaments(userId: string): Promise<Tournament[]> {
    try {
      const tournaments = await this.prisma.tournament.findMany({
        where: { userId },
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
    const fighters = data.fighters.length;

    try {
      const tournament = await this.prisma.tournament.findUnique({
        where: { id },
      });

      if (!tournament) throw new NotFoundException('Tournament not found.');

      if (tournament.userId !== userId)
        throw new ForbiddenException('You are not owner of this tournament.');

      if (fighters === 8 || fighters === 16) {
        return await this.prisma.tournament.update({
          where: { id },
          data: { ...data, fighters },
        });
      } else {
        throw new BadRequestException('You must select 8 or 16 fighters.');
      }
    } catch (error: any) {
      throw error;
    }
  }
}
