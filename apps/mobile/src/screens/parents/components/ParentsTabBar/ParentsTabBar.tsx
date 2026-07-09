import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colorTokens } from '@sierrita/ui';

export type ParentsTab = 'stats' | 'settings';

export interface ParentsTabBarProps {
  active: ParentsTab;
  onChange: (tab: ParentsTab) => void;
}

const TABS: { id: ParentsTab; label: string }[] = [
  { id: 'stats', label: '📊 Estadísticas' },
  { id: 'settings', label: '⚙️ Configuración' },
];

export function ParentsTabBar({ active, onChange }: ParentsTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, active === tab.id && styles.tabActive]}
          onPress={() => onChange(tab.id)}
        >
          <Text style={[styles.tabText, active === tab.id && styles.tabTextActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: colorTokens.brand700, paddingHorizontal: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#FFF' },
  tabText: { fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
  tabTextActive: { color: '#fff' },
});
