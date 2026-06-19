export type World = 'jungle' | 'ocean' | 'space';

export interface ParentConfig {
  profileId: string;
  pinHash: string;
  maxSessionMinutes: number;
  worldsEnabled: World[];
  updatedAt: number;
}
