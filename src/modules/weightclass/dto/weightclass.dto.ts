import { ApiProperty } from '@nestjs/swagger';

export type Sex = 'MALE' | 'FEMALE';

export class WeightclassDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sex: Sex;

  @ApiProperty()
  limit: number;
}
