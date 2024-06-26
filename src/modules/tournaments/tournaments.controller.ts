import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TournamentsService } from './tournaments.service';
import { ScoreService } from '../score/score.service';
import { FightsService } from '../fights/fights.service';
import { Tournament as TournamentModel } from '@prisma/client';
import {
  CreateTournamentDto,
  UpdateTournamentDto,
} from './dto/tournaments.dto';
import { ClerkAuthGuard } from '../../guards/clerk-auth.guard';
@UseGuards(new ClerkAuthGuard())
@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(
    private readonly tournamentsService: TournamentsService,
    private readonly scoreService: ScoreService,
    private readonly fightsService: FightsService,
  ) {}

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
  async createTournament(
    @Headers('user-id') userId: string,
    @Body() data: CreateTournamentDto,
  ): Promise<TournamentModel> {
    return await this.tournamentsService.createTournament(userId, data);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getAllTournaments(
    @Headers('user-id') userId: string,
  ): Promise<TournamentModel[]> {
    return await this.tournamentsService.getAllTournaments(userId);
  }

  @Get(':id')
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
  async getTournamentById(
    @Headers('user-id') userId: string,
    @Param('id') id: string,
  ): Promise<TournamentModel> {
    return await this.tournamentsService.getTournamentById(userId, id);
  }

  @Patch(':id')
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
  async editTournament(
    @Headers('user-id') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateTournamentDto,
  ): Promise<TournamentModel> {
    return await this.tournamentsService.editTournament(userId, id, data);
  }

  @Delete(':id')
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
  async deleteAllTournamentData(
    @Headers('user-id') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.tournamentsService.deleteTournament(userId, id);
    await this.scoreService.deleteTournamentScore(id);
    await this.fightsService.deleteTournamentFights(id);
  }
}
