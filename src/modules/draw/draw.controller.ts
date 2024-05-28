import {
  Controller,
  Post,
  Headers,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { DrawService } from './draw.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Level } from '@prisma/client';
import { ClerkAuthGuard } from 'src/guards/clerk-auth.guard';

@UseGuards(new ClerkAuthGuard())
@ApiTags('Draw')
@Controller('draw')
export class DrawController {
  constructor(private readonly drawService: DrawService) {}

  @Post('/:tournamentId/:level')
  @HttpCode(204)
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
  async draw(
    @Headers('user-id') userId: string,
    @Param('tournamentId') tournamentId: string,
    @Param('level') level: Level,
  ): Promise<void> {
    await this.drawService.draw(userId, tournamentId, level);
  }
}
