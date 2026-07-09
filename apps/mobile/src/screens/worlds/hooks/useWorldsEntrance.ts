import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** One Animated.Value per world, staggered into view while the screen is focused. */
export function useWorldsEntrance(worldCount: number, isFocused: boolean) {
  const entranceAnims = useRef(
    Array.from({ length: worldCount }, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    if (!isFocused) return;

    entranceAnims.forEach((anim) => anim.setValue(0));
    Animated.stagger(
      140,
      entranceAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          damping: 14,
          stiffness: 100,
          useNativeDriver: true,
        }),
      ),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return entranceAnims;
}
