import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { WeightclassDto } from './dto/weightclass.dto';
import { Weightclass, Sex } from '@prisma/client';

@Injectable()
export class WeightclassService {
  constructor(private prisma: PrismaService) {}

  private async findWeightclass(
    name: string,
    limit?: number,
    sex?: Sex,
  ): Promise<Weightclass> {
    return await this.prisma.weightclass.findFirst({
      where: {
        AND: [
          {
            OR: [{ name }, { limit }],
          },
          { sex },
        ],
      },
    });
  }

  public async createWeightclass(data: WeightclassDto): Promise<Weightclass> {
    const isExist = await this.findWeightclass(data.name, data.limit, data.sex);

    if (isExist)
      throw new ConflictException(
        'Weightclass of name or limit already exist.',
      );

    return await this.prisma.weightclass.create({ data });
  }

  public async getAllWeightclass(sex?: Sex): Promise<Weightclass[]> {
    return await this.prisma.weightclass.findMany({
      where: sex ? { sex } : {},
    });
  }

  public async getWeightclassById(id: string): Promise<Weightclass> {
    const weightclass = await this.prisma.weightclass.findFirst({
      where: { id },
    });

    if (!weightclass) throw new NotFoundException('Weightclass not found.');

    return weightclass;
  }
}
