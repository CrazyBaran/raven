export class GrowthStageDto {
  public specter: SpecterGrowthStage;
  public dealRoom: DealRoomGrowthStage;
  public evaluated: string;
}

export type SpecterGrowthStage =
  | 'Bootstrapped'
  | 'Early Stage'
  | 'Exit Stage'
  | 'Growth Stage'
  | 'Late Stage'
  | 'Pre-seed / Seed';

export type DealRoomGrowthStage =
  | 'early growth'
  | 'late growth'
  | 'mature'
  | 'seed';
