import React from 'react';
import {
  render,
  fireEvent,
  act,
  type RenderResult,
} from '@testing-library/react-native';
import FractionsGame from './FractionsGame';

type Props = React.ComponentProps<typeof FractionsGame>;

/**
 * Mode is chosen at random each round (identify/form, or compare once
 * compareChance allows it). Rather than reach into Math.random, re-render
 * until the round we want to exercise shows up — negligible flake odds given
 * the attempt count, same tolerance already accepted elsewhere in this repo
 * for probabilistic round generation.
 */
function renderUntilTestId(
  testId: string,
  props: Props,
  maxAttempts = 30,
): RenderResult {
  for (let i = 0; i < maxAttempts; i++) {
    const utils = render(<FractionsGame {...props} />);
    if (utils.queryAllByTestId(testId).length > 0) return utils;
    utils.unmount();
  }
  throw new Error(
    `Could not render a round with testID "${testId}" after ${maxAttempts} attempts`,
  );
}

describe('FractionsGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress and 4 fraction options in an identify round', () => {
    const { getByText, getAllByTestId } = renderUntilTestId('fraction-option', {
      params: { denominators: [2, 4], compareChance: 0 },
      onRoundComplete: jest.fn(async () => undefined),
      onGameFinish: jest.fn(),
      roundCount: 6,
      difficulty: 1,
    });

    expect(getByText('1 / 6')).toBeTruthy();
    expect(getAllByTestId('fraction-option')).toHaveLength(4);
  });

  it('reports the round after answering an identify round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { getAllByTestId } = renderUntilTestId('fraction-option', {
      params: { denominators: [2, 4], compareChance: 0 },
      onRoundComplete,
      onGameFinish: jest.fn(),
      roundCount: 1,
      difficulty: 1,
    });

    await act(async () => {
      fireEvent.press(getAllByTestId('fraction-option')[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);
  });

  it('lets the child tap segments and confirm in a form round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { getAllByTestId, getByTestId } = renderUntilTestId(
      'fraction-confirm',
      {
        params: { denominators: [2, 4], compareChance: 0 },
        onRoundComplete,
        onGameFinish: jest.fn(),
        roundCount: 1,
        difficulty: 1,
      },
    );

    fireEvent.press(getAllByTestId('fraction-segment')[0]);
    await act(async () => {
      fireEvent.press(getByTestId('fraction-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);
  });

  it('lets the child pick a fraction in a compare round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByTestId, getByText } = render(
      <FractionsGame
        params={{ denominators: [2, 3, 4, 8], compareChance: 1 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={3}
      />,
    );

    expect(getByText('1 / 1')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId('fraction-compare-a'));
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('falls back to denominators [2, 4] when no params are given', () => {
    const { getByText } = render(
      <FractionsGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 6')).toBeTruthy();
  });
});
