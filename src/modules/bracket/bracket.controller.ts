import {
  Controller,
  UseGuards,
  Post,
  Get,
  Headers,
  Param,
  Query,
  Patch,
  Body,
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
  async drawKnockoutStage(
    @Headers('user-id') userId: string,
    @Param('tournamentId') tournamentId: string,
  ): Promise<any> {
    return await this.bracketService.drawKnockoutStage(userId, tournamentId);
  }
}
