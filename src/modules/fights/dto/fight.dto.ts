import { Method } from '@prisma/client';

export class UpdateFightResultDto {
  winner: string;
  round: number;
  method: Method;
  time: string;
  description: string;
}
