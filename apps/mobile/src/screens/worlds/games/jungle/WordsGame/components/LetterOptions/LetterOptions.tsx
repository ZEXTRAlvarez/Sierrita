import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './LetterOptions.styles';

export interface LetterOptionsProps {
  options: string[];
  disabled: boolean;
  onPress: (letter: string) => void;
}

/** Row of tappable letter choices used to fill in a word's blanks. */
export function LetterOptions({
  options,
  disabled,
  onPress,
}: LetterOptionsProps) {
  return (
    <View style={styles.optionsRow}>
      {options.map((letter, i) => (
        <TouchableOpacity
          key={i}
          testID="word-letter-option"
          style={styles.optionBtn}
          onPress={() => onPress(letter)}
          disabled={disabled}
        >
          <Text style={styles.optionText}>{letter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
