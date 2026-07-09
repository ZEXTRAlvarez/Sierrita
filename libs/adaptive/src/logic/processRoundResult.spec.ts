import { processRoundResult } from './processRoundResult';
import { createInitialDifficultyState } from './difficultyStateFactory';
import type { DifficultyState } from '../types';

const base = (overrides: Partial<DifficultyState> = {}): DifficultyState => ({
  ...createInitialDifficultyState('p1', 'counting'),
  ...overrides,
});

describe('processRoundResult', () => {
  it('increments totalAttempts and totalCorrect on a correct answer', () => {
    const { next } = processRoundResult(base(), true);

    expect(next.totalAttempts).toBe(1);
    expect(next.totalCorrect).toBe(1);
    expect(next.consecutiveHits).toBe(1);
  });

  it('increments totalAttempts but not totalCorrect on a wrong answer', () => {
    const { next } = processRoundResult(base(), false);

    expect(next.totalAttempts).toBe(1);
    expect(next.totalCorrect).toBe(0);
    expect(next.consecutiveMiss).toBe(1);
  });

  it('levels up after 3 consecutive hits', () => {
    let state = base();
    let levelChanged = false;
    let levelUp = false;
    for (let i = 0; i < 3; i++) {
      ({ next: state, levelChanged, levelUp } = processRoundResult(state, true));
    }

    expect(state.currentLevel).toBe(2);
    expect(levelChanged).toBe(true);
    expect(levelUp).toBe(true);
    expect(state.consecutiveHits).toBe(0);
  });

  it('does not level up before reaching the hit threshold', () => {
    let state = base();
    let levelChanged = false;
    for (let i = 0; i < 2; i++) {
      ({ next: state, levelChanged } = processRoundResult(state, true));
    }

    expect(state.currentLevel).toBe(1);
    expect(levelChanged).toBe(false);
  });

  it('caps out at level 3 and does not overflow on further hits', () => {
    let state = base({ currentLevel: 3 });
    let levelChanged = false;
    for (let i = 0; i < 3; i++) {
      ({ next: state, levelChanged } = processRoundResult(state, true));
    }

    expect(state.currentLevel).toBe(3);
    expect(levelChanged).toBe(false);
  });

  it('levels down after 2 consecutive misses', () => {
    let state = base({ currentLevel: 2 });
    let levelChanged = false;
    let levelUp = true;
    for (let i = 0; i < 2; i++) {
      ({ next: state, levelChanged, levelUp } = processRoundResult(state, false));
    }

    expect(state.currentLevel).toBe(1);
    expect(levelChanged).toBe(true);
    expect(levelUp).toBe(false);
    expect(state.consecutiveMiss).toBe(0);
  });

  it('floors out at level 1 and does not underflow on further misses', () => {
    let state = base({ currentLevel: 1 });
    let levelChanged = false;
    for (let i = 0; i < 2; i++) {
      ({ next: state, levelChanged } = processRoundResult(state, false));
    }

    expect(state.currentLevel).toBe(1);
    expect(levelChanged).toBe(false);
  });

  it('resets the opposite counter when the result type flips', () => {
    const afterTwoHits = processRoundResult(
      processRoundResult(base(), true).next,
      true,
    ).next;
    expect(afterTwoHits.consecutiveHits).toBe(2);

    const afterMiss = processRoundResult(afterTwoHits, false).next;

    expect(afterMiss.consecutiveHits).toBe(0);
    expect(afterMiss.consecutiveMiss).toBe(1);
  });

  it('handles a realistic mixed hit/miss sequence', () => {
    let state = base();
    const sequence = [true, true, false, true, true, true];
    let lastLevelUp = false;
    for (const correct of sequence) {
      ({ next: state, levelUp: lastLevelUp } = processRoundResult(state, correct));
    }

    // hit, hit, miss(resets), hit, hit, hit -> levels up on the 3rd consecutive hit
    expect(state.currentLevel).toBe(2);
    expect(lastLevelUp).toBe(true);
    expect(state.totalAttempts).toBe(6);
    expect(state.totalCorrect).toBe(5);
  });
});
