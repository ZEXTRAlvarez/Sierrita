import { getStory, pickQuestion } from './storyData';

describe('getStory', () => {
  it('only returns stories within the requested length pool', () => {
    for (let i = 0; i < 20; i++) {
      const s = getStory(['short']);
      expect(s.length).toBe('short');
    }
  });

  it('can return stories across a wider pool', () => {
    const lengths = new Set(
      Array.from({ length: 20 }, () => getStory(['short', 'medium']).length),
    );
    expect(lengths.size).toBeGreaterThan(0);
    for (const l of lengths) expect(['short', 'medium']).toContain(l);
  });

  it('every story has at least one question', () => {
    for (const length of ['short', 'medium', 'long'] as const) {
      const s = getStory([length]);
      expect(s.questions.length).toBeGreaterThan(0);
    }
  });
});

describe('pickQuestion', () => {
  it('prefers a question of the requested kind when one exists', () => {
    const story = getStory(['medium']);
    const q = pickQuestion(story, ['inferential']);
    const hasInferential = story.questions.some(
      (q) => q.kind === 'inferential',
    );
    if (hasInferential) expect(q.kind).toBe('inferential');
  });

  it('falls back to any question when no question matches the requested kinds', () => {
    const story = getStory(['short']);
    const q = pickQuestion(story, ['inferential']);
    expect(story.questions).toContainEqual(q);
  });

  it('always returns a question whose correctAnswer is one of its options', () => {
    for (const length of ['short', 'medium', 'long'] as const) {
      const story = getStory([length]);
      const q = pickQuestion(story, ['literal', 'inferential']);
      expect(q.options).toContain(q.correctAnswer);
    }
  });
});
