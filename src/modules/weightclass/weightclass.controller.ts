import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { WeightclassService } from './weightclass.service';
import { Weightclass as WeightclassModel, Sex } from '@prisma/client';
import { WeightclassDto } from './dto/weightclass.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/ guards/admin-auth.guard';

@ApiTags('Weightclass')
@Controller('weightclass')
@UseGuards(new AdminAuthGuard())
export class WeightclassController {
  constructor(private readonly weightclassService: WeightclassService) {}

  @Post()
  async createWeightclass(
    @Body() data: WeightclassDto,
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
}
