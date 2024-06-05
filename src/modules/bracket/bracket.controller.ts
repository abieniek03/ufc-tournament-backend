import {
  Controller,
  UseGuards,
  Post,
  Headers,
  Param,
  HttpCode,
} from '@nestjs/common';

import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ClerkAuthGuard } from '../../guards/clerk-auth.guard';
import { BracketService } from './bracket.service';

@UseGuards(new ClerkAuthGuard())
@ApiTags('Bracket')
@Controller('bracket')
export class BracketController {
  constructor(private bracketService: BracketService) {}

  @Post('/:tournamentId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
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
  async drawKnockoutStage(
    @Headers('user-id') userId: string,
    @Param('tournamentId') tournamentId: string,
  ): Promise<void> {
    return await this.bracketService.drawKnockoutStage(userId, tournamentId);
  }
}
