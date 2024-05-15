export interface WeightclassRankingResponse {
  fighterId: string;
  weightclassId: string;
  position: number;
  positionPrevious: number;
  createdAt: Date;
  updatedAt: Date;
  fighter: {
    firstName: string;
    lastName: string;
  };
}
