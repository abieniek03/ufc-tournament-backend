import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RankingService } from './ranking.service';
import { Ranking as RankingModel } from '@prisma/client';
import { CreateRankingDto, UpdateRankingDto } from './dto/ranking.dto';
import { AdminAuthGuard } from 'src/ guards/admin-auth.guard';
import { WeightclassRankingResponse } from './types/ranking.types';

@ApiTags('Ranking')
@Controller('rankings')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @UseGuards(new AdminAuthGuard())
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async addRanking(@Body() data: CreateRankingDto): Promise<RankingModel> {
    return await this.rankingService.addRanking(data);
  }

  @Get(':weightclass')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getWeightclassRanking(
    @Param('weightclass') weightclassId: string,
  ): Promise<WeightclassRankingResponse[]> {
    return await this.rankingService.getWeightClassRanking(weightclassId);
  }

  @UseGuards(new AdminAuthGuard())
  @Put(':fighterId')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async editRanking(
    @Param('fighterId') fighterId: string,
    @Body() data: UpdateRankingDto,
  ): Promise<any> {
    return await this.rankingService.editRanking(fighterId, data);
  }

  @UseGuards(new AdminAuthGuard())
  @Delete(':fighterId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Success',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async deleteWeightclass(
    @Param('fighterId') fighterId: string,
  ): Promise<void> {
    await this.rankingService.deleteRankingFighter(fighterId);
  }
}
