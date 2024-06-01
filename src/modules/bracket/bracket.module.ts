import { Module } from '@nestjs/common';
import { BracketController } from './bracket.controller';
import { BracketService } from './bracket.service';
import { ScoreService } from '../score/score.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { DrawService } from '../draw/draw.service';

@Module({
  controllers: [BracketController],
  providers: [BracketService, ScoreService, DrawService, PrismaService],
})
export class BracketModule {}
