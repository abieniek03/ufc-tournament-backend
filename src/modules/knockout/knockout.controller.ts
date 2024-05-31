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
import { KnockoutService } from './knockout.service';

@UseGuards(new ClerkAuthGuard())
@ApiTags('Knockout')
@Controller('knockout')
export class KnockoutController {
  constructor(private knockoutService: KnockoutService) {}

  @Post('/:tournamentId')
  async drawKnockoutStage(
    @Headers('user-id') userId: string,
    @Param('tournamentId') tournamentId: string,
  ): Promise<any> {
    return await this.knockoutService.drawKnockoutStage(userId, tournamentId);
  }
}
