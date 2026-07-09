import { Text, View } from 'react-native';
import { styles } from './WordBlanks.styles';

export interface WordBlanksProps {
  word: string;
  blankIndices: number[];
  chosen: (string | null)[];
  status: 'idle' | 'correct' | 'wrong';
}

/** Renders a word as letter boxes, showing chosen letters (or blanks) in place of hidden ones. */
export function WordBlanks({ word, blankIndices, chosen, status }: WordBlanksProps) {
  return (
    <View style={styles.wordRow}>
      {word.split('').map((letter, i) => {
        const blankPos = blankIndices.indexOf(i);
        const isBlank = blankPos !== -1;
        return (
          <View
            key={i}
            style={[
              styles.letterBox,
              isBlank && styles.blankBox,
              isBlank && status === 'correct' && styles.correctBox,
              isBlank && status === 'wrong' && styles.wrongBox,
            ]}
          >
            <Text style={styles.letterText}>{isBlank ? (chosen[blankPos] ?? '') : letter}</Text>
          </View>
        );
      })}
    </View>
  );
}
