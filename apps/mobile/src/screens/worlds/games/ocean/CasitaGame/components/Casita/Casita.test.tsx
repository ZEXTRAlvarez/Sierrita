import React from 'react';
import { render, fireEvent, act, within } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { Casita } from './Casita';
import type {
  CasitaColumn,
  CasitaProblem,
} from '../../logic/generateCarryProblem';

/** Finds the option button whose visible text matches (or, negated, doesn't match) a digit. */
function findByDigit(
  buttons: readonly ReactTestInstance[],
  digit: number,
  matches = true,
): ReactTestInstance {
  const found = buttons.find(
    (btn) => (within(btn).queryByText(String(digit)) !== null) === matches,
  );
  if (!found) throw new Error(`No option button found for digit ${digit}`);
  return found;
}

function twoColumnProblem(
  overrides: Partial<CasitaProblem> = {},
): CasitaProblem {
  const columns: CasitaColumn[] = [
    { place: 'units', aDigit: 5, bDigit: 3, resultDigit: 8, regroups: false },
    { place: 'tens', aDigit: 2, bDigit: 1, resultDigit: 3, regroups: false },
  ];
  return { a: 25, b: 13, op: 'add', columns, result: 38, ...overrides };
}

function threeColumnProblem(
  overrides: Partial<CasitaProblem> = {},
): CasitaProblem {
  const columns: CasitaColumn[] = [
    { place: 'units', aDigit: 5, bDigit: 3, resultDigit: 8, regroups: false },
    { place: 'tens', aDigit: 2, bDigit: 1, resultDigit: 3, regroups: false },
    {
      place: 'hundreds',
      aDigit: 1,
      bDigit: 2,
      resultDigit: 3,
      regroups: false,
    },
  ];
  return { a: 125, b: 213, op: 'add', columns, result: 338, ...overrides };
}

