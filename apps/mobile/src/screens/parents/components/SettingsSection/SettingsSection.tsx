import { View, Text, StyleSheet, Switch } from 'react-native';
import { Chip, colorTokens, useAccessibility } from '@sierrita/ui';
import {
  WORLD_LABEL,
  SESSION_TIME_OPTIONS,
  SESSION_GOAL_OPTIONS,
} from '@sierrita/parents';
import type { ParentConfig, World } from '@sierrita/parents';

const WORLDS: World[] = ['jungle', 'ocean', 'space'];

export interface SettingsSectionProps {
  config: ParentConfig;
  onChange: (c: ParentConfig) => void;
  goalTarget: number | null;
  onChangeGoal: (target: number) => void;
}

export function SettingsSection({
  config,
  onChange,
  goalTarget,
  onChangeGoal,
}: SettingsSectionProps) {
  const { scaledFontSize } = useAccessibility();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: scaledFontSize(18) }]}>
        ⚙️ Configuración
      </Text>

      <Text style={[styles.settingLabel, { fontSize: scaledFontSize(15) }]}>
        Tiempo de sesión
      </Text>
      <View style={styles.timeRow}>
        {SESSION_TIME_OPTIONS.map((mins) => (
          <Chip
            key={mins}
            label={`${mins}min`}
            selected={config.maxSessionMinutes === mins}
            onPress={() =>
              onChange({
                ...config,
                maxSessionMinutes: mins,
                updatedAt: Date.now(),
              })
            }
          />
        ))}
      </View>

      <Text
        style={[
          styles.settingLabel,
          styles.worldsLabel,
          { fontSize: scaledFontSize(15) },
        ]}
      >
        Mundos habilitados
      </Text>
      {WORLDS.map((world) => (
        <View key={world} style={styles.switchRow}>
          <Text style={[styles.switchLabel, { fontSize: scaledFontSize(16) }]}>
            {WORLD_LABEL[world]}
          </Text>
          <Switch
            value={config.worldsEnabled.includes(world)}
            onValueChange={(val) => {
              const next: World[] = val
                ? [...config.worldsEnabled, world]
                : config.worldsEnabled.filter((w) => w !== world);
              if (next.length === 0) return; // at least 1 world must be enabled
              onChange({
                ...config,
                worldsEnabled: next,
                updatedAt: Date.now(),
              });
            }}
            trackColor={{ false: '#DDD', true: colorTokens.worldJungle }}
            thumbColor="#fff"
          />
        </View>
      ))}

      <Text
        style={[
          styles.settingLabel,
          styles.worldsLabel,
          { fontSize: scaledFontSize(15) },
        ]}
      >
        Meta semanal (sesiones de juego)
      </Text>
      <View style={styles.timeRow}>
        {SESSION_GOAL_OPTIONS.map((count) => (
          <Chip
            key={count}
            label={`${count}`}
            selected={goalTarget === count}
            onPress={() => onChangeGoal(count)}
          />
        ))}
      </View>

      <Text
        style={[
          styles.settingLabel,
          styles.worldsLabel,
          { fontSize: scaledFontSize(15) },
        ]}
      >
        Accesibilidad
      </Text>
      <View style={styles.timeRow}>
        <Chip
          label="Normal"
          selected={config.fontScale === 'normal'}
          onPress={() =>
            onChange({ ...config, fontScale: 'normal', updatedAt: Date.now() })
          }
        />
        <Chip
          label="Grande"
          selected={config.fontScale === 'large'}
          onPress={() =>
            onChange({ ...config, fontScale: 'large', updatedAt: Date.now() })
          }
        />
      </View>
      <View style={styles.switchRow}>
        <Text style={[styles.switchLabel, { fontSize: scaledFontSize(16) }]}>
          Alto contraste
        </Text>
        <Switch
          value={config.highContrast}
          onValueChange={(val) =>
            onChange({ ...config, highContrast: val, updatedAt: Date.now() })
          }
          trackColor={{ false: '#DDD', true: colorTokens.worldJungle }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colorTokens.brand700,
    marginBottom: 14,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
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
