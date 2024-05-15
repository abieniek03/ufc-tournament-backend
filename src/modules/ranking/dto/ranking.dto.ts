import { ApiProperty } from '@nestjs/swagger';

export class CreateRankingDto {
  @ApiProperty()
  weightclassId: string;

  @ApiProperty()
  fighterId: string;

  @ApiProperty()
  position: number;
}

export class UpdateRankingDto {
  @ApiProperty()
  position?: number;
}
