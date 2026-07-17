import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** One Animated.Value per world, staggered into view while the screen is focused. */
export function useWorldsEntrance(worldCount: number, isFocused: boolean) {
  const entranceAnims = useRef<Animated.Value[]>([]).current;
  while (entranceAnims.length < worldCount) {
    entranceAnims.push(new Animated.Value(0));
  }

  useEffect(() => {
    if (!isFocused) return;

    const activeAnims = entranceAnims.slice(0, worldCount);
    activeAnims.forEach((anim) => anim.setValue(0));
    Animated.stagger(
      140,
      activeAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          damping: 14,
          stiffness: 100,
          useNativeDriver: true,
        }),
      ),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, worldCount]);

  return entranceAnims;
}
