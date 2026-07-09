import { StyleSheet } from 'react-native';
import { colorTokens } from '@sierrita/ui';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colorTokens.backgroundApp },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 12 },
  linkText: { fontSize: 16, color: colorTokens.worldOcean, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 40 },
});
