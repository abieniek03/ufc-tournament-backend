import { Module } from '@nestjs/common';
import { FightersController } from './fighters.controller';
import { FightersService } from './fighters.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [FightersController],
  providers: [FightersService, PrismaService],
})
export class FightersModule {}
