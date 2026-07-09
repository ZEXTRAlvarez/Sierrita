import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** One spring-in animated value per card slot (profiles + trailing "add" card, max 6). */
export function useProfileCardAnimations(profileCount: number) {
  const cardAnims = useRef(
    Array.from({ length: 6 }, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    Animated.stagger(
      80,
      cardAnims.slice(0, profileCount + 1).map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          damping: 12,
          stiffness: 120,
          useNativeDriver: true,
        }),
      ),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileCount]);

  return cardAnims;
}
