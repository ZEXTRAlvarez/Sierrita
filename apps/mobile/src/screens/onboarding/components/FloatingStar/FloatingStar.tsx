import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { styles } from './FloatingStar.styles';

const { width: W, height: H } = Dimensions.get('window');

export interface FloatingStarProps {
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}

/** A single decorative emoji that fades in, then loops a gentle vertical drift. */
export function FloatingStar({ emoji, x, y, size, delay }: FloatingStarProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -12,
              duration: 1800,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 12,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.Text
      style={[
        styles.star,
        {
          left: x * W,
          top: y * H,
          fontSize: size,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}
