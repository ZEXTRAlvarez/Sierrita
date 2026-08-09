import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { LetterDef } from '@sierrita/games';
import { styles } from './LetterPreview.styles';

export interface LetterPreviewProps {
  letterDef: LetterDef;
}

const GLYPH_SIZE = 64;

/**
 * Side-by-side print vs. cursive reference for the letter currently being
 * traced. Draws the exact same paths LetterCanvas uses to guide the trazo —
 * not a system-font approximation — so the preview can never drift from
 * what the child is actually asked to draw.
 */
export function LetterPreview({ letterDef }: LetterPreviewProps) {
  return (
    <View style={styles.letterRow}>
      <View style={styles.letterCard}>
        <Text style={styles.labelSmall}>Imprenta</Text>
        <Svg width={GLYPH_SIZE} height={GLYPH_SIZE} viewBox="0 0 100 100">
          <Path
            testID="letter-preview-print"
            d={letterDef.guidePath}
            stroke={styles.letterPrint.color}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <Text style={styles.arrow}>→</Text>
      <View style={styles.letterCard}>
        <Text style={styles.labelSmall}>Cursiva</Text>
        <Svg width={GLYPH_SIZE} height={GLYPH_SIZE} viewBox="0 0 100 100">
          <Path
            testID="letter-preview-cursive"
            d={letterDef.cursivePath ?? letterDef.guidePath}
            stroke={styles.letterCursive.color}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </View>
  );
}
