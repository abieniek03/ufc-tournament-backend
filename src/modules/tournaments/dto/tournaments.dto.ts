import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty()
  weightclassId: string;

  @ApiProperty()
  fighters: string[];
}

export class UpdateTournamentDto extends PartialType(CreateTournamentDto) {}
