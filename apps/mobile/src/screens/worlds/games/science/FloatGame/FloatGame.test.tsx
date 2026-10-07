import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import FloatGame from './FloatGame';

describe('FloatGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, the water container and both prediction options', () => {
    const { getByText, getByTestId } = render(
      <FloatGame
        params={{ tiers: [1] }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 6')).toBeTruthy();
    expect(getByTestId('water-container')).toBeTruthy();
    expect(getByTestId('float-option-floats')).toBeTruthy();
    expect(getByTestId('float-option-sinks')).toBeTruthy();
  });

  it('reports the round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByTestId } = render(
      <FloatGame
        params={{ tiers: [1] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('float-option-floats'));
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('ignores further taps once a prediction has been made', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { getByTestId } = render(
      <FloatGame
        params={{ tiers: [1] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('float-option-floats'));
    });
    fireEvent.press(getByTestId('float-option-sinks'));

    expect(onRoundComplete).toHaveBeenCalledTimes(1);
  });

  it('falls back to tier 1 when no params are given', () => {
    const { getByTestId } = render(
      <FloatGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={6}
        difficulty={1}
      />,
    );

    expect(getByTestId('water-container')).toBeTruthy();
  });
});
