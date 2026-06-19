// Plantilla base que usan todos los juegos mientras no están implementados
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { GameProps } from '../GameScreen';

interface PlaceholderProps extends GameProps {
  title: string;
  emoji: string;
  color: string;
}

export default function GamePlaceholder({
  title, emoji, color, difficulty, roundCount,
  onRoundComplete, onGameFinish,
}: PlaceholderProps) {
  const [round, setRound] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => { startRef.current = Date.now(); }, [round]);

  async function handleAnswer(correct: boolean) {
    const elapsed = Date.now() - startRef.current;
    await onRoundComplete(correct, elapsed);
    const nextRound = round + 1;
    if (nextRound >= roundCount) {
      onGameFinish();
    } else {
      setRound(nextRound);
      startRef.current = Date.now();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>Nivel {difficulty} · Ronda {round + 1}/{roundCount}</Text>
      <Text style={styles.placeholder}>🚧 En construcción 🚧</Text>
      <View style={styles.demoRow}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#4CAF50' }]}
          onPress={() => handleAnswer(true)}
        >
          <Text style={styles.btnText}>✓ Correcto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#F44336' }]}
          onPress={() => handleAnswer(false)}
        >
          <Text style={styles.btnText}>✗ Error</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emoji:       { fontSize: 72, marginBottom: 12 },
  title:       { fontSize: 24, fontWeight: '800', color: '#333', textAlign: 'center' },
  sub:         { fontSize: 14, color: '#999', marginTop: 6, marginBottom: 24 },
  placeholder: { fontSize: 32, marginBottom: 40 },
  demoRow:     { flexDirection: 'row', gap: 16 },
  btn:         { borderRadius: 16, paddingHorizontal: 24, paddingVertical: 14 },
  btnText:     { color: '#FFF', fontWeight: '800', fontSize: 16 },
});
