import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/** Pet idle bounce + card entrance animations, active only while the screen is focused. */
export function useHomeAnimations(isFocused: boolean) {
  const petBounce = useRef(new Animated.Value(0)).current;
  const cardEntrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isFocused) return;

    const petAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(petBounce, { toValue: -8, duration: 700, useNativeDriver: true }),
        Animated.timing(petBounce, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    );
    petAnim.start();

    cardEntrance.setValue(0);
    Animated.spring(cardEntrance, {
      toValue: 1,
      damping: 14,
      stiffness: 100,
      delay: 150,
      useNativeDriver: true,
    }).start();

    return () => petAnim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const cardTranslate = cardEntrance.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return { petBounce, cardEntrance, cardTranslate };
}
