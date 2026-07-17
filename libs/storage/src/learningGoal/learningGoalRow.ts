import type { LearningGoal } from '@sierrita/parents';

export function rowToLearningGoal(row: Record<string, unknown>): LearningGoal {
  return {
    profileId: row.profile_id as string,
    targetSessionsPerWeek: row.target_sessions_per_week as number,
    updatedAt: row.updated_at as number,
  };
}
