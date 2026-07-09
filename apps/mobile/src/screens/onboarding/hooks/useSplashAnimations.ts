import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** Logo scale/opacity + title slide-up entrance, played once on mount. */
export function useSplashAnimations() {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 10,
        stiffness: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(titleY, {
        toValue: 0,
        damping: 14,
        stiffness: 120,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scale, opacity, titleY };
}
