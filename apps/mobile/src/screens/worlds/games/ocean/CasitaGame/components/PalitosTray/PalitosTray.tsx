import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type AnimatedRef,
  type SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { styles } from './PalitosTray.styles';

const STICK_COUNT = 20;
const STICKS_PER_DECENA = 10;

/** Which container owns the stick currently being dragged, so it can be drawn on top of the other one. */
const DRAG_NONE = 0;
const DRAG_COUNT_AREA = 1;
const DRAG_TRAY = 2;

interface PalitoProps {
  id: number;
  dropped: boolean;
  countAreaRef: AnimatedRef<View>;
  dragSource: SharedValue<number>;
  onToggle: (id: number, dropped: boolean) => void;
}

/** A single draggable/tappable tally stick. Drag it onto the count area, or tap it, to place/return it. */
function Palito({
  id,
  dropped,
  countAreaRef,
  dragSource,
  onToggle,
}: PalitoProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      dragSource.value = dropped ? DRAG_COUNT_AREA : DRAG_TRAY;
    })
    .onChange((e) => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
    })
    .onEnd((e) => {
      // measure() reads the count area in window coordinates, the same space
      // as absoluteY, and re-reads it on every drop — its height changes as
      // sticks pile up inside it.
      const zone = measure(countAreaRef);
      const next = zone ? e.absoluteY < zone.pageY + zone.height : dropped;
      if (next === dropped) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      } else {
        // A real move re-parents this stick to the other container, which
        // remounts it (offsets back at 0) into its own laid-out slot.
        runOnJS(onToggle)(id, next);
      }
    })
    .onFinalize(() => {
      dragSource.value = DRAG_NONE;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.palitoWrap, animatedStyle]}>
        <Pressable
          testID="palito"
          accessibilityRole="button"
          accessibilityLabel={
            dropped
              ? 'Palito contado, tocá para devolverlo'
              : 'Palito para contar'
          }
          hitSlop={8}
          style={styles.palitoTouchArea}
          onPress={() => onToggle(id, !dropped)}
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
 *
 * Each stick is rendered inside the container that matches its state, so both
 * boxes reflow on their own: the count area grows as it fills and the tray
 * shrinks by the same rows (and back again when sticks are returned).
 */
export function PalitosTray() {
  const [droppedIds, setDroppedIds] = useState<number[]>([]);
  const countAreaRef = useAnimatedRef<View>();
  const dragSource = useSharedValue(DRAG_NONE);

  const looseIds = useMemo(
    () =>
      Array.from({ length: STICK_COUNT }, (_, id) => id).filter(
        (id) => !droppedIds.includes(id),
      ),
    [droppedIds],
  );

  function handleToggle(id: number, dropped: boolean) {
    setDroppedIds((prev) => {
      if (dropped) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((prevId) => prevId !== id);
    });
  }

  // Sticks are clipped by neither box, but each box paints its own background,
  // so whichever one holds the dragged stick has to sit above the other.
  const countAreaZIndex = useAnimatedStyle(() => ({
    zIndex: dragSource.value === DRAG_COUNT_AREA ? 2 : 1,
  }));
  const trayZIndex = useAnimatedStyle(() => ({
    zIndex: dragSource.value === DRAG_TRAY ? 2 : 1,
  }));

  const droppedCount = droppedIds.length;
  const hasDecena = droppedCount >= STICKS_PER_DECENA;

  return (
    <View style={styles.container}>
      <Animated.View
        ref={countAreaRef}
        style={[styles.countArea, countAreaZIndex]}
        testID="palitos-count-area"
      >
        {droppedCount === 0 ? (
          <Text style={styles.areaHint}>
            Arrastrá palitos acá si necesitás contar 🤏
          </Text>
        ) : (
          droppedIds.map((id) => (
            <Palito
              key={id}
              id={id}
              dropped
              countAreaRef={countAreaRef}
              dragSource={dragSource}
              onToggle={handleToggle}
            />
          ))
        )}
      </Animated.View>

      {hasDecena && (
        <Text testID="palitos-decena-badge" style={styles.bundleBadge}>
          ¡Son {droppedCount} palitos: ya tenés una decena! 🎉
        </Text>
      )}

      <Animated.View style={[styles.tray, trayZIndex]} testID="palitos-tray">
        {looseIds.length === 0 ? (
          <Text style={[styles.areaHint, styles.trayHint]}>
            Ya contaste todos los palitos 👆
          </Text>
        ) : (
          looseIds.map((id) => (
            <Palito
              key={id}
              id={id}
              dropped={false}
              countAreaRef={countAreaRef}
              dragSource={dragSource}
              onToggle={handleToggle}
            />
          ))
        )}
      </Animated.View>
    </View>
  );
}
