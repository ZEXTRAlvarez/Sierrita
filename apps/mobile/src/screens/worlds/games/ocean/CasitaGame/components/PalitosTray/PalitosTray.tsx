import { useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { styles } from './PalitosTray.styles';

const STICK_COUNT = 20;
const STICKS_PER_DECENA = 10;

interface PalitoProps {
  id: number;
  dropZoneY: number;
  dropped: boolean;
  onToggle: (id: number, dropped: boolean) => void;
}

/** A single draggable/tappable tally stick. Drag it above the count area, or tap it, to place/return it. */
function Palito({ id, dropZoneY, dropped, onToggle }: PalitoProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  function place(next: boolean) {
    translateX.value = withSpring(0);
    translateY.value = withSpring(next ? -84 : 0);
    onToggle(id, next);
  }

  const pan = Gesture.Pan()
    .minDistance(10)
    .onChange((e) => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
    })
    .onEnd((e) => {
      const next = e.absoluteY < dropZoneY;
      runOnJS(place)(next);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.palitoWrap, animatedStyle]}>
        <Pressable
          testID="palito"
          accessibilityRole="button"
          accessibilityLabel="Palito para contar"
          hitSlop={8}
          style={styles.palitoTouchArea}
          onPress={() => place(!dropped)}
        >
          <View style={[styles.palito, dropped && styles.palitoDropped]} />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

/**
 * Optional counting aid: a tray of loose sticks the child can drag (or tap)
 * into the count area above it. Grouping 10 of them highlights the "decena"
 * equivalence. Purely a scratchpad — never blocks or affects answer validation.
 */
export function PalitosTray() {
  const [droppedIds, setDroppedIds] = useState<Set<number>>(new Set());
  const [dropZoneY, setDropZoneY] = useState(0);

  function handleToggle(id: number, dropped: boolean) {
    setDroppedIds((prev) => {
      const next = new Set(prev);
      if (dropped) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function handleCountAreaLayout(e: LayoutChangeEvent) {
    const { y, height } = e.nativeEvent.layout;
    setDropZoneY(y + height);
  }

  const droppedCount = droppedIds.size;
  const hasDecena = droppedCount >= STICKS_PER_DECENA;

  return (
    <View style={styles.container}>
      <View
        style={styles.countArea}
        testID="palitos-count-area"
        onLayout={handleCountAreaLayout}
      >
        {droppedCount === 0 && (
          <Text style={styles.countAreaHint}>
            Arrastrá palitos acá si necesitás contar 🤏
          </Text>
        )}
      </View>

      {hasDecena && (
        <Text testID="palitos-decena-badge" style={styles.bundleBadge}>
          ¡Son {droppedCount} palitos: ya tenés una decena! 🎉
        </Text>
      )}

      <View style={styles.tray}>
        {Array.from({ length: STICK_COUNT }).map((_, id) => (
          <Palito
            key={id}
            id={id}
            dropZoneY={dropZoneY}
            dropped={droppedIds.has(id)}
            onToggle={handleToggle}
          />
        ))}
      </View>
    </View>
  );
}
