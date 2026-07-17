import { renderHook } from '@testing-library/react-native';
import { useWorldsEntrance } from './useWorldsEntrance';

describe('useWorldsEntrance', () => {
  it('returns one Animated.Value per world', () => {
    const { result } = renderHook(() => useWorldsEntrance(2, true));

    expect(result.current).toHaveLength(2);
  });

  it('grows the anim list when the world count increases after mount', () => {
    const { result, rerender } = renderHook(
      ({ count }) => useWorldsEntrance(count, true),
      { initialProps: { count: 2 } },
    );

    expect(result.current).toHaveLength(2);

    rerender({ count: 3 });

    expect(result.current).toHaveLength(3);
    expect(result.current[2]).toBeDefined();
  });
});
