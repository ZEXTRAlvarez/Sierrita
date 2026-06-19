import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView,
} from 'react-native';
import { speak } from '../../../../../../../libs/audio/src/audioManager';
import type { GameProps } from '../../GameScreen';

// ── Item definitions ─────────────────────────────────────────────────────────

const CATEGORY_SETS: Record<string, { label: string; items: string[] }[]> = {
  color: [
    { label: '🔴 Rojos',     items: ['🍎', '🌹', '🍓', '🚒', '❤️', '🌶️'] },
    { label: '🔵 Azules',    items: ['🐋', '🫐', '💙', '🔷', '🌊', '🧊'] },
    { label: '🟡 Amarillos', items: ['🌟', '🌻', '🍌', '🌕', '⭐', '🍋'] },
    { label: '🟢 Verdes',    items: ['🌿', '🐢', '🍏', '🌳', '🐸', '🥑'] },
  ],
  shape: [
    { label: '🔵 Redondos', items: ['🌕', '⚽', '🍊', '🌍', '🎱', '🪙'] },
    { label: '🔶 Cuadrados/Rectángulos', items: ['📦', '🧱', '📺', '🖥️', '🗃️', '📚'] },
    { label: '⭐ Estrellados', items: ['⭐', '🌟', '✨', '💫', '🌠', '⚡'] },
    { label: '🔺 Triangulares', items: ['🔺', '🏔️', '🎄', '🍕', '🎭', '⛰️'] },
  ],
  size: [
    { label: '🐘 Grandes', items: ['🐘', '🦒', '🐋', '🌳', '🏢', '🚁'] },
    { label: '🐭 Pequeños', items: ['🐭', '🐜', '🐝', '🌸', '🍓', '🔩'] },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Item {
  id: number;
  emoji: string;
  categoryIdx: number;
}

interface Round {
  categories: { label: string }[];
  items: Item[];
}

function generateRound(categoryCount: number, attribute: string, itemCount: number): Round {
  const sets = CATEGORY_SETS[attribute] ?? CATEGORY_SETS['color'];
  const picked = shuffle(sets).slice(0, Math.min(categoryCount, sets.length));

  const perCategory = Math.ceil(itemCount / picked.length);
  const items: Item[] = [];
  let id = 0;

  for (let ci = 0; ci < picked.length; ci++) {
    const pool = shuffle(picked[ci].items).slice(0, perCategory);
    for (const emoji of pool) {
      items.push({ id: id++, emoji, categoryIdx: ci });
    }
  }

  return {
    categories: picked.map((p) => ({ label: p.label })),
    items: shuffle(items),
  };
}

export default function ClassifyGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const categories = (params.categories as number) || 2;
  const attribute  = (params.attribute as string) || 'color';
  const itemCount  = (params.itemCount as number) || 6;

  const [round, setRound]                 = useState<Round>(() => generateRound(categories, attribute, itemCount));
  const [bins, setBins]                   = useState<Item[][]>(() => Array.from({ length: categories }, () => []));
  const [pending, setPending]             = useState<Item[]>([]);
  const [selected, setSelected]           = useState<Item | null>(null);
  const [result, setResult]               = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [roundsDone, setRoundsDone]       = useState(0);
  const bounceAnim                        = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const r = round;
    setPending(r.items);
    setBins(Array.from({ length: r.categories.length }, () => []));
    speak('Clasificá los objetos en su grupo');
  }, []);

  function newRound() {
    const r = generateRound(categories, attribute, itemCount);
    setRound(r);
    setPending(r.items);
    setBins(Array.from({ length: r.categories.length }, () => []));
    setSelected(null);
    setResult('idle');
    speak('Clasificá los objetos en su grupo');
  }

  function bounce() {
    bounceAnim.setValue(0.92);
    Animated.spring(bounceAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }

  const handleItemPress = useCallback((item: Item) => {
    if (result !== 'idle') return;
    setSelected((prev) => (prev?.id === item.id ? null : item));
  }, [result]);

  const handleBinPress = useCallback(async (binIdx: number) => {
    if (!selected || result !== 'idle') return;

    const correct = selected.categoryIdx === binIdx;

    // Move item to bin
    setPending((prev) => prev.filter((i) => i.id !== selected.id));
    setBins((prev) => {
      const next = prev.map((b) => [...b]);
      next[binIdx] = [...next[binIdx], selected];
      return next;
    });
    setSelected(null);

    if (!correct) {
      bounce();
      // Move it back after a moment
      setTimeout(() => {
        setBins((prev) => {
          const next = prev.map((b) => [...b]);
          next[binIdx] = next[binIdx].filter((i) => i.id !== selected.id);
          return next;
        });
        setPending((prev) => [...prev, selected]);
        speak('Ese no es su grupo. ¡Intentá de nuevo!');
      }, 700);
      await onRoundComplete(false, 0);
      return;
    }

    // Check if all items are classified
    const remainingAfter = pending.filter((i) => i.id !== selected.id);
    if (remainingAfter.length === 0) {
      setResult('correct');
      bounce();
      await onRoundComplete(true, 0);
      const next = roundsDone + 1;
      setRoundsDone(next);
      if (next >= roundCount) {
        setTimeout(() => onGameFinish(), 900);
      } else {
        setTimeout(() => newRound(), 900);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, pending, result, roundsDone, roundCount, onRoundComplete, onGameFinish]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>
      <Text style={styles.instruction}>Clasificá los objetos ↓</Text>

      {/* Item bank */}
      <View style={styles.itemBank}>
        {pending.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.itemChip,
              selected?.id === item.id && styles.itemSelected,
            ]}
            onPress={() => handleItemPress(item)}
          >
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category bins */}
      <Animated.View
        style={[styles.binsRow, { transform: [{ scale: bounceAnim }] }]}
      >
        {round.categories.map((cat, ci) => (
          <TouchableOpacity
            key={ci}
            style={[
              styles.bin,
              selected && styles.binActive,
            ]}
            onPress={() => handleBinPress(ci)}
            disabled={!selected}
          >
            <Text style={styles.binLabel}>{cat.label}</Text>
            <View style={styles.binItems}>
              {bins[ci]?.map((item) => (
                <Text key={item.id} style={styles.binItemEmoji}>{item.emoji}</Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {result === 'correct' && (
        <Text style={[styles.badge, { backgroundColor: '#7B1FA2' }]}>
          ¡Clasificaste todo! ⭐
        </Text>
      )}

      {selected && (
        <Text style={styles.hint}>
          Tocá un grupo para poner {selected.emoji} allí
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#F3E5F5',
    minHeight: '100%',
  },
  progress:    { fontSize: 16, color: '#7B1FA2', fontWeight: '600', marginBottom: 4 },
  instruction: { fontSize: 20, fontWeight: '700', color: '#4A148C', marginBottom: 12 },
  itemBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    minHeight: 60,
  },
  itemChip: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CE93D8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  itemSelected: {
    backgroundColor: '#9C27B0',
    borderWidth: 3,
    borderColor: '#FFF9C4',
    transform: [{ scale: 1.12 }],
  },
  itemEmoji: { fontSize: 28 },
  binsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  bin: {
    minWidth: 130,
    minHeight: 100,
    backgroundColor: '#EDE7F6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CE93D8',
    padding: 10,
    alignItems: 'center',
  },
  binActive: {
    borderColor: '#9C27B0',
    borderStyle: 'dashed',
    backgroundColor: '#E1BEE7',
  },
  binLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A148C',
    marginBottom: 6,
    textAlign: 'center',
  },
  binItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  binItemEmoji: { fontSize: 22 },
  badge: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  hint: {
    marginTop: 12,
    color: '#AB47BC',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
