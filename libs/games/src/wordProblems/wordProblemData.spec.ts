import { getWordProblemTemplate, randomChildName } from './wordProblemData';

describe('getWordProblemTemplate', () => {
  it('only returns templates for the requested operations', () => {
    for (let i = 0; i < 20; i++) {
      const t = getWordProblemTemplate(['add']);
      expect(t.operation).toBe('add');
    }
  });

  it('can return templates for every supported operation', () => {
    const ops = new Set(
      Array.from(
        { length: 20 },
        () => getWordProblemTemplate(['add', 'sub', 'multiply']).operation,
      ),
    );
    expect(ops.has('add')).toBe(true);
    expect(ops.has('sub')).toBe(true);
    expect(ops.has('multiply')).toBe(true);
  });

  it('builds a non-empty question text from a name and two numbers', () => {
    const t = getWordProblemTemplate(['add']);
    const text = t.text('Ana', 3, 2);
    expect(text).toContain('Ana');
    expect(text.length).toBeGreaterThan(0);
  });
});

describe('randomChildName', () => {
  it('returns a non-empty name', () => {
    expect(randomChildName().length).toBeGreaterThan(0);
  });
});
