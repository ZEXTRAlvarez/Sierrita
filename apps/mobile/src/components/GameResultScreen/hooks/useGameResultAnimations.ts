import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** Card entrance, then a delayed stars pop-in — plus the one-shot XP reward side effect. */
export function useGameResultAnimations(xpEarned: number, rewardXp: (xp: number) => void) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const starsScale = useRef(new Animated.Value(0)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, damping: 12, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(starsScale, { toValue: 1, damping: 8, useNativeDriver: true }),
        Animated.timing(starsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 400);

    rewardXp(xpEarned);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scale, opacity, starsScale, starsOpacity };
}