describe('Casita (two columns)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders the units column open and the tens column locked at first', () => {
    const problem = twoColumnProblem();
    const { getAllByTestId, getByTestId, queryAllByTestId } = render(
      <Casita problem={problem} onAnswer={jest.fn()} result="idle" />,
    );

    expect(getAllByTestId('casita-units-option')).toHaveLength(4);
    expect(queryAllByTestId('casita-tens-option')).toHaveLength(0);
    expect(getByTestId('casita-tens-locked')).toBeTruthy();
  });

  it('renders exactly one operator symbol, not nested inside any column', () => {
    const problem = threeColumnProblem({ op: 'sub' });
    const { getAllByTestId, getByText } = render(
      <Casita problem={problem} onAnswer={jest.fn()} result="idle" />,
    );

    expect(getAllByTestId('casita-op-symbol')).toHaveLength(1);
    expect(getByText('−')).toBeTruthy();

    for (const place of ['units', 'tens', 'hundreds']) {
      const column = getAllByTestId(`casita-column-${place}`)[0];
      expect(within(column).queryByTestId('casita-op-symbol')).toBeNull();
    }
  });

  it('unlocks the tens column immediately when the units column does not regroup', () => {
    const problem = twoColumnProblem();
    const { getAllByTestId, queryAllByTestId } = render(
      <Casita problem={problem} onAnswer={jest.fn()} result="idle" />,
    );

    fireEvent.press(getAllByTestId('casita-units-option')[0]);

    expect(queryAllByTestId('casita-regroup-badge-units')).toHaveLength(0);
    expect(getAllByTestId('casita-tens-option')).toHaveLength(4);
  });

  it('shows the regroup badge and delays the tens column when the units column regroups', () => {
    const problem = twoColumnProblem({
      columns: [
        {
          place: 'units',
          aDigit: 5,
          bDigit: 3,
          resultDigit: 8,
          regroups: true,
        },
        {
          place: 'tens',
          aDigit: 2,
          bDigit: 1,
          resultDigit: 3,
          regroups: false,
        },
      ],
    });
    const { getAllByTestId, getByTestId, queryAllByTestId } = render(
      <Casita problem={problem} onAnswer={jest.fn()} result="idle" />,
    );

    fireEvent.press(getAllByTestId('casita-units-option')[0]);

    expect(getByTestId('casita-regroup-badge-units')).toBeTruthy();
    expect(queryAllByTestId('casita-tens-option')).toHaveLength(0);

    act(() => jest.advanceTimersByTime(700));

    expect(getAllByTestId('casita-tens-option')).toHaveLength(4);
  });

  it('shows the borrow badge text for subtraction', () => {
    const problem = twoColumnProblem({
      op: 'sub',
      a: 42,
      b: 18,
      columns: [
        {
          place: 'units',
          aDigit: 2,
          bDigit: 8,
          resultDigit: 4,
          regroups: true,
        },
        {
          place: 'tens',
          aDigit: 4,
          bDigit: 1,
          resultDigit: 2,
          regroups: false,
        },
      ],
      result: 24,
    });
    const { getAllByTestId, getByText } = render(
      <Casita problem={problem} onAnswer={jest.fn()} result="idle" />,
    );

    fireEvent.press(getAllByTestId('casita-units-option')[0]);

    expect(getByText('Le pido 1 👈')).toBeTruthy();
  });

  it('calls onAnswer(true) once both columns are answered correctly', () => {
    const problem = twoColumnProblem();
    const onAnswer = jest.fn();
    const { getAllByTestId } = render(
      <Casita problem={problem} onAnswer={onAnswer} result="idle" />,
    );

    fireEvent.press(findByDigit(getAllByTestId('casita-units-option'), 8));
    fireEvent.press(findByDigit(getAllByTestId('casita-tens-option'), 3));

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it('calls onAnswer(false) when either column is answered incorrectly', () => {
    const problem = twoColumnProblem();
    const onAnswer = jest.fn();
    const { getAllByTestId } = render(
      <Casita problem={problem} onAnswer={onAnswer} result="idle" />,
    );

    fireEvent.press(
      findByDigit(getAllByTestId('casita-units-option'), 8, false),
    );
    fireEvent.press(getAllByTestId('casita-tens-option')[0]);

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(false);
  });
});

