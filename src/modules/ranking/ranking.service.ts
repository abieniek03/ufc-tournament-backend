import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ranking } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRankingDto, UpdateRankingDto } from './dto/ranking.dto';
import { WeightclassRankingResponse } from './types/ranking.types';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  public async addRanking(data: CreateRankingDto): Promise<Ranking> {
    try {
      return await this.prisma.ranking.create({ data });
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Fighter not exist in roaster.');
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Fighter already exist in this ranking.');
      }

      throw error;
    }
  }

  public async getWeightClassRanking(
    weightclassId: string,
  ): Promise<WeightclassRankingResponse[]> {
    try {
      const ranking = await this.prisma.ranking.findMany({
        where: { weightclassId },
        orderBy: {
          position: 'asc',
        },
      });

      if (!ranking.length) throw new NotFoundException('Ranking not found.');

      const formatResponsePromises = ranking.map(async (el) => {
        try {
          const fighterData = await this.prisma.fighter.findUnique({
            where: { id: el.fighterId },
          });

          const rankingFighterData = ranking.find(
            (fighter: any) => fighter.fighterId === fighterData.id,
          );

          return {
            weightclass: fighterData.weightclassId,
            id: fighterData.id,
            firstName: fighterData.firstName,
            lastName: fighterData.lastName,
            position: rankingFighterData.position,
            positionPrevious: rankingFighterData.positionPrevious
              ? rankingFighterData.positionPrevious -
                rankingFighterData.position
              : null,
          };
        } catch (error: any) {
          throw error;
        }
      });

      return await Promise.all(formatResponsePromises);
    } catch (error: any) {
      throw error;
    }
  }

  public async editRanking(
    fighterId: string,
    data: UpdateRankingDto,
  ): Promise<Ranking> {
    try {
      const fighter = await this.prisma.ranking.findUnique({
        where: { fighterId },
      });

      if (!fighter) throw new NotFoundException('Fighter not found.');

      return await this.prisma.ranking.update({
        where: { fighterId },
        data: {
          ...data,
          positionPrevious: fighter.position,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  public async deleteRankingFighter(fighterId: string) {
    try {
      await this.prisma.ranking.delete({ where: { fighterId } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Fighter not found in ranking.');
      }

      throw error;
    }
  }
}
