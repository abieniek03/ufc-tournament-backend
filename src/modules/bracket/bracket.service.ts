import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ScoreService } from '../score/score.service';
import { Bracket, Fight, Level, Score } from '@prisma/client';
import { DrawService } from '../draw/draw.service';

@Injectable()
export class BracketService {
  constructor(
    private readonly prisma: PrismaService,
    private scoreService: ScoreService,
    private drawService: DrawService,
  ) {}

  private async createBracket(
    tournamentId: string,
    level: Level,
    fighters: Score[],
  ) {
    const isExist = await this.prisma.bracket.findFirst({
      where: { tournamentId },
    });

    if (isExist)
      throw new ConflictException('Bracket of this tournament already exist.');

    let position = 1;
    for (const fighter of fighters) {
      try {
        const fight = await this.prisma.fight.create({
          data: {
            tournamentId,
            level,
            redFighterId: fighter.fighterId,
          },
        });

        await this.prisma.bracket.create({
          data: {
            tournamentId: fight.tournamentId,
            level: fight.level,
            fightId: fight.id,
            position,
          },
        });
        position++;
      } catch (error: any) {
        console.error(error);
      }
    }
  }

  public async drawKnockoutStage(
    userId: string,
    tournamentId: string,
  ): Promise<void> {
    const score = await this.scoreService.getTournamentScore(
      userId,
      tournamentId,
    );

    const knockoutFirstRoundFights = score.length / 2;

    const fighters = score.slice(0, knockoutFirstRoundFights / 2);
    const opponents = score.slice(
      knockoutFirstRoundFights / 2,
      knockoutFirstRoundFights,
    );
    const roundName: Level =
      fighters.length === 4 ? 'QUARTERFINAL' : 'SEMIFINAL';

    await this.createBracket(tournamentId, roundName, fighters);
    await this.drawService.drawOpponents(
      userId,
      tournamentId,
      roundName,
      opponents,
    );
  }

  public async getTournamentBracket(
    userId: string,
    tournamentId: string,
  ): Promise<Bracket[]> {
    const bracket = await this.prisma.bracket.findMany({
      where: { tournamentId },
      include: {
        tournament: true,
      },
    });

    for (const element of bracket) {
      if (element.tournament.userId !== userId)
        throw new ConflictException('You are not owner of this tournament.');
    }

    return bracket;
  }
}
