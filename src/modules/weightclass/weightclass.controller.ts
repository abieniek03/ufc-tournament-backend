import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { WeightclassService } from './weightclass.service';
import { Weightclass as WeightclassModel, Sex } from '@prisma/client';
import {
  CreateWeightclassDto,
  UpdateWeichtclassDto,
} from './dto/weightclass.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '../../guards/admin-auth.guard';

@ApiTags('Weightclass')
@Controller('weightclass')
export class WeightclassController {
  constructor(private readonly weightclassService: WeightclassService) {}

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
  async createWeightclass(
    @Body() data: CreateWeightclassDto,
  ): Promise<WeightclassModel> {
    return await this.weightclassService.createWeightclass(data);
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
  async getAllWeightclass(
    @Query('sex') sex?: Sex,
  ): Promise<WeightclassModel[]> {
    return await this.weightclassService.getAllWeightclass(sex);
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
  async getWeightclassByName(
    @Param('id') id: string,
  ): Promise<WeightclassModel> {
    return await this.weightclassService.getWeightclassById(id.toUpperCase());
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
  async editWeightclass(
    @Param('id') id: string,
    @Body() data: UpdateWeichtclassDto,
  ) {
    return await this.weightclassService.editWeightclass(
      id.toUpperCase(),
      data,
    );
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
  async deleteWeightclass(@Param('id') id: string): Promise<void> {
    await this.weightclassService.deleteWeightclass(id);
  }
}
