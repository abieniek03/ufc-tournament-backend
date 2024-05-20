import { Module } from '@nestjs/common';
import { DrawController } from './draw.controller';
import { DrawService } from './draw.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [DrawController],
  providers: [DrawService, PrismaService],
})
export class DrawModule {}
