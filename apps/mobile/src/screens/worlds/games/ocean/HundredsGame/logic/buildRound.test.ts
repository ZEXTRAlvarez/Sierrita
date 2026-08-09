import { buildRound, type IdentifyRound } from './buildRound';
import { decompose } from './decompose';

describe('buildRound', () => {
  it('offers the digit of the number it asks about', () => {
    for (let i = 0; i < 200; i++) {
      const round = buildRound('identify', 299) as IdentifyRound;

      expect(round.answer).toBe(round.problem[round.field]);
      expect(round.answer).toBe(decompose(round.problem.number)[round.field]);
      expect(round.options).toContain(round.answer);
      expect(round.options).toHaveLength(4);
    }
  });

  it('never asks for the hundreds of a two-digit number', () => {
    for (let i = 0; i < 200; i++) {
      const round = buildRound('identify', 99) as IdentifyRound;

      expect(round.field).not.toBe('hundreds');
    }
  });

  it('offers every digit of the number in decompose mode', () => {
    for (let i = 0; i < 100; i++) {
      const round = buildRound('decompose', 299);
      if (round.mode !== 'decompose') throw new Error('wrong mode');

      expect(round.options.hundreds).toContain(round.problem.hundreds);
      expect(round.options.tens).toContain(round.problem.tens);
      expect(round.options.units).toContain(round.problem.units);
    }
  });

  it('offers the composed number in compose mode', () => {
    for (let i = 0; i < 100; i++) {
      const round = buildRound('compose', 299);
      if (round.mode !== 'compose') throw new Error('wrong mode');

      expect(round.options).toContain(round.problem.number);
      expect(round.options).toHaveLength(4);
    }
  });
});
