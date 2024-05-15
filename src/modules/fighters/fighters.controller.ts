import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FightersService } from './fighters.service';
import { CreateFighterDto, UpdateFighterDto } from './dto/fighters.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/ guards/admin-auth.guard';
import { Fighter as FighterModel, Sex } from '@prisma/client';

@ApiTags('Fighters')
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

  @UseGuards(new AdminAuthGuard())
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
  async editFighter(
    @Param('id') id: string,
    @Body() data: UpdateFighterDto,
  ): Promise<FighterModel> {
    return await this.fightersService.editFighter(id, data);
  }

  @UseGuards(new AdminAuthGuard())
  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Success',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async deleteFighter(@Param('id') id: string): Promise<void> {
    await this.fightersService.deleteFighter(id);
  }
}
