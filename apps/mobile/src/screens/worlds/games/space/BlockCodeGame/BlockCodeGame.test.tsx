import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import BlockCodeGame from './BlockCodeGame';

describe('BlockCodeGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows round progress, the grid and the block palette', () => {
    const { getByText, getAllByTestId } = render(
      <BlockCodeGame
        params={{ gridSize: 3, blocks: ['forward', 'turnLeft', 'turnRight'] }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByText('1 / 5')).toBeTruthy();
    expect(getAllByTestId('program-cell')).toHaveLength(9);
    expect(getAllByTestId('block-option')).toHaveLength(3);
  });

  it('lets the child queue a block, undo it, queue it again and run the program', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId, getByTestId, queryByTestId } = render(
      <BlockCodeGame
        params={{ gridSize: 3, blocks: ['forward', 'turnLeft', 'turnRight'] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    const forwardBtn = getAllByTestId('block-option')[0];
    fireEvent.press(forwardBtn);
    expect(getByTestId('program-sequence')).toBeTruthy();

    fireEvent.press(getByTestId('block-undo'));
    fireEvent.press(forwardBtn);

    await act(async () => {
      fireEvent.press(getByTestId('block-run'));
    });
    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
    expect(queryByTestId('block-run')).toBeTruthy();
  });

  it('does nothing when Ejecutar is pressed with an empty program', () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { getByTestId } = render(
      <BlockCodeGame
        params={{ gridSize: 3, blocks: ['forward', 'turnLeft', 'turnRight'] }}
        onRoundComplete={onRoundComplete}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    fireEvent.press(getByTestId('block-run'));
    act(() => jest.advanceTimersByTime(1000));

    expect(onRoundComplete).not.toHaveBeenCalled();
  });

  it('falls back to a 3x3 grid with the basic blocks when no params are given', () => {
    const { getAllByTestId } = render(
      <BlockCodeGame
        params={{}}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getAllByTestId('program-cell')).toHaveLength(9);
    expect(getAllByTestId('block-option')).toHaveLength(3);
  });
});
