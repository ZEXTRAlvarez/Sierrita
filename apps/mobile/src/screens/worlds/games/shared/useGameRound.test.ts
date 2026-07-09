import { renderHook, act } from '@testing-library/react-native';
import { useGameRound } from './useGameRound';

describe('useGameRound', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('calls startRound once on mount', () => {
    const startRound = jest.fn();
    renderHook(() =>
      useGameRound({ roundCount: 3, onRoundComplete: jest.fn(async () => undefined), onGameFinish: jest.fn(), startRound }),
    );

    expect(startRound).toHaveBeenCalledTimes(1);
  });

  it('reports the result, then starts the next round after the delay', async () => {
    const startRound = jest.fn();
    const onRoundComplete = jest.fn(async () => undefined);
    const { result } = renderHook(() =>
      useGameRound({ roundCount: 3, onRoundComplete, onGameFinish: jest.fn(), startRound }),
    );

    await act(async () => {
      await result.current.submitAnswer(true, 120);
    });

    expect(result.current.result).toBe('correct');
    expect(onRoundComplete).toHaveBeenCalledWith(true, 120, 0);
    expect(result.current.roundsDone).toBe(1);

    act(() => jest.advanceTimersByTime(900));

    expect(startRound).toHaveBeenCalledTimes(2);
  });

  it('calls onGameFinish instead of starting another round once roundCount is reached', async () => {
    const startRound = jest.fn();
    const onGameFinish = jest.fn();
    const { result } = renderHook(() =>
      useGameRound({ roundCount: 1, onRoundComplete: jest.fn(async () => undefined), onGameFinish, startRound }),
    );

    await act(async () => {
      await result.current.submitAnswer(false);
    });

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
    expect(startRound).toHaveBeenCalledTimes(1);
  });

  it('ignores a second submitAnswer while a result is already showing', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { result } = renderHook(() =>
      useGameRound({ roundCount: 3, onRoundComplete, onGameFinish: jest.fn(), startRound: jest.fn() }),
    );

    await act(async () => {
      await result.current.submitAnswer(true);
    });
    await act(async () => {
      await result.current.submitAnswer(false);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);
    expect(result.current.result).toBe('correct');
  });
});
