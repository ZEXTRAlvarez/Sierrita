import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './WordTray.styles';

export interface WordTrayProps {
  placed: string[];
  status: 'idle' | 'correct' | 'wrong';
  disabled: boolean;
  onRemove: (word: string, index: number) => void;
}

/** The sentence-in-progress: words the player has placed, tap one to send it back to the bank. */
export function WordTray({ placed, status, disabled, onRemove }: WordTrayProps) {
  if (placed.length === 0) {
    return (
      <View style={styles.tray}>
        <Text style={styles.trayPlaceholder}>Tocá las palabras de abajo</Text>
      </View>
    );
  }

  return (
    <View style={styles.tray}>
      {placed.map((word, i) => (
        <TouchableOpacity
          key={`placed-${i}`}
          testID="sentence-placed-word"
          style={[styles.wordChip, status === 'correct' && styles.correctChip, status === 'wrong' && styles.wrongChip]}
          onPress={() => onRemove(word, i)}
          disabled={disabled}
        >
          <Text style={styles.wordText}>{word}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
