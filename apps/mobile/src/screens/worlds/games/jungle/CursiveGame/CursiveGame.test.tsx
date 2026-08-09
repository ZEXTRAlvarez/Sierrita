import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import CursiveGame from './CursiveGame';

// LetterCanvas wraps @shopify/react-native-skia, which needs the native
// runtime. It isn't touched by this refactor, so stub it with a pressable
// surface that reports a result back to the game, same as the real thing.
jest.mock('../components/LetterCanvas', () => {
  const ReactActual = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    __esModule: true,
    default: function LetterCanvas({
      onComplete,
      onTrackLost,
    }: {
      onComplete: () => void;
      onTrackLost: (reason: 'off-path' | 'out-of-order') => void;
    }) {
      return ReactActual.createElement(View, null, [
        ReactActual.createElement(
          TouchableOpacity,
          { key: 'complete', testID: 'letter-canvas', onPress: onComplete },
          ReactActual.createElement(Text, null, 'canvas'),
        ),
        ReactActual.createElement(
          TouchableOpacity,
          {
            key: 'lost',
            testID: 'letter-canvas-lost',
            onPress: () => onTrackLost('out-of-order'),
          },
          ReactActual.createElement(Text, null, 'skip a checkpoint'),
        ),
      ]);
    },
  };
});

// LetterPreview draws its own tiny SVG previews of the letter's paths; not
// under test here.
jest.mock('./components/LetterPreview', () => {
  const ReactActual = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    LetterPreview: function LetterPreview({
      letterDef,
    }: {
      letterDef: { letter: string };
    }) {
      return ReactActual.createElement(Text, null, `preview-${letterDef.letter}`);
    },
  };
});

describe('CursiveGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows a preview of the current letter plus round progress', () => {
    const { getByText, getByTestId } = render(
      <CursiveGame
        params={{ letterSet: 'vowels' }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={3}
        difficulty={1}
      />,
    );

    expect(getByText('preview-A')).toBeTruthy();
    expect(getByText('1 / 3')).toBeTruthy();
    expect(getByTestId('letter-canvas')).toBeTruthy();
  });

  it('reports a correct round and finishes when the letter is completed', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByTestId } = render(
      <CursiveGame
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

  it('reports a wrong round with no hint used when a checkpoint is skipped', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByTestId } = render(
      <CursiveGame
        params={{ letterSet: 'vowels' }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('letter-canvas-lost'));
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0, 0);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('reports a wrong round with a hint used when the player gives up', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getByText } = render(
      <CursiveGame
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
