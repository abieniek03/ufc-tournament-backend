import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ScoreService } from '../score/score.service';
import { Level, Score } from '@prisma/client';

@Injectable()
export class KnockoutService {
  constructor(
    private readonly prisma: PrismaService,
    private scoreService: ScoreService,
  ) {}

  private async createKnockoutFight(
    tournamentId: string,
    level: Level,
    fighters: Score[],
  ) {
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

        await this.prisma.knockout.create({
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
  ): Promise<any> {
    const score = await this.scoreService.getTournamentScore(
      userId,
      tournamentId,
    );

    const knockoutFirstRoundFights = score.length / 2;

    const fighters = score.slice(0, knockoutFirstRoundFights / 2);

    const roundName: Level = fighters.length === 4 ? 'QUARTERFINAL' : 'LAST_16';

    await this.createKnockoutFight(tournamentId, roundName, fighters);

    return { knockoutFirstRoundFights, fighters };
  }
}
