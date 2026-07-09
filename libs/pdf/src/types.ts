import type { ParentConfig } from '@sierrita/parents';
import type { GameStat, ProfileStats } from '@sierrita/storage';

export interface ReportProfileInfo {
  name: string;
  age: number;
}

export interface ReportData {
  profile: ReportProfileInfo;
  globalStats: ProfileStats;
  gameStats: GameStat[];
  config: ParentConfig;
  date: string;
}
