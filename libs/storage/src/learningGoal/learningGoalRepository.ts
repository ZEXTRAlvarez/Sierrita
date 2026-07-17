import type { LearningGoal } from '@sierrita/parents';
import { getDatabase } from '../schema/getDatabase';
import { rowToLearningGoal } from './learningGoalRow';

export async function getLearningGoal(
  profileId: string,
): Promise<LearningGoal | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM learning_goals WHERE profile_id = ?',
    [profileId],
  );
  return row ? rowToLearningGoal(row) : null;
}

export async function upsertLearningGoal(goal: LearningGoal): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO learning_goals
       (profile_id, target_sessions_per_week, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(profile_id) DO UPDATE SET
       target_sessions_per_week = excluded.target_sessions_per_week,
       updated_at               = excluded.updated_at`,
    [goal.profileId, goal.targetSessionsPerWeek, goal.updatedAt],
  );
}
