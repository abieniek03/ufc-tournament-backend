import { Module } from '@nestjs/common';
import { FightsController } from './fights.controller';
import { FightsService } from './fights.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [FightsController],
  providers: [FightsService, PrismaService],
})
export class FightsModule {}
