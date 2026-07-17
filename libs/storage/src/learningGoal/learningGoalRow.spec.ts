import { rowToLearningGoal } from './learningGoalRow';

describe('rowToLearningGoal', () => {
  it('maps a raw row to a LearningGoal', () => {
    const row = {
      profile_id: 'p1',
      target_sessions_per_week: 5,
      updated_at: 1700000000,
    };

    expect(rowToLearningGoal(row)).toEqual({
      profileId: 'p1',
      targetSessionsPerWeek: 5,
      updatedAt: 1700000000,
    });
  });
});
