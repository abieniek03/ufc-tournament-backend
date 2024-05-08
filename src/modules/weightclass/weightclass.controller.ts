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
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/ guards/admin-auth.guard';

@ApiTags('Weightclass')
@Controller('weightclass')
export class WeightclassController {
  constructor(private readonly weightclassService: WeightclassService) {}

  @UseGuards(new AdminAuthGuard())
  @Post()
  async createWeightclass(
    @Body() data: CreateWeightclassDto,
  ): Promise<WeightclassModel> {
    return await this.weightclassService.createWeightclass(data);
  }

  @Get()
  async getAllWeightclass(
    @Query('sex') sex?: Sex,
  ): Promise<WeightclassModel[]> {
    return await this.weightclassService.getAllWeightclass(sex);
  }

  @Get(':id')
  async getWeightclassByName(
    @Param('id') id: string,
  ): Promise<WeightclassModel> {
    return await this.weightclassService.getWeightclassById(id.toUpperCase());
  }

  @UseGuards(new AdminAuthGuard())
  @Patch(':id')
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
  async deleteWeightclass(@Param('id') id: string): Promise<void> {
    await this.weightclassService.deleteWeightclass(id);
  }
}
