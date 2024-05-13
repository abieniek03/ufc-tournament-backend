import {
  Controller,
  UseGuards,
  Get,
  Headers,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { FightsService } from './fights.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Fight as FightModel } from '@prisma/client';
import { ClerkAuthGuard } from 'src/ guards/clerk-auth.guard';
import { Level } from '@prisma/client';
import { FightBaseResponse } from './types/fight.types';

@UseGuards(new ClerkAuthGuard())
@ApiTags('Fights')
@Controller('fights')
export class FightsController {
  constructor(private fightService: FightsService) {}

  @Get(':tournamentId')
  @ApiResponse({
    status: 200,
    description: 'Success',
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
  async getTournamentFights(
    @Headers('user-id') userId: string,
    @Param('tournamentId') tournamentId: string,
    @Query('level') level: Level,
  ): Promise<FightModel[]> {
    return await this.fightService.getTournamentFights(
      userId,
      tournamentId,
      level,
    );
  }

  @Patch(':tournamentId')
  @ApiResponse({
    status: 200,
    description: 'Success',
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
  @ApiResponse({
    status: 409,
    description: 'Conflict',
  })
  async drawOponent(
    @Headers('user-id') userId: string,
    @Param('tournamentId') tournamentId: string,
    @Query('level') level: Level,
  ): Promise<FightBaseResponse[]> {
    return await this.fightService.drawOponent(userId, tournamentId, level);
  }
}
