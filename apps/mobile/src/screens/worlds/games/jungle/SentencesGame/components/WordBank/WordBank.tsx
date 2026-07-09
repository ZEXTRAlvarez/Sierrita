import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './WordBank.styles';

export interface WordBankProps {
  available: string[];
  disabled: boolean;
  onPress: (word: string, index: number) => void;
}

/** The shuffled words still available to place into the sentence tray. */
export function WordBank({ available, disabled, onPress }: WordBankProps) {
  return (
    <View style={styles.wordBank}>
      {available.map((word, i) => (
        <TouchableOpacity
          key={`avail-${i}`}
          testID="sentence-bank-word"
          style={styles.wordChip}
          onPress={() => onPress(word, i)}
          disabled={disabled}
        >
          <Text style={styles.wordText}>{word}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
