import { Text, View } from 'react-native';
import { styles } from './LetterPreview.styles';

export interface LetterPreviewProps {
  letter: string;
}

/** Side-by-side print vs. cursive reference for the letter currently being traced. */
export function LetterPreview({ letter }: LetterPreviewProps) {
  return (
    <View style={styles.letterRow}>
      <View style={styles.letterCard}>
        <Text style={styles.labelSmall}>Imprenta</Text>
        <Text style={styles.letterPrint}>{letter}</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
      <View style={styles.letterCard}>
        <Text style={styles.labelSmall}>Cursiva</Text>
        <Text style={styles.letterCursive}>{letter.toLowerCase()}</Text>
      </View>
    </View>
  );
}
