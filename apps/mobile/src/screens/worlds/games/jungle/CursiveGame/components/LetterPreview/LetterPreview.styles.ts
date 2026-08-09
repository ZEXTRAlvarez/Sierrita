import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  letterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  letterCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    minWidth: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  labelSmall: {
    fontSize: 12,
    color: '#FF8F00',
    fontWeight: '600',
    marginBottom: 2,
  },
  // Stroke colors for the mini SVG glyph previews (not text styles anymore —
  // LetterPreview draws the actual guide/cursive paths, not font glyphs).
  letterPrint: {
    color: '#E65100',
  },
  letterCursive: {
    color: '#F4511E',
  },
  arrow: { fontSize: 28, color: '#FFCC02', fontWeight: '900' },
});
