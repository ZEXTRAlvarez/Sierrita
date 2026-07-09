import { renderHook, act } from '@testing-library/react-native';
import { useClassifyGameState } from './useClassifyGameState';

const fixedRound = {
  categories: [{ label: 'A' }, { label: 'B' }],
  items: [
    { id: 0, emoji: '🍎', categoryIdx: 0 },
    { id: 1, emoji: '🐋', categoryIdx: 1 },
  ],
};

jest.mock('../logic/generateRound', () => ({
  generateRound: jest.fn(() => fixedRound),
}));

describe('useClassifyGameState', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  function setup(
    onRoundComplete = jest.fn(async () => undefined),
    onGameFinish = jest.fn(),
    roundCount = 1,
  ) {
    const { result } = renderHook(() =>
      useClassifyGameState({
        categories: 2,
        attribute: 'color',
        itemCount: 2,
        onRoundComplete,
        onGameFinish,
        roundCount,
      }),
    );
    return { result, onRoundComplete, onGameFinish };
  }

  it('populates the round, pending items and empty bins on mount', () => {
    const { result } = setup();

    expect(result.current.round.categories).toHaveLength(2);
    expect(result.current.pending).toHaveLength(2);
    expect(result.current.bins).toEqual([[], []]);
  });

  it('toggles selection when the same item is pressed twice', () => {
    const { result } = setup();

    act(() => result.current.handleItemPress(fixedRound.items[0]));
    expect(result.current.selected?.id).toBe(0);

    act(() => result.current.handleItemPress(fixedRound.items[0]));
    expect(result.current.selected).toBeNull();
  });

  it('returns a wrongly-placed item to the pending bank after the bounce-back delay', async () => {
    const { result, onRoundComplete } = setup();

    act(() => result.current.handleItemPress(fixedRound.items[0]));
    await act(async () => {
      await result.current.handleBinPress(1); // item 0 belongs to bin 0, not 1
    });

    expect(onRoundComplete).toHaveBeenCalledWith(false, 0);
    expect(result.current.pending).toHaveLength(1);

    act(() => jest.advanceTimersByTime(700));

    expect(result.current.pending).toHaveLength(2);
  });

  it('finishes the round once every item is classified correctly', async () => {
    const { result, onRoundComplete, onGameFinish } = setup();

    act(() => result.current.handleItemPress(fixedRound.items[0]));
    await act(async () => {
      await result.current.handleBinPress(0);
    });
    act(() => result.current.handleItemPress(fixedRound.items[1]));
    await act(async () => {
      await result.current.handleBinPress(1);
    });

    expect(onRoundComplete).toHaveBeenLastCalledWith(true, 0, 0);
    expect(result.current.result).toBe('correct');

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });
});
