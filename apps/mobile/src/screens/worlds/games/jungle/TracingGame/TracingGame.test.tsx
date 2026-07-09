import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { evaluatePath } from '@sierrita/games';
import TracingGame from './TracingGame';

// LetterCanvas wraps @shopify/react-native-skia, which needs the native
// runtime. It isn't touched by this refactor, so stub it with a pressable
// surface that reports a stroke back to the game, same as the real thing.
jest.mock('../components/LetterCanvas', () => {
  const ReactActual = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    __esModule: true,
    default: function LetterCanvas({
      onStrokeEnd,
    }: {
      onStrokeEnd: (points: unknown[]) => void;
    }) {
      return ReactActual.createElement(
        TouchableOpacity,
        { testID: 'letter-canvas', onPress: () => onStrokeEnd([]) },
        ReactActual.createElement(Text, null, 'canvas'),
      );
    },
  };
});

jest.mock('@sierrita/games', () => ({
  ...jest.requireActual('@sierrita/games'),
  evaluatePath: jest.fn(() => ({ score: 1, hitMap: [] })),
}));

describe('TracingGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows the current letter, round progress, and a give-up hint', () => {
    const { getByText, getByTestId } = render(
      <TracingGame
        params={{ letterSet: 'vowels' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={3}
        difficulty={1}
      />,
    );

    expect(getByText('A')).toBeTruthy();
    expect(getByText('1 / 3')).toBeTruthy();
    expect(getByText('¿Necesitás ayuda? Toca aquí')).toBeTruthy();
    expect(getByTestId('letter-canvas')).toBeTruthy();
  });

  it('reports a correct round and finishes when the drawn path scores high enough', async () => {
    (evaluatePath as jest.Mock).mockReturnValue({ score: 1, hitMap: [] });
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByTestId } = render(
      <TracingGame
        params={{ letterSet: 'vowels' }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('letter-canvas'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('reports a wrong round with a hint used when the player gives up', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByText } = render(
      <TracingGame
        params={{ letterSet: 'vowels' }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getByText('¿Necesitás ayuda? Toca aquí'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0, 1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
