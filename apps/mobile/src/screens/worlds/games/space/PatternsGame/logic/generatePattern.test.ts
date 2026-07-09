import { generatePattern } from './generatePattern';

describe('generatePattern', () => {
  it('builds a sequence one longer than the requested pattern length, blanking the last item', () => {
    const round = generatePattern(3, ['color'], 2);

    expect(round.sequence).toHaveLength(4);
    expect(round.missingIdx).toBe(3);
    expect(round.answer).toBe(round.sequence[round.missingIdx]);
  });

  it('produces the requested number of unique choices, including the answer', () => {
    const round = generatePattern(4, ['shape'], 3);

    expect(round.choices).toHaveLength(3);
    expect(new Set(round.choices).size).toBe(3);
    expect(round.choices).toContain(round.answer);
  });

  it('follows a repeating unit for the shown (non-blank) items', () => {
    const round = generatePattern(5, ['color'], 2);
    const unitLen = 2; // patternLength > 3 but single attribute => unit length 2

    for (let i = 0; i < round.sequence.length - 1; i++) {
      if (i >= unitLen) {
        expect(round.sequence[i]).toBe(round.sequence[i % unitLen]);
      }
    }
  });

  it('works with combined shape+color attributes', () => {
    const round = generatePattern(3, ['shape', 'color'], 2);

    expect(round.sequence).toHaveLength(4);
    expect(round.choices).toContain(round.answer);
  });
});
