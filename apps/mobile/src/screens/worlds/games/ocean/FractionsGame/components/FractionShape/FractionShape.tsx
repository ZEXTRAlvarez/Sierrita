import { TouchableOpacity, View } from 'react-native';
import { styles } from './FractionShape.styles';

export interface FractionShapeProps {
  parts: number;
  /** Indices of segments currently filled. */
  filled: number[];
  /** When given, segments become tappable and this fires with the tapped index. */
  onToggleSegment?: (index: number) => void;
}

/** A bar divided into `parts` equal segments, `filled` of them shaded — the visual model shared by every fraction round. */
export function FractionShape({
  parts,
  filled,
  onToggleSegment,
}: FractionShapeProps) {
  const filledSet = new Set(filled);

  return (
    <View style={styles.bar} testID="fraction-shape">
      {Array.from({ length: parts }).map((_, i) => {
        const segmentStyle = [
          styles.segment,
          filledSet.has(i) && styles.segmentFilled,
        ];
        return onToggleSegment ? (
          <TouchableOpacity
            key={i}
            testID="fraction-segment"
            style={segmentStyle}
            onPress={() => onToggleSegment(i)}
          />
        ) : (
          <View key={i} testID="fraction-segment" style={segmentStyle} />
        );
      })}
    </View>
  );
}
