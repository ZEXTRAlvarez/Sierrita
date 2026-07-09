import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** Idle pet bounce loop + a one-shot "tap" scale used when an action button fires. */
export function usePetScreenAnimations() {
  const bounceY = useRef(new Animated.Value(0)).current;
  const actionScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceY, { toValue: -10, duration: 1100, useNativeDriver: true }),
        Animated.timing(bounceY, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function animateAction(fn: () => void) {
    actionScale.setValue(0.92);
    Animated.spring(actionScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    fn();
  }

  return { bounceY, actionScale, animateAction };
}
