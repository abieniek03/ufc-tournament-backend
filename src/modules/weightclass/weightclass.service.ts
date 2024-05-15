import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateWeightclassDto,
  UpdateWeichtclassDto,
} from './dto/weightclass.dto';
import { Weightclass, Sex } from '@prisma/client';

@Injectable()
export class WeightclassService {
  constructor(private prisma: PrismaService) {}

  public async createWeightclass(
    data: CreateWeightclassDto,
  ): Promise<Weightclass> {
    try {
      return await this.prisma.weightclass.create({ data });
    } catch (error: any) {
      if (error.name === 'PrismaClientValidationError') {
        throw new BadRequestException('Checkout request body.');
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Weightclass already exist.');
      }

      throw error;
    }
  }

  public async getAllWeightclass(sex?: Sex): Promise<Weightclass[]> {
    try {
      const data = await this.prisma.weightclass.findMany({
        where: sex ? { sex } : {},
      });

      if (!data.length) throw new NotFoundException('Data not found.');

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getWeightclassById(id: string): Promise<Weightclass> {
    try {
      const data = await this.prisma.weightclass.findUnique({
        where: { id },
      });

      if (!data)
        throw new NotFoundException(`Weightclass with id="${id}" not found.`);

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  public async editWeightclass(
    id: string,
    data: UpdateWeichtclassDto,
  ): Promise<Weightclass> {
    try {
      return await this.prisma.weightclass.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error);
      }

      throw error;
    }
  }

  public async deleteWeightclass(id: string): Promise<void> {
    try {
      await this.prisma.weightclass.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(error);
      }

      throw error;
    }
  }
}
