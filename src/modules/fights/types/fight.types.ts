export type FirstFight = 'WIN' | 'LOSE';

export interface FightBaseResponse {
  id: string;
  tournamentId: string;
  redFighterId: string;
  blueFighterId: string;
}

export interface FighterDraw {
  id: string;
  index: number;
}
