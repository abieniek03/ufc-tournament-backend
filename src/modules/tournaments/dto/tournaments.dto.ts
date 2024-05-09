import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  weightclassId: string;

  @ApiProperty()
  fighters: string[];
}

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {}
