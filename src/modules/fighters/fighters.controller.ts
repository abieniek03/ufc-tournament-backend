import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { FightersService } from './fighters.service';
import { CreateFighterDto } from './dto/fighters.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/ guards/admin-auth.guard';
import { Fighter as FighterModel, Sex } from '@prisma/client';

@Controller('fighters')
export class FightersController {
  constructor(private readonly fightersService: FightersService) {}

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
  async addNewFighter(@Body() data: CreateFighterDto): Promise<FighterModel> {
    return await this.fightersService.addNewFighter(data);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getAllFighters(
    @Query('sex') sex?: Sex,
    @Query('weightclass') weightclassId?: string,
  ): Promise<FighterModel[]> {
    return await this.fightersService.getAllFighters(sex, weightclassId);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getFighterById(@Param('id') id: string): Promise<FighterModel> {
    return await this.fightersService.getFighterById(id);
  }
}
