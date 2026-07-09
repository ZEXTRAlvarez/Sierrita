import { View, Text, StyleSheet, Switch } from 'react-native';
import { Chip, colorTokens } from '@sierrita/ui';
import { WORLD_LABEL, SESSION_TIME_OPTIONS } from '@sierrita/parents';
import type { ParentConfig, World } from '@sierrita/parents';

const WORLDS: World[] = ['jungle', 'ocean', 'space'];

export interface SettingsSectionProps {
  config: ParentConfig;
  onChange: (c: ParentConfig) => void;
}

export function SettingsSection({ config, onChange }: SettingsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Configuración</Text>

      <Text style={styles.settingLabel}>Tiempo de sesión</Text>
      <View style={styles.timeRow}>
        {SESSION_TIME_OPTIONS.map((mins) => (
          <Chip
            key={mins}
            label={`${mins}min`}
            selected={config.maxSessionMinutes === mins}
            onPress={() => onChange({ ...config, maxSessionMinutes: mins, updatedAt: Date.now() })}
          />
        ))}
      </View>

      <Text style={[styles.settingLabel, styles.worldsLabel]}>Mundos habilitados</Text>
      {WORLDS.map((world) => (
        <View key={world} style={styles.switchRow}>
          <Text style={styles.switchLabel}>{WORLD_LABEL[world]}</Text>
          <Switch
            value={config.worldsEnabled.includes(world)}
            onValueChange={(val) => {
              const next: World[] = val
                ? [...config.worldsEnabled, world]
                : config.worldsEnabled.filter((w) => w !== world);
              if (next.length === 0) return; // at least 1 world must be enabled
              onChange({ ...config, worldsEnabled: next, updatedAt: Date.now() });
            }}
            trackColor={{ false: '#DDD', true: colorTokens.worldJungle }}
            thumbColor="#fff"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 20, padding: 18, elevation: 2 },
  title: { fontSize: 18, fontWeight: '800', color: colorTokens.brand700, marginBottom: 14 },
  settingLabel: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 10 },
  worldsLabel: { marginTop: 16 },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4FF',
  },
  switchLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
});
