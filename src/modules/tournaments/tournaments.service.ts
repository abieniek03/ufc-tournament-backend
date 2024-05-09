import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTournamentDto } from './dto/tournaments.dto';
import { Tournament } from '@prisma/client';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  public async createTournament(
    userId: string,
    data: CreateTournamentDto,
  ): Promise<Tournament> {
    try {
      return await this.prisma.tournament.create({
        data: {
          userId,
          ...data,
        },
      });
    } catch (error: any) {
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
}
