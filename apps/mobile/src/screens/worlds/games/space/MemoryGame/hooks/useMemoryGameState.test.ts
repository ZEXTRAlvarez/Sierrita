import { renderHook, act } from '@testing-library/react-native';
import { useMemoryGameState } from './useMemoryGameState';

const fixedDeck = [
  { id: 0, emoji: '🚀', flipped: false, matched: false },
  { id: 1, emoji: '🌟', flipped: false, matched: false },
  { id: 2, emoji: '🚀', flipped: false, matched: false },
  { id: 3, emoji: '🌟', flipped: false, matched: false },
];

jest.mock('../logic/buildDeck', () => ({
  buildDeck: jest.fn(() => fixedDeck.map((c) => ({ ...c }))),
}));

describe('useMemoryGameState', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  function setup(onRoundComplete = jest.fn(async () => undefined), onGameFinish = jest.fn()) {
    const { result } = renderHook(() =>
      useMemoryGameState({ pairs: 2, flipDelay: 500, onRoundComplete, onGameFinish }),
    );
    return { result, onRoundComplete, onGameFinish };
  }

  it('starts with all cards face-down and zero matches', () => {
    const { result } = setup();

    expect(result.current.cards).toHaveLength(4);
    expect(result.current.matched).toBe(0);
    expect(result.current.cards.every((c) => !c.flipped)).toBe(true);
  });

  it('flips mismatched cards back down after the delay', () => {
    const { result } = setup();

    act(() => result.current.handleCardPress(0));
    act(() => result.current.handleCardPress(1)); // different emoji

    expect(result.current.cards[0].flipped).toBe(true);

    act(() => jest.advanceTimersByTime(500));

    expect(result.current.cards[0].flipped).toBe(false);
    expect(result.current.matched).toBe(0);
  });

  it('marks matching cards as matched and finishes once every pair is found', async () => {
    const { result, onRoundComplete, onGameFinish } = setup();

    act(() => result.current.handleCardPress(0));
    act(() => result.current.handleCardPress(2)); // same emoji as 0
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.matched).toBe(1);
    expect(result.current.cards[0].matched).toBe(true);

    act(() => result.current.handleCardPress(1));
    act(() => result.current.handleCardPress(3)); // same emoji as 1
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.matched).toBe(2);
    expect(result.current.finished).toBe(true);
    expect(onRoundComplete).toHaveBeenCalledWith(true, 0);

    act(() => jest.advanceTimersByTime(800));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('ignores presses while locked or on an already-flipped card', () => {
    const { result } = setup();

    act(() => result.current.handleCardPress(0));
    act(() => result.current.handleCardPress(1));
    // now locked while the two cards are shown; a third press should be a no-op
    act(() => result.current.handleCardPress(2));

    expect(result.current.cards[2].flipped).toBe(false);
  });
});
