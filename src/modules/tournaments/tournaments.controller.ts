import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  Get,
  Param,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TournamentsService } from './tournaments.service';
import { Tournament as TournamentModel } from '@prisma/client';
import { CreateTournamentDto } from './dto/tournaments.dto';
import { ClerkAuthGuard } from 'src/ guards/clerk-auth.guard';

@UseGuards(new ClerkAuthGuard())
@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

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
}
