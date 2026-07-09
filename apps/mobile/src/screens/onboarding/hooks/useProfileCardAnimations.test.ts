import { renderHook } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { useProfileCardAnimations } from './useProfileCardAnimations';

describe('useProfileCardAnimations', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns six animated values, one per possible card slot', () => {
    const { result } = renderHook(() => useProfileCardAnimations(2));

    expect(result.current).toHaveLength(6);
    result.current.forEach((anim) => expect(anim).toBeInstanceOf(Animated.Value));
  });
});
