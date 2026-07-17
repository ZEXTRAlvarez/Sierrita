import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatTile, colorTokens, useAccessibility } from '@sierrita/ui';
import { WORLD_LABEL } from '@sierrita/parents';
import { getGameConfig } from '@sierrita/games';
import type { GameStat, ProfileStats } from '@sierrita/storage';
import type { World } from '@sierrita/parents';

const WORLD_ORDER: World[] = ['jungle', 'ocean', 'space'];

function gameTitle(gameId: string): string {
  try {
    return getGameConfig(gameId).titleEs;
  } catch {
    return gameId;
  }
}

export interface WeeklyProgress {
  target: number;
  completed: number;
}

export interface StatsSectionProps {
  globalStats: ProfileStats;
  gameStats: GameStat[];
  weeklyProgress?: WeeklyProgress | null;
}

export function StatsSection({
  globalStats,
  gameStats,
  weeklyProgress,
}: StatsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const { scaledFontSize } = useAccessibility();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: scaledFontSize(18) }]}>
        📊 Estadísticas
      </Text>

      <View style={styles.statRow}>
        <StatTile value={globalStats.totalSessions} label="partidas" />
        <StatTile value={globalStats.totalMinutes} label="minutos" />
        <StatTile value={`${globalStats.avgScore}%`} label="prom." />
      </View>

      {weeklyProgress && (
        <View style={styles.goalBlock}>
          <Text style={[styles.goalLabel, { fontSize: scaledFontSize(14) }]}>
            🎯 Meta semanal: {weeklyProgress.completed} de{' '}
            {weeklyProgress.target} sesiones
          </Text>
          <View style={styles.goalBarTrack}>
            <View
              style={[
                styles.goalBarFill,
                {
                  width: `${Math.min(
                    100,
                    (weeklyProgress.completed / weeklyProgress.target) * 100,
                  )}%`,
                },
              ]}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.expandBtn}
        onPress={() => setExpanded((e) => !e)}
      >
        <Text style={styles.expandText}>
          {expanded ? '▲ Ocultar detalle' : '▼ Ver por juego'}
        </Text>
      </TouchableOpacity>

      {expanded &&
        WORLD_ORDER.map((world) => {
          const games = gameStats.filter((g) => g.world === world);
          if (games.length === 0) return null;
          return (
            <View key={world} style={styles.worldBlock}>
              <Text
                style={[styles.worldLabel, { fontSize: scaledFontSize(15) }]}
              >
                {WORLD_LABEL[world]}
              </Text>
              {games.map((gs) => (
                <View key={gs.gameId} style={styles.gameRow}>
                  <Text
                    style={[styles.gameName, { fontSize: scaledFontSize(14) }]}
                  >
                    {gameTitle(gs.gameId)}
                  </Text>
                  <Text
                    style={[styles.gameStat, { fontSize: scaledFontSize(13) }]}
                  >
                    {gs.sessions}× · {gs.avgScore}% · Niv.{gs.lastLevel}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
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
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  goalBlock: { marginBottom: 14 },
  goalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  goalBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F0F4FF',
    overflow: 'hidden',
  },
  goalBarFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colorTokens.success,
  },
  expandBtn: { alignSelf: 'center', marginTop: 4 },
  expandText: { color: colorTokens.brand500, fontWeight: '700', fontSize: 14 },
  worldBlock: { marginTop: 14 },
  worldLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#333',
    marginBottom: 6,
  },
  gameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4FF',
  },
  gameName: { fontSize: 14, color: '#333', flex: 1 },
  gameStat: { fontSize: 13, color: '#888', fontWeight: '600' },
});
