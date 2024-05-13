import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Score } from '@prisma/client';
import { ClerkAuthGuard } from 'src/ guards/clerk-auth.guard';

@UseGuards(new ClerkAuthGuard())
@Injectable()
export class ScoreService {
  constructor(private readonly prisma: PrismaService) {}

  public async getTournamentScore(
    userId: string,
    tournamentId: string,
  ): Promise<Score[]> {
    try {
      const tournamentScore = await this.prisma.score.findMany({
        where: { tournamentId },
        orderBy: [
          { positionIndex: 'desc' },
          { points: 'desc' },
          { win: 'asc' },
          { ranking: 'asc' },
        ],
        include: {
          fighter: {
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

      if (!tournamentScore.length) {
        throw new NotFoundException(
          'Tournament score not found. Probably tournament not exist.',
        );
      }

      tournamentScore.forEach((el) => {
        if (el.tournament.userId !== userId)
          throw new ForbiddenException('You are not owner of this tournament.');
      });

      return tournamentScore;
    } catch (error: any) {
      throw error;
    }
  }
}
