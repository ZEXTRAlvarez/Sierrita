import { generateCarryProblem } from './generateCarryProblem';

describe('generateCarryProblem (two columns: tens/units)', () => {
  it('keeps both operands as two-digit numbers within [10, maxOperand]', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(60, ['add', 'sub'], 99, false);
      expect(p.a).toBeGreaterThanOrEqual(10);
      expect(p.a).toBeLessThanOrEqual(60);
      expect(p.b).toBeGreaterThanOrEqual(10);
      expect(p.b).toBeLessThanOrEqual(60);
      expect(p.columns.map((c) => c.place)).toEqual(['units', 'tens']);
    }
  });

  it('never produces a negative result for subtraction', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(60, ['sub'], 99, false);
      expect(p.op).toBe('sub');
      expect(p.a).toBeGreaterThanOrEqual(p.b);
      expect(p.result).toBeGreaterThanOrEqual(0);
      expect(p.result).toBe(p.a - p.b);
    }
  });

  it('keeps addition results within resultMax (two digits, no hundreds)', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(60, ['add'], 99, false);
      expect(p.op).toBe('add');
      expect(p.result).toBe(p.a + p.b);
      expect(p.result).toBeLessThanOrEqual(99);
    }
  });

  it('reconstructs the operands and result from the column digits', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(60, ['add', 'sub'], 99, false);
      const [units, tens] = p.columns;
      expect(tens.aDigit * 10 + units.aDigit).toBe(p.a);
      expect(tens.bDigit * 10 + units.bDigit).toBe(p.b);
      expect(tens.resultDigit * 10 + units.resultDigit).toBe(p.result);
    }
  });

  it('forces a carry in the units column when forceRegroup is true (addition)', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(60, ['add'], 99, true);
      const [units] = p.columns;
      expect(units.aDigit + units.bDigit).toBeGreaterThanOrEqual(10);
      expect(units.regroups).toBe(true);
    }
  });

  it('forces a borrow in the units column when forceRegroup is true (subtraction)', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(60, ['sub'], 99, true);
      const [units] = p.columns;
      expect(units.aDigit).toBeLessThan(units.bDigit);
      expect(units.regroups).toBe(true);
    }
  });

  it('avoids any regroup when forceRegroup is false', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(60, ['add', 'sub'], 99, false);
      expect(p.columns.some((c) => c.regroups)).toBe(false);
    }
  });

  it('the leftmost column never regroups', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(60, ['add', 'sub'], 99, true);
      expect(p.columns[p.columns.length - 1].regroups).toBe(false);
    }
  });
});

describe('generateCarryProblem (three columns: hundreds/tens/units)', () => {
  it('keeps both operands as three-digit numbers within [100, maxOperand]', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(500, ['add', 'sub'], 999, false, true);
      expect(p.a).toBeGreaterThanOrEqual(100);
      expect(p.a).toBeLessThanOrEqual(500);
      expect(p.b).toBeGreaterThanOrEqual(100);
      expect(p.b).toBeLessThanOrEqual(500);
      expect(p.columns.map((c) => c.place)).toEqual([
        'units',
        'tens',
        'hundreds',
      ]);
    }
  });

  it('reconstructs the operands and result from the column digits', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(500, ['add', 'sub'], 999, false, true);
      const [units, tens, hundreds] = p.columns;
      const toNumber = (h: number, t: number, u: number) =>
        h * 100 + t * 10 + u;
      expect(toNumber(hundreds.aDigit, tens.aDigit, units.aDigit)).toBe(p.a);
      expect(toNumber(hundreds.bDigit, tens.bDigit, units.bDigit)).toBe(p.b);
      expect(
        toNumber(hundreds.resultDigit, tens.resultDigit, units.resultDigit),
      ).toBe(p.result);
    }
  });

  it('never produces a negative result for subtraction', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(500, ['sub'], 999, false, true);
      expect(p.a).toBeGreaterThanOrEqual(p.b);
      expect(p.result).toBeGreaterThanOrEqual(0);
      expect(p.result).toBe(p.a - p.b);
    }
  });

  it('can carry from tens into hundreds when forced (addition)', () => {
    let sawTensCarry = false;
    for (let i = 0; i < 60; i++) {
      const p = generateCarryProblem(500, ['add'], 999, true, true);
      expect(p.columns.some((c) => c.regroups)).toBe(true);
      if (p.columns[1].regroups) sawTensCarry = true;
    }
    expect(sawTensCarry).toBe(true);
  });

  it('the leftmost (hundreds) column never regroups', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(500, ['add', 'sub'], 999, true, true);
      expect(p.columns[2].regroups).toBe(false);
    }
  });

  it('keeps the hundreds digit correct even when both units and tens cascade a carry/borrow', () => {
    // Regression for a reported bug: the hundreds column's offered digit
    // options didn't include the correct answer. Exercise the double-carry
    // chain (units -> tens -> hundreds) specifically, since a bug in
    // propagating the second carry would only surface here.
    let sawDoubleRegroup = false;
    for (let i = 0; i < 400; i++) {
      const op = i % 2 === 0 ? 'add' : 'sub';
      const p = generateCarryProblem(500, [op], 999, true, true);
      const [units, tens, hundreds] = p.columns;
      if (units.regroups && tens.regroups) {
        sawDoubleRegroup = true;
        const toNumber = (h: number, t: number, u: number) =>
          h * 100 + t * 10 + u;
        expect(
          toNumber(hundreds.resultDigit, tens.resultDigit, units.resultDigit),
        ).toBe(p.result);
      }
    }
    expect(sawDoubleRegroup).toBe(true);
  });
});

describe('generateCarryProblem (reaching 1000, familia del 1000)', () => {
  it('grows a fourth, thousands column instead of dropping the carry when the sum reaches 1000', () => {
    // 500 + 500 = 1000 is the deterministic case that forces a carry out of
    // the hundreds column; pinning Math.random avoids relying on rejection
    // sampling to stumble onto this exact edge.
    const randomSpy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.1) // picks the (only) 'add' operation
      .mockReturnValueOnce(0.4445) // a = rand(100, 999) -> 500
      .mockReturnValueOnce(0.4445); // b = rand(100, 999) -> 500

    const p = generateCarryProblem(999, ['add'], 1000, true, true);
    randomSpy.mockRestore();

    expect(p.a).toBe(500);
    expect(p.b).toBe(500);
    expect(p.result).toBe(1000);
    expect(p.columns.map((c) => c.place)).toEqual([
      'units',
      'tens',
      'hundreds',
      'thousands',
    ]);
    const [units, tens, hundreds, thousands] = p.columns;
    expect(thousands.resultDigit).toBe(1);
    expect(thousands.regroups).toBe(false);
    expect(hundreds.regroups).toBe(true);
    expect(
      thousands.resultDigit * 1000 +
        hundreds.resultDigit * 100 +
        tens.resultDigit * 10 +
        units.resultDigit,
    ).toBe(p.result);
  });

  it('never carries a sum below 1000 into a thousands column', () => {
    for (let i = 0; i < 100; i++) {
      const p = generateCarryProblem(999, ['add'], 1000, false, true);
      expect(p.result).toBeLessThanOrEqual(1000);
      if (p.result < 1000) {
        expect(p.columns.map((c) => c.place)).toEqual([
          'units',
          'tens',
          'hundreds',
        ]);
      }
    }
  });

  it('never adds a thousands column for the two-column (tens/units) mode', () => {
    for (let i = 0; i < 30; i++) {
      const p = generateCarryProblem(60, ['add'], 99, false, false);
      expect(p.columns.map((c) => c.place)).toEqual(['units', 'tens']);
    }
  });
});
