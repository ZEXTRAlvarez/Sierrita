import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { getLetterDef, getLetterSet } from '../../../../../../../libs/games/writing/letterPaths';
import { evaluatePath } from '../../../../../../../libs/games/writing/evaluator';
import type { Point } from '../../../../../../../libs/games/writing/evaluator';
import { speak } from '../../../../../../../libs/audio/src/audioManager';
import type { GameProps } from '../../GameScreen';
import LetterCanvas from './components/LetterCanvas';

const SCORE_THRESHOLD = 0.65;
const { width: SCREEN_W } = Dimensions.get('window');
const CANVAS_SIZE = Math.min(SCREEN_W - 48, 340);

export default function TracingGame({
  difficulty,
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const letterSet     = (params.letterSet as string) || 'vowels';
  const showGuide     = (params.showGuide as boolean) ?? true;
  const guideOpacity  = (params.guideOpacity as number) ?? 0.4;

  const letters = useRef<string[]>([]);
  const [letterIdx, setLetterIdx]   = useState(0);
  const [hitMap, setHitMap]         = useState<boolean[]>([]);
  const [allDrawn, setAllDrawn]     = useState<Point[]>([]);
  const [result, setResult]         = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [roundsDone, setRoundsDone] = useState(0);
  const feedbackScale               = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const set = getLetterSet(letterSet as 'vowels' | 'consonants-easy' | 'all');
    const picked: string[] = [];
    for (let i = 0; i < roundCount; i++) {
      picked.push(set[i % set.length]);
    }
    letters.current = picked;
    initLetter(0, picked);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initLetter(idx: number, list: string[]) {
    const letter = list[idx] ?? list[0];
    const def = getLetterDef(letter);
    if (!def) return;
    setHitMap(def.checkpoints.map(() => false));
    setAllDrawn([]);
    setResult('idle');
    speak(`Escribí la letra ${letter}`);
  }

  const currentLetter = letters.current[letterIdx];
  const letterDef     = currentLetter ? getLetterDef(currentLetter) : undefined;

  function flashScale() {
    feedbackScale.setValue(0.92);
    Animated.spring(feedbackScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }

  const handlePointDrawn = useCallback((point: Point, newHitMap: boolean[]) => {
    setHitMap(newHitMap);
    setAllDrawn((prev) => [...prev, point]);
  }, []);

  const advance = useCallback((correct: boolean) => {
    const next = roundsDone + 1;
    setRoundsDone(next);
    if (next >= roundCount) {
      setTimeout(() => onGameFinish(), 900);
    } else {
      setTimeout(() => {
        const nextIdx = letterIdx + 1;
        setLetterIdx(nextIdx);
        initLetter(nextIdx, letters.current);
      }, 900);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundsDone, roundCount, letterIdx, onGameFinish]);

  const handleStrokeEnd = useCallback(
    async (strokePoints: Point[]) => {
      if (!letterDef || result !== 'idle') return;

      const allPoints = [...allDrawn, ...strokePoints];
      const { score } = evaluatePath(allPoints, letterDef.checkpoints, CANVAS_SIZE);

      if (score >= SCORE_THRESHOLD) {
        setResult('correct');
        flashScale();
        await onRoundComplete(true, 0);
        advance(true);
      }
    },
    [letterDef, allDrawn, result, onRoundComplete, advance],
  );

  const handleGiveUp = useCallback(async () => {
    if (result !== 'idle') return;
    setResult('wrong');
    flashScale();
    await onRoundComplete(false, 0, 1);
    advance(false);
  }, [result, onRoundComplete, advance]);

  if (!letterDef) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.letterLabel}>{currentLetter}</Text>

      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Animated.View style={{ transform: [{ scale: feedbackScale }] }}>
        <LetterCanvas
          size={CANVAS_SIZE}
          letterDef={letterDef}
          showGuide={showGuide}
          guideOpacity={guideOpacity}
          hitMap={hitMap}
          onPointDrawn={handlePointDrawn}
          onStrokeEnd={handleStrokeEnd}
        />
      </Animated.View>

      {result === 'correct' && (
        <Text style={[styles.badge, { backgroundColor: '#4CAF50' }]}>
          ¡Muy bien! ⭐
        </Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, { backgroundColor: '#F44336' }]}>
          ¡Inténtalo de nuevo! 💪
        </Text>
      )}

      {result === 'idle' && (
        <Text style={styles.hint} onPress={handleGiveUp}>
          ¿Necesitás ayuda? Toca aquí
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    backgroundColor: '#F1F8E9',
  },
  letterLabel: {
    fontSize: 72,
    fontWeight: '900',
    color: '#2E7D32',
    lineHeight: 80,
    marginBottom: 4,
  },
  progress: {
    fontSize: 16,
    color: '#66BB6A',
    marginBottom: 12,
    fontWeight: '600',
  },
  badge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  hint: {
    marginTop: 24,
    color: '#A5D6A7',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
