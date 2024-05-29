import { Module } from '@nestjs/common';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { ScoreService } from '../score/score.service';
import { FightsService } from '../fights/fights.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService, ScoreService, FightsService, PrismaService],
})
export class TournamentsModule {}
