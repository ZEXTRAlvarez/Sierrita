import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { styles } from './LoadingDot.styles';

export interface LoadingDotProps {
  delay: number;
}

/** One dot of the splash "loading" row; pulses in a delayed loop. */
export function LoadingDot({ delay }: LoadingDotProps) {
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.6,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      testID="loading-dot"
      style={[styles.dot, { transform: [{ scale }] }]}
    />
  );
}
