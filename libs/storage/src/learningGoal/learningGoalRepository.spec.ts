import { setupTestDatabase } from '../schema/__testing__/setupTestDatabase';
import { __setTestDatabase } from '../schema/getDatabase';
import { getLearningGoal, upsertLearningGoal } from './learningGoalRepository';
import type { LearningGoal } from '@sierrita/parents';

const goal = (overrides: Partial<LearningGoal> = {}): LearningGoal => ({
  profileId: 'p1',
  targetSessionsPerWeek: 5,
  updatedAt: 1700000000,
  ...overrides,
});

beforeEach(async () => {
  __setTestDatabase(await setupTestDatabase());
});

afterEach(() => {
  __setTestDatabase(null);
});

describe('upsertLearningGoal / getLearningGoal', () => {
  it('inserts a new goal', async () => {
    await upsertLearningGoal(goal());

    await expect(getLearningGoal('p1')).resolves.toEqual(goal());
  });

  it('updates an existing goal on conflict', async () => {
    await upsertLearningGoal(goal());

    await upsertLearningGoal(goal({ targetSessionsPerWeek: 10 }));

    await expect(getLearningGoal('p1')).resolves.toEqual(
      goal({ targetSessionsPerWeek: 10 }),
    );
  });

  it('returns null when no goal exists for the profile', async () => {
    await expect(getLearningGoal('missing')).resolves.toBeNull();
  });
});
