import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { speak } from '../../../../../../../libs/audio/src/audioManager';
import type { GameProps } from '../../GameScreen';

// Families of visually distinct emojis grouped by attribute type
const COLOR_SETS = [
  ['🔴', '🔵', '🟡', '🟢', '🟠', '🟣'],
];
const SHAPE_COMBOS = [
  ['⭐', '🔶', '🔷', '💎'],
  ['🌟', '🌙', '☀️', '🪐'],
];
const SPACE_EMOJIS = ['🚀', '🌟', '💫', '🪐', '☄️', '🛸', '🌠', '👾', '🔭', '💥'];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface PatternRound {
  sequence: string[];   // full sequence including answer
  missingIdx: number;   // which index is the blank
  choices: string[];    // options shown to user
  answer: string;
}

function generatePattern(patternLength: number, attributes: string[], choices: number): PatternRound {
  // Pick a repeating unit length (2 or 3 elements)
  const unitLen = patternLength <= 3 ? 2 : attributes.length === 1 ? 2 : 3;

  // Pick elements pool based on attributes
  let pool: string[];
  if (attributes.includes('shape') && attributes.includes('color')) {
    pool = shuffle([...SPACE_EMOJIS]).slice(0, unitLen + 2);
  } else if (attributes.includes('color')) {
    pool = shuffle([...COLOR_SETS[0]]).slice(0, unitLen);
  } else {
    pool = shuffle([...SHAPE_COMBOS[rand(0, SHAPE_COMBOS.length - 1)]]).slice(0, unitLen);
  }

  const unit = pool.slice(0, unitLen);
  const totalLen = patternLength + 1;   // show patternLength items + 1 for context
  const sequence: string[] = [];
  for (let i = 0; i < totalLen; i++) {
    sequence.push(unit[i % unit.length]);
  }

  // Hide the last element
  const missingIdx = totalLen - 1;
  const answer = sequence[missingIdx];

  // Distractors
  const distractors = shuffle(SPACE_EMOJIS.filter((e) => !unit.includes(e))).slice(0, choices - 1);
  const choiceSet = shuffle([answer, ...distractors]).slice(0, choices);

  return { sequence, missingIdx, choices: choiceSet, answer };
}

export default function PatternsGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const patternLength = (params.patternLength as number) || 3;
  const attributes    = (params.attributes as string[]) || ['color'];
  const choiceCount   = (params.choices as number) || 2;

  const [round, setRound]           = useState<PatternRound | null>(null);
  const [result, setResult]         = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [roundsDone, setRoundsDone] = useState(0);
  const bounceAnim                  = useRef(new Animated.Value(1)).current;

  useEffect(() => { newRound(); }, []);

  function newRound() {
    const r = generatePattern(patternLength, attributes, choiceCount);
    setRound(r);
    setResult('idle');
    speak('¿Qué sigue en la secuencia?');
  }

  function bounce() {
    bounceAnim.setValue(0.88);
    Animated.spring(bounceAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }

  const handleChoice = useCallback(async (choice: string) => {
    if (!round || result !== 'idle') return;
    const correct = choice === round.answer;
    setResult(correct ? 'correct' : 'wrong');
    bounce();
    await onRoundComplete(correct, 0);
    const next = roundsDone + 1;
    setRoundsDone(next);
    if (next >= roundCount) {
      setTimeout(() => onGameFinish(), 900);
    } else {
      setTimeout(() => newRound(), 900);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, result, roundsDone, roundCount, onRoundComplete, onGameFinish]);

  if (!round) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>
      <Text style={styles.instruction}>¿Qué sigue?</Text>

      {/* Sequence display */}
      <Animated.View
        style={[styles.sequenceRow, { transform: [{ scale: bounceAnim }] }]}
      >
        {round.sequence.map((item, i) => (
          <View
            key={i}
            style={[styles.seqItem, i === round.missingIdx && styles.blankItem]}
          >
            {i === round.missingIdx ? (
              <Text style={styles.blank}>?</Text>
            ) : (
              <Text style={styles.seqEmoji}>{item}</Text>
            )}
          </View>
        ))}
      </Animated.View>

      {/* Choices */}
      <View style={styles.choicesRow}>
        {round.choices.map((ch, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.choiceBtn,
              result !== 'idle' && ch === round.answer && styles.correctBtn,
              result === 'wrong' && ch !== round.answer && styles.dimBtn,
            ]}
            onPress={() => handleChoice(ch)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.choiceEmoji}>{ch}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && <Text style={[styles.badge, { backgroundColor: '#7B1FA2' }]}>¡Correcto! ⭐</Text>}
      {result === 'wrong'   && <Text style={[styles.badge, { backgroundColor: '#F44336' }]}>¡Casi! Era {round.answer}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: '#F3E5F5',
  },
  progress:    { fontSize: 16, color: '#7B1FA2', fontWeight: '600', marginBottom: 4 },
  instruction: { fontSize: 22, fontWeight: '800', color: '#4A148C', marginBottom: 16 },
  sequenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  seqItem: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#CE93D8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  blankItem: {
    backgroundColor: '#FFF9C4',
    borderWidth: 2,
    borderColor: '#F9A825',
    borderStyle: 'dashed',
  },
  seqEmoji: { fontSize: 30 },
  blank:    { fontSize: 28, fontWeight: '900', color: '#F9A825' },
  choicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  choiceBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  correctBtn: { backgroundColor: '#4CAF50' },
  dimBtn:     { opacity: 0.4 },
  choiceEmoji: { fontSize: 34 },
  badge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
