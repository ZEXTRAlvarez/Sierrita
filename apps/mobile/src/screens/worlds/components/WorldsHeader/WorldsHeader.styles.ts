import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? 36 : 52,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#1A237E',
    gap: 6,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#fff' },
  ageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  ageBadgeText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },
});
