import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { CYCLES } from '@sierrita/games';
import CycleGame from './CycleGame';

const LENGTH_3_CYCLES = CYCLES.filter((c) => c.stages.length === 3);

function findRenderedCycle(getByText: (text: string) => unknown) {
  const cycle = LENGTH_3_CYCLES.find((c) =>
    c.stages.every((s) => {
      try {
        getByText(s.label);
        return true;
      } catch {
        return false;
      }
    }),
  );
  if (!cycle) throw new Error('could not identify the rendered cycle');
  return cycle;
}

describe('CycleGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress and the shuffled stages to tap', () => {
    const { getByText, getAllByTestId } = render(
      <CycleGame
        params={{ lengths: [3] }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getAllByTestId('cycle-available-item')).toHaveLength(3);
  });

  it('marks the round correct when the stages are placed in the real order', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByText, getByTestId } = render(
      <CycleGame
        params={{ lengths: [3] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const cycle = findRenderedCycle(getByText);
    for (const stage of cycle.stages) {
      fireEvent.press(getByText(stage.label));
    }

    await act(async () => {
      fireEvent.press(getByTestId('cycle-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('marks the round correct when placed in a rotated (but still forward-cyclic) order', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { getByText, getByTestId } = render(
      <CycleGame
        params={{ lengths: [3] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    const cycle = findRenderedCycle(getByText);
    const rotated = [...cycle.stages.slice(1), cycle.stages[0]];
    for (const stage of rotated) {
      fireEvent.press(getByText(stage.label));
    }

    await act(async () => {
      fireEvent.press(getByTestId('cycle-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);
  });

  it('marks the round wrong when placed in reverse order', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { getByText, getByTestId } = render(
      <CycleGame
        params={{ lengths: [3] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    const cycle = findRenderedCycle(getByText);
    for (const stage of [...cycle.stages].reverse()) {
      fireEvent.press(getByText(stage.label));
    }

    await act(async () => {
      fireEvent.press(getByTestId('cycle-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0, 0);
  });

  it('falls back to length-3 cycles when no params are given', () => {
    const { getAllByTestId } = render(
      <CycleGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getAllByTestId('cycle-available-item')).toHaveLength(3);
  });
});
