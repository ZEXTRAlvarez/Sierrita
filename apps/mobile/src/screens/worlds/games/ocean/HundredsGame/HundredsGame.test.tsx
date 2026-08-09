import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import HundredsGame from './HundredsGame';
import { decompose } from './logic/decompose';
import { DIGIT_LABELS, type DigitField } from './logic/buildRound';

function askedDigit(
  numberNode: ReactTestInstance,
  questionNode: ReactTestInstance,
): number {
  const number = Number(numberNode.props.children);
  const question = String(questionNode.props.children);
  const field = (Object.keys(DIGIT_LABELS) as DigitField[]).find((f) =>
    question.includes(DIGIT_LABELS[f]),
  );
  if (!field) throw new Error(`unexpected question: ${question}`);
  return decompose(number)[field];
}

describe('HundredsGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders identify mode with 4 answer options by default', () => {
    const { getAllByTestId, getByText } = render(
      <HundredsGame
        params={{ maxNumber: 99, mode: 'identify' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getAllByTestId('identify-option')).toHaveLength(4);
  });

  it("regression: every round offers its own number's digit, not the previous round's", async () => {
    // Reported bug: after answering, the options stayed stuck on the previous
    // round's digit (asked for the units of 77 with no 7 to press), because
    // they were memoized on mount and the remount key changed a beat before
    // the new number was set.
    const { getAllByTestId, getByTestId } = render(
      <HundredsGame
        params={{ maxNumber: 99, mode: 'identify' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    for (let round = 1; round <= 4; round++) {
      const expected = askedDigit(
        getByTestId('identify-number'),
        getByTestId('identify-question'),
      );
      const options = getAllByTestId('identify-option').map((btn) =>
        Number(btn.findByType('Text' as never).props.children),
      );

      expect(options).toContain(expected);

      // Right or wrong doesn't matter here, both must lead to a sane next round.
      await act(async () => {
        fireEvent.press(getAllByTestId('identify-option')[round % 4]);
      });
      act(() => jest.advanceTimersByTime(900));
    }
  });

  it('never asks for hundreds when the number cannot have any', () => {
    const { getByTestId } = render(
      <HundredsGame
        params={{ maxNumber: 99, mode: 'identify' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(
      String(getByTestId('identify-question').props.children),
    ).not.toContain('centenas');
  });

  it('keeps the counter on the round being answered while the feedback shows', async () => {
    const { getAllByTestId, getByText } = render(
      <HundredsGame
        params={{ maxNumber: 99, mode: 'identify' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={2}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getAllByTestId('identify-option')[0]);
    });

    expect(getByText('1 / 2')).toBeTruthy();

    act(() => jest.advanceTimersByTime(900));

    expect(getByText('2 / 2')).toBeTruthy();
  });

  it('reports the round and finishes after the last round in compose mode', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <HundredsGame
        params={{ maxNumber: 500, mode: 'compose' }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const buttons = getAllByTestId('compose-option');
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
