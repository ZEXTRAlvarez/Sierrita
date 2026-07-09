import { Animated, Text, View } from 'react-native';
import { styles } from './PatternSequence.styles';

export interface PatternSequenceProps {
  sequence: string[];
  missingIdx: number;
  bounceAnim: Animated.Value;
}

/** Renders the pattern sequence row, showing a dashed "?" blank at `missingIdx`. */
export function PatternSequence({
  sequence,
  missingIdx,
  bounceAnim,
}: PatternSequenceProps) {
  return (
    <Animated.View
      style={[styles.sequenceRow, { transform: [{ scale: bounceAnim }] }]}
    >
      {sequence.map((item, i) => (
        <View
          key={i}
          style={[styles.seqItem, i === missingIdx && styles.blankItem]}
        >
          {i === missingIdx ? (
            <Text style={styles.blank}>?</Text>
          ) : (
            <Text style={styles.seqEmoji}>{item}</Text>
          )}
        </View>
      ))}
    </Animated.View>
  );
}
