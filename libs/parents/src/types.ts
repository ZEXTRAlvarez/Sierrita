export type World = 'jungle' | 'ocean' | 'space';
export type FontScale = 'normal' | 'large';

export interface ParentConfig {
  profileId: string;
  pinHash: string;
  maxSessionMinutes: number;
  worldsEnabled: World[];
  updatedAt: number;
  hasSeenWalkthrough: boolean;
  fontScale: FontScale;
  highContrast: boolean;
}

export interface LearningGoal {
  profileId: string;
  targetSessionsPerWeek: number;
  updatedAt: number;
}
