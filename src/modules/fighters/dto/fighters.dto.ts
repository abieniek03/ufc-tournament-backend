import { ApiProperty } from '@nestjs/swagger';
import { Sex } from '@prisma/client';

export class CreateFighterDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  sex: Sex;

  @ApiProperty()
  nationality: string;

  @ApiProperty()
  nationalityId: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  weightclassId: string;

  @ApiProperty()
  win: number;

  @ApiProperty()
  lose: number;

  @ApiProperty()
  draw: number;

  @ApiProperty()
  noContest: number;
}

export class UpdateFighterDto {
  @ApiProperty()
  nationality: string;

  @ApiProperty()
  nationalityId: string;

  @ApiProperty()
  win: number;

  @ApiProperty()
  lose: number;

  @ApiProperty()
  draw: number;

  @ApiProperty()
  noContest: number;
}
