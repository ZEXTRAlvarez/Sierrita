import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import type { GameSummary } from '../../../../libs/games/src/types';
import { usePet } from '../hooks/usePet';

interface Props {
  summary: GameSummary;
  onPlayAgain: () => void;
  onBack: () => void;
}

const WORLD_COLOR: Record<string, string> = {
  jungle: '#4CAF50',
  ocean:  '#2196F3',
  space:  '#9C27B0',
};

const STAR_MESSAGES: Record<1 | 2 | 3, string> = {
  1: '¡Muy bien intentado!',
  2: '¡Súper bien!',
  3: '¡Sos una estrella!',
};

export default function GameResultScreen({ summary, onPlayAgain, onBack }: Props) {
  const { rewardXp } = usePet();
  const scale      = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const starsScale = useRef(new Animated.Value(0)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale,   { toValue: 1, damping: 12, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(starsScale,   { toValue: 1, damping: 8, useNativeDriver: true }),
        Animated.timing(starsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 400);

    rewardXp(summary.xpEarned);
  }, []);

  const color = WORLD_COLOR[summary.world] ?? '#4CAF50';
  const stars = '⭐'.repeat(summary.stars) + '☆'.repeat(3 - summary.stars);

  return (
    <View style={[styles.container, { backgroundColor: color + '22' }]}>
      <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>

        <Animated.Text style={[styles.stars, { transform: [{ scale: starsScale }], opacity: starsOpacity }]}>
          {stars}
        </Animated.Text>
        <Text style={styles.message}>{STAR_MESSAGES[summary.stars]}</Text>

        <View style={styles.statsRow}>
          <Stat label="Correctas" value={`${summary.correctRounds}/${summary.totalRounds}`} />
          <Stat label="XP ganado"  value={`+${summary.xpEarned} ⭐`} />
          <Stat label="Tiempo"     value={`${summary.durationSecs}s`} />
        </View>

        <View style={styles.scoreBar}>
          <View style={[styles.scoreFill, {
            width: `${Math.round(summary.scorePercent * 100)}%` as any,
            backgroundColor: color,
          }]} />
        </View>
        <Text style={styles.scoreText}>{Math.round(summary.scorePercent * 100)}%</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: color }]}
            onPress={onPlayAgain}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>🔄 Jugar de nuevo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={onBack}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, { color: '#555' }]}>🏠 Volver</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={statStyles.box}>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: {
    backgroundColor: '#FFF', borderRadius: 32, padding: 32,
    alignItems: 'center', width: '100%', elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
  },
  stars:    { fontSize: 52, marginBottom: 8, letterSpacing: 4 },
  message:  { fontSize: 24, fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  scoreBar: { width: '100%', height: 16, backgroundColor: '#EEE', borderRadius: 8, overflow: 'hidden', marginBottom: 6 },
  scoreFill: { height: '100%', borderRadius: 8 },
  scoreText: { fontSize: 18, fontWeight: '800', color: '#888', marginBottom: 24 },
  actions:  { gap: 12, width: '100%' },
  btn: { borderRadius: 18, padding: 16, alignItems: 'center', width: '100%' },
  btnSecondary: { backgroundColor: '#F5F5F5' },
  btnText: { fontSize: 18, fontWeight: '800', color: '#FFF' },
});

const statStyles = StyleSheet.create({
  box: { alignItems: 'center', flex: 1 },
  value: { fontSize: 20, fontWeight: '800', color: '#333' },
  label: { fontSize: 12, color: '#999', fontWeight: '600', marginTop: 2 },
});