describe('Casita (three columns, with hundreds)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('keeps tens and hundreds locked until the columns to their right are answered', () => {
    const problem = threeColumnProblem();
    const { getAllByTestId, getByTestId } = render(
      <Casita problem={problem} onAnswer={jest.fn()} result="idle" />,
    );

    expect(getAllByTestId('casita-units-option')).toHaveLength(4);
    expect(getByTestId('casita-tens-locked')).toBeTruthy();
    expect(getByTestId('casita-hundreds-locked')).toBeTruthy();
  });

  it('unlocks columns one at a time, right to left, and submits once all three are answered', () => {
    const problem = threeColumnProblem();
    const onAnswer = jest.fn();
    const { getAllByTestId, getByTestId } = render(
      <Casita problem={problem} onAnswer={onAnswer} result="idle" />,
    );

    fireEvent.press(findByDigit(getAllByTestId('casita-units-option'), 8));
    expect(getAllByTestId('casita-tens-option')).toHaveLength(4);
    expect(getByTestId('casita-hundreds-locked')).toBeTruthy();

    fireEvent.press(findByDigit(getAllByTestId('casita-tens-option'), 3));
    expect(getAllByTestId('casita-hundreds-option')).toHaveLength(4);
    expect(onAnswer).not.toHaveBeenCalled();

    fireEvent.press(findByDigit(getAllByTestId('casita-hundreds-option'), 3));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true);
  });

  it('shows a regroup badge on the tens column when it carries into hundreds', () => {
    const problem = threeColumnProblem({
      columns: [
        {
          place: 'units',
          aDigit: 5,
          bDigit: 3,
          resultDigit: 8,
          regroups: false,
        },
        { place: 'tens', aDigit: 7, bDigit: 6, resultDigit: 3, regroups: true },
        {
          place: 'hundreds',
          aDigit: 1,
          bDigit: 2,
          resultDigit: 4,
          regroups: false,
        },
      ],
    });
    const { getAllByTestId, getByTestId, queryAllByTestId } = render(
      <Casita problem={problem} onAnswer={jest.fn()} result="idle" />,
    );

    fireEvent.press(findByDigit(getAllByTestId('casita-units-option'), 8));
    fireEvent.press(findByDigit(getAllByTestId('casita-tens-option'), 3));

    expect(getByTestId('casita-regroup-badge-tens')).toBeTruthy();
    expect(queryAllByTestId('casita-hundreds-option')).toHaveLength(0);

    act(() => jest.advanceTimersByTime(700));

    expect(getAllByTestId('casita-hundreds-option')).toHaveLength(4);
    // The hundreds column received the carry from tens: show "+1" next to
    // its top digit, no strikethrough (addition never reduces a digit).
    expect(getByTestId('casita-hundreds-carry-correction')).toBeTruthy();
    expect(queryAllByTestId('casita-hundreds-borrow-correction')).toHaveLength(
      0,
    );
  });

  it('shows a struck digit and the reduced value on the column that lends for a borrow', () => {
    const problem = threeColumnProblem({
      op: 'sub',
      columns: [
        {
          place: 'units',
          aDigit: 2,
          bDigit: 8,
          resultDigit: 4,
          regroups: true,
        },
        {
          place: 'tens',
          aDigit: 4,
          bDigit: 1,
          resultDigit: 2,
          regroups: false,
        },
        {
          place: 'hundreds',
          aDigit: 8,
          bDigit: 4,
          resultDigit: 3,
          regroups: false,
        },
      ],
    });
    const { getAllByTestId, getByTestId, queryByTestId } = render(
      <Casita problem={problem} onAnswer={jest.fn()} result="idle" />,
    );

    // Units needs to borrow: tens hasn't unlocked yet, so no correction shown.
    expect(queryByTestId('casita-tens-borrow-correction')).toBeNull();

    fireEvent.press(findByDigit(getAllByTestId('casita-units-option'), 4));
    act(() => jest.advanceTimersByTime(700));

    // Tens (which lent 1 to units) shows its original digit in red with an
    // explicit strike bar overlay, plus the reduced value (4 - 1 = 3) next to it.
    const tensADigit = getByTestId('casita-tens-a-digit');
    expect(tensADigit.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: '#C62828' })]),
    );
    expect(getByTestId('casita-tens-strike-line')).toBeTruthy();
    expect(getByTestId('casita-tens-borrow-correction').props.children).toBe(
      '↗3',
    );
  });

  it('regression: offers the correct hundreds digit for 304 + 150 (no carry anywhere)', () => {
    // Reported bug: hundreds options showed {1, 0, 6, 9} — missing the
    // correct answer, 4. Locks in the exact reported operands.
    const problem = threeColumnProblem({
      a: 304,
      b: 150,
      op: 'add',
      columns: [
        {
          place: 'units',
          aDigit: 4,
          bDigit: 0,
          resultDigit: 4,
          regroups: false,
        },
        {
          place: 'tens',
          aDigit: 0,
          bDigit: 5,
          resultDigit: 5,
          regroups: false,
        },
        {
          place: 'hundreds',
          aDigit: 3,
          bDigit: 1,
          resultDigit: 4,
          regroups: false,
        },
      ],
      result: 454,
    });
    const { getAllByTestId } = render(
      <Casita problem={problem} onAnswer={jest.fn()} result="idle" />,
    );

    fireEvent.press(findByDigit(getAllByTestId('casita-units-option'), 4));
    fireEvent.press(findByDigit(getAllByTestId('casita-tens-option'), 5));

    const hundredsTexts = getAllByTestId('casita-hundreds-option').map(
      (btn) => within(btn).getByText(/\d/).props.children,
    );
    expect(hundredsTexts).toContain(4);
  });
});
