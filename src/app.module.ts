import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeightclassModule } from './modules/weightclass/weightclass.module';
import { FightersModule } from './modules/fighters/fighters.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { DrawModule } from './modules/draw/draw.module';
import { FightsModule } from './modules/fights/fights.module';
import { ScoreModule } from './modules/score/score.module';
import { BracketModule } from './modules/bracket/bracket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WeightclassModule,
    FightersModule,
    RankingModule,
    TournamentsModule,
    DrawModule,
    FightsModule,
    ScoreModule,
    BracketModule,
  ],
})
export class AppModule {}
