import { Method } from '@prisma/client';

export class UpdateFightResultDto {
  winner: string;
  method: Method;
  round: number;
}

