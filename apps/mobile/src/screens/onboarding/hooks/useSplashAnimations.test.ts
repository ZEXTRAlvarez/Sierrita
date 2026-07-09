import { renderHook } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { useSplashAnimations } from './useSplashAnimations';

describe('useSplashAnimations', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('starts the scale, opacity and title animated values at their initial position', () => {
    const { result } = renderHook(() => useSplashAnimations());

    expect(result.current.scale).toBeInstanceOf(Animated.Value);
    expect(result.current.opacity).toBeInstanceOf(Animated.Value);
    expect(result.current.titleY).toBeInstanceOf(Animated.Value);
  });
});
