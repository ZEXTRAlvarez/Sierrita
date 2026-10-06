import React from 'react';
import {
  render,
  fireEvent,
  act,
  type RenderResult,
} from '@testing-library/react-native';
import ClockGame from './ClockGame';

type Props = React.ComponentProps<typeof ClockGame>;

/**
 * Mode (identify/set) is chosen at random each round. Re-render until the
 * round we want to exercise shows up, same tolerance already accepted
 * elsewhere in this repo for probabilistic round generation.
 */
function renderUntilTestId(
  testId: string,
  props: Props,
  maxAttempts = 30,
): RenderResult {
  for (let i = 0; i < maxAttempts; i++) {
    const utils = render(<ClockGame {...props} />);
    if (utils.queryAllByTestId(testId).length > 0) return utils;
    utils.unmount();
  }
  throw new Error(
    `Could not render a round with testID "${testId}" after ${maxAttempts} attempts`,
  );
}

describe('ClockGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, the clock face and 4 time options in an identify round', () => {
    const { getByText, getByTestId, getAllByTestId } = renderUntilTestId(
      'clock-option',
      {
        params: { minutePool: [0] },
        onRoundComplete: jest.fn(async () => undefined),
        onGameFinish: jest.fn(),
        roundCount: 6,
        difficulty: 1,
      },
    );

    expect(getByText('1 / 6')).toBeTruthy();
    expect(getByTestId('clock-face')).toBeTruthy();
    expect(getAllByTestId('clock-option')).toHaveLength(4);
  });

  it('reports the round after answering an identify round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { getAllByTestId } = renderUntilTestId('clock-option', {
      params: { minutePool: [0] },
      onRoundComplete,
      onGameFinish: jest.fn(),
      roundCount: 1,
      difficulty: 1,
    });

    await act(async () => {
      fireEvent.press(getAllByTestId('clock-option')[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);
  });

  it('lets the child pick hour/minute chips and confirm in a set round, finishing after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId, getByTestId } = renderUntilTestId('clock-confirm', {
      params: { minutePool: [0, 30] },
      onRoundComplete,
      onGameFinish,
      roundCount: 1,
      difficulty: 2,
    });

    fireEvent.press(getAllByTestId('clock-hour-chip')[2]);
    fireEvent.press(getAllByTestId('clock-minute-chip')[1]);
    await act(async () => {
      fireEvent.press(getByTestId('clock-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('falls back to minutePool [0] when no params are given', () => {
    const { getByText } = render(
      <ClockGame
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
