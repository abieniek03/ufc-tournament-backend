import { Method } from '@prisma/client';

export type FirstFight = 'WIN' | 'LOSE';

export interface FightBaseResponse {
  id: string;
  tournamentId: string;
  redFighterId: string;
  blueFighterId: string;
  winner: string | null;
  round: number | null;
  method: Method | null;
  time: string | null;
  description: string | null;
}

export interface FighterDraw {
  id: string;
  index: number;
}
