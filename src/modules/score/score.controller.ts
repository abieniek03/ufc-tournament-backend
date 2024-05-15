import { Controller, Get, Headers, Param, UseGuards } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Score as ScoreModel } from '@prisma/client';
import { ClerkAuthGuard } from '../../guards/clerk-auth.guard';

@UseGuards(new ClerkAuthGuard())
@ApiTags('Score')
@Controller('score')
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

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
  async getTournamentScore(
    @Headers('user-id') userId: string,
    @Param('tournamentId') tournamentId: string,
  ): Promise<ScoreModel[]> {
    return await this.scoreService.getTournamentScore(userId, tournamentId);
  }
}
