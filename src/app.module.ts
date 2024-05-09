import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeightclassModule } from './modules/weightclass/weightclass.module';
import { FightersModule } from './modules/fighters/fighters.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WeightclassModule,
    FightersModule,
    RankingModule,
    TournamentsModule,
  ],
})
export class AppModule {}
