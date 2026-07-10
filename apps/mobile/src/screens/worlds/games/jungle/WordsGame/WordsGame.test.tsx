import React from 'react';
import { render, fireEvent, act, within } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import WordsGame from './WordsGame';

/** Letter option buttons can share text with the word's already-revealed
 * letters (e.g. "HADA" reveals two A's), so scope lookups to the option
 * buttons instead of `getByText` against the whole screen. */
function findOption(
  options: readonly ReactTestInstance[],
  letter: string,
): ReactTestInstance {
  const found = options.find((btn) => within(btn).queryByText(letter) !== null);
  if (!found) throw new Error(`No option button found for letter ${letter}`);
  return found;
}

// Every "random" pick in @sierrita/games' getWords/getBlanks/getLetterOptions
// sorts or samples via Math.random(). Pinning it to a constant makes those
// picks deterministic (comparator always returns 0 -> stable sort is a no-op)
// so the word/blank/options are known ahead of time: word "OSO" (🐻), blank
// at index 0, options ['O', 'N'] with 'O' correct.
describe('WordsGame', () => {
  let randomSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.useRealTimers();
    randomSpy.mockRestore();
  });

  it('shows round progress, the word emoji, and letter options', () => {
    const { getByText, getAllByTestId } = render(
      <WordsGame
        params={{ wordLength: 3, category: 'animals', blanks: 1 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={1}
      />,
    );

    expect(getByText('🐻')).toBeTruthy();
    expect(getByText('1 / 1')).toBeTruthy();
    expect(getByText('S')).toBeTruthy();
    expect(getAllByTestId('word-letter-option').length).toBeGreaterThan(0);
  });

  it('completes the round and finishes when the correct letter is chosen', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId } = render(
      <WordsGame
        params={{ wordLength: 3, category: 'animals', blanks: 1 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getAllByTestId('word-letter-option')[0]); // 'O', correct
    });

    expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('flashes wrong and resets the blank, without advancing, on a wrong letter', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId, getByText, queryByText } = render(
      <WordsGame
        params={{ wordLength: 3, category: 'animals', blanks: 1 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    await act(async () => {
      fireEvent.press(getAllByTestId('word-letter-option')[1]); // 'N', wrong
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0);
    expect(getByText('¡Casi! Intentá de nuevo 💪')).toBeTruthy();

    act(() => jest.advanceTimersByTime(800));

    expect(queryByText('¡Casi! Intentá de nuevo 💪')).toBeNull();
    expect(onGameFinish).not.toHaveBeenCalled();
  });

  // With Math.random pinned to 0.5: getWords(4, 'mixed', 1, 'h') picks the
  // first 4-letter H word in insertion order, "HADA" (🧚); getForcedBlank
  // puts the blank on its H (index 0); getPhoneticOptions offers H (correct),
  // A (the letter right after the silent H), J (common H/J mix-up), and one
  // random fill (index 13 of the alphabet, 'N').
  describe('H practice mode (focus: "h")', () => {
    it('forces the blank onto the H and offers it among phonetic trap options', () => {
      const { getByText, getAllByTestId } = render(
        <WordsGame
          params={{ wordLength: 4, category: 'mixed', focus: 'h' }}
          onRoundComplete={jest.fn(async () => undefined)}
          onGameFinish={jest.fn()}
          roundCount={1}
          difficulty={1}
        />,
      );

      expect(getByText('🧚')).toBeTruthy();
      const options = getAllByTestId('word-letter-option');
      expect(options).toHaveLength(4);
      for (const letter of ['H', 'A', 'J']) {
        expect(() => findOption(options, letter)).not.toThrow();
      }
    });

    it('completes the round when the H is chosen', async () => {
      const onRoundComplete = jest.fn(async () => undefined);
      const { getAllByTestId } = render(
        <WordsGame
          params={{ wordLength: 4, category: 'mixed', focus: 'h' }}
          onRoundComplete={onRoundComplete}
          onGameFinish={jest.fn()}
          roundCount={1}
          difficulty={1}
        />,
      );

      await act(async () => {
        fireEvent.press(findOption(getAllByTestId('word-letter-option'), 'H'));
      });

      expect(onRoundComplete).toHaveBeenCalledWith(true, 0, 0);
    });

    it('narrates the silent-H rule as the wrong-answer hint', async () => {
      const { getAllByTestId, getByText } = render(
        <WordsGame
          params={{ wordLength: 4, category: 'mixed', focus: 'h' }}
          onRoundComplete={jest.fn(async () => undefined)}
          onGameFinish={jest.fn()}
          roundCount={1}
          difficulty={1}
        />,
      );

      await act(async () => {
        // wrong: 'A' is the sound the child actually hears, not the silent H
        fireEvent.press(findOption(getAllByTestId('word-letter-option'), 'A'));
      });

      expect(
        getByText('La H no suena, pero HADA se escribe con H 💪'),
      ).toBeTruthy();
    });
  });

  // getWords(4, 'mixed', 1, 'soft-c') picks "CENA" (🍽️); the blank is forced
  // on its C; getPhoneticOptions offers C (correct), S and Z (phonetic
  // traps), and one random fill ('N', same as above).
  describe('C practice mode (focus: "soft-c")', () => {
    it('forces the blank onto the C and offers S/Z as phonetic trap options', () => {
      const { getByText, getAllByTestId } = render(
        <WordsGame
          params={{ wordLength: 4, category: 'mixed', focus: 'soft-c' }}
          onRoundComplete={jest.fn(async () => undefined)}
          onGameFinish={jest.fn()}
          roundCount={1}
          difficulty={1}
        />,
      );

      expect(getByText('🍽️')).toBeTruthy();
      const options = getAllByTestId('word-letter-option');
      expect(options).toHaveLength(4);
      for (const letter of ['C', 'S', 'Z']) {
        expect(() => findOption(options, letter)).not.toThrow();
      }
    });

    it('narrates the soft-C rule as the wrong-answer hint', async () => {
      const { getAllByTestId, getByText } = render(
        <WordsGame
          params={{ wordLength: 4, category: 'mixed', focus: 'soft-c' }}
          onRoundComplete={jest.fn(async () => undefined)}
          onGameFinish={jest.fn()}
          roundCount={1}
          difficulty={1}
        />,
      );

      await act(async () => {
        // wrong: sounds right, spelled wrong
        fireEvent.press(findOption(getAllByTestId('word-letter-option'), 'S'));
      });

      expect(
        getByText('Acá la C suena como S, pero CENA se escribe con C 💪'),
      ).toBeTruthy();
    });
  });
});
