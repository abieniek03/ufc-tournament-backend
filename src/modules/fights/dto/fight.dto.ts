import { Method } from '@prisma/client';

export class UpdateFightResultDto {
  winner: string;
  round: number;
  time: string;
  method: Method;
  description: string;
}
