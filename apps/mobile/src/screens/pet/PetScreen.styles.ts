import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 56, paddingBottom: 36 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '900', color: '#3E2723', textAlign: 'center', letterSpacing: 0.3 },
  editNameBtn: { padding: 4 },
  editNameIcon: { fontSize: 18 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  detailBtn: { borderRadius: 22, overflow: 'hidden', elevation: 3 },
  detailBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  detailBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F8E9', gap: 10 },
  empty: { fontSize: 17, color: '#8D6E63', textAlign: 'center', fontWeight: '600', paddingHorizontal: 40 },
});
