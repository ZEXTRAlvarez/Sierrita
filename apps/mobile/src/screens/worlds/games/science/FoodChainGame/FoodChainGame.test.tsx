import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { FOOD_CHAINS } from '@sierrita/games';
import FoodChainGame from './FoodChainGame';

const LENGTH_3_CHAINS = FOOD_CHAINS.filter((c) => c.links.length === 3);

describe('FoodChainGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress and the shuffled links to tap', () => {
    const { getByText, getAllByTestId } = render(
      <FoodChainGame
        params={{ lengths: [3] }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getAllByTestId('chain-available-item')).toHaveLength(3);
  });

  it('marks the round correct when the links are placed in the real order', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByText, getByTestId } = render(
      <FoodChainGame
        params={{ lengths: [3] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const chain = LENGTH_3_CHAINS.find((c) =>
      c.links.every((l) => {
        try {
          getByText(l.label);
          return true;
        } catch {
          return false;
        }
      }),
    );
    if (!chain) throw new Error('could not identify the rendered chain');

    for (const link of chain.links) {
      fireEvent.press(getByText(link.label));
    }

    await act(async () => {
      fireEvent.press(getByTestId('chain-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('marks the round wrong when the links are placed in reverse order', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { getByText, getByTestId } = render(
      <FoodChainGame
        params={{ lengths: [3] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    const chain = LENGTH_3_CHAINS.find((c) =>
      c.links.every((l) => {
        try {
          getByText(l.label);
          return true;
        } catch {
          return false;
        }
      }),
    );
    if (!chain) throw new Error('could not identify the rendered chain');

    for (const link of [...chain.links].reverse()) {
      fireEvent.press(getByText(link.label));
    }

    await act(async () => {
      fireEvent.press(getByTestId('chain-confirm'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0, 0);
  });

  it('moves a placed link back to the available pool when tapped again', () => {
    const { getAllByTestId } = render(
      <FoodChainGame
        params={{ lengths: [3] }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    fireEvent.press(getAllByTestId('chain-available-item')[0]);
    expect(getAllByTestId('chain-available-item')).toHaveLength(2);
    expect(getAllByTestId('chain-placed-item')).toHaveLength(1);

    fireEvent.press(getAllByTestId('chain-placed-item')[0]);
    expect(getAllByTestId('chain-available-item')).toHaveLength(3);
  });

  it('falls back to length-3 chains when no params are given', () => {
    const { getAllByTestId } = render(
      <FoodChainGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getAllByTestId('chain-available-item')).toHaveLength(3);
  });
});
