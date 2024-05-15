import { Module } from '@nestjs/common';
import { WeightclassController } from './weightclass.controller';
import { WeightclassService } from './weightclass.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [WeightclassController],
  providers: [WeightclassService, PrismaService],
})
export class WeightclassModule {}
