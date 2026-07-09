import { xpToNextStage } from './xpToNextStage';

describe('xpToNextStage', () => {
  it('returns the xp gap to the next threshold', () => {
    expect(xpToNextStage(0, 100)).toBe(50);
    expect(xpToNextStage(1, 200)).toBe(300);
  });

  it('returns 0 once at the max evolution stage', () => {
    expect(xpToNextStage(3, 5000)).toBe(0);
  });
});
