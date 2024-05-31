import { Module } from '@nestjs/common';
import { KnockoutController } from './knockout.controller';
import { KnockoutService } from './knockout.service';
import { ScoreService } from '../score/score.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [KnockoutController],
  providers: [KnockoutService, ScoreService, PrismaService],
})
export class KnockoutModule {}
