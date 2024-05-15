import { ApiProperty, PartialType } from '@nestjs/swagger';

export type Sex = 'MALE' | 'FEMALE';

class WeightclassDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  sex: Sex;

  @ApiProperty()
  limit: number;
}

export class CreateWeightclassDto extends WeightclassDto {
  @ApiProperty()
  id: string;
}

export class UpdateWeichtclassDto extends PartialType(WeightclassDto) {}
