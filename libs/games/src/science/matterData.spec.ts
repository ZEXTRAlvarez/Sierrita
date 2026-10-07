import { getMatterItem, getMatterTransformation } from './matterData';

describe('getMatterItem', () => {
  it('only returns items within the requested tier pool', () => {
    for (let i = 0; i < 20; i++) {
      const item = getMatterItem([1]);
      expect(item.tier).toBe(1);
    }
  });

  it('can draw items of every state across enough draws', () => {
    const states = new Set(
      Array.from({ length: 30 }, () => getMatterItem([1, 2]).state),
    );
    expect(states.has('solid')).toBe(true);
    expect(states.has('liquid')).toBe(true);
    expect(states.has('gas')).toBe(true);
  });
});

describe('getMatterTransformation', () => {
  it('always returns a transformation whose toState differs from fromState', () => {
    for (let i = 0; i < 20; i++) {
      const t = getMatterTransformation();
      expect(t.toState).not.toBe(t.fromState);
    }
  });
});
