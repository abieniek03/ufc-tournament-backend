import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateFighterDto, UpdateFighterDto } from './dto/fighters.dto';
import { Fighter, Sex } from '@prisma/client';

@Injectable()
export class FightersService {
  constructor(private prisma: PrismaService) {}

  private createFighterId(firstName: string, lastName: string) {
    const fighterId = `${firstName.toLocaleLowerCase()}-${lastName.toLocaleLowerCase().replace(' ', '')}`;
    return fighterId;
  }

  public async addNewFighter(data: CreateFighterDto): Promise<Fighter> {
    try {
      return await this.prisma.fighter.create({
        data: {
          id: this.createFighterId(data.firstName, data.lastName),
          ...data,
        },
      });
    } catch (error: any) {
      if (error.name === 'PrismaClientValidationError') {
        throw new BadRequestException(error);
      }

      if (error.code === 'P2002') {
        throw new ConflictException(error);
      }

      throw error;
    }
  }

  public async getAllFighters(
    sex?: Sex,
    weightclassId?: string,
  ): Promise<Fighter[]> {
    try {
      const data = await this.prisma.fighter.findMany({
        where: sex || weightclassId ? { OR: [{ sex }, { weightclassId }] } : {},
        include: {
          ranking: {
            select: {
              position: true,
            },
          },
        },
        orderBy: {
          ranking: {
            position: 'asc',
          },
        },
      });

      if (!data.length) throw new NotFoundException('Any fighters not found.');

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getFighterById(id: string): Promise<Fighter> {
    try {
      const data = await this.prisma.fighter.findFirst({
        where: { id },
        include: {
          ranking: {
            select: {
              position: true,
            },
          },
        },
      });

      if (!data) throw new NotFoundException('Fighter not found.');

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  public async editFighter(
    id: string,
    data: UpdateFighterDto,
  ): Promise<Fighter> {
    try {
      return await this.prisma.fighter.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Fighter not found.');
      }

      throw error;
    }
  }

  public async deleteFighter(id: string): Promise<any> {
    try {
      await this.prisma.fighter.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Fighter not found.');
      }

      throw error;
    }
  }
}
