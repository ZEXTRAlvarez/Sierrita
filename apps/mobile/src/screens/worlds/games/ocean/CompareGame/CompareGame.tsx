import { useCallback, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type ComparisonSymbol, type Mode, type Problem } from './logic/generateProblem';
import { VisualGroup } from './components/VisualGroup';
import { styles } from './CompareGame.styles';

const VISUAL_EMOJI = ['⭐', '🐠', '🌊', '🪸', '🐚'];

function announce(p: Problem, mode: Mode) {
  if (mode === 'visual') speak('¿Cuál lado tiene más? Tocá el símbolo correcto');
  else if (mode === 'expression') speak('Compará los dos lados. ¿Mayor, menor o igual?');
  else speak(`Compará ${p.left} y ${p.right}. ¿Mayor, menor o igual?`);
}

export default function CompareGame({ params, onRoundComplete, onGameFinish, roundCount }: GameProps) {
  const maxNumber = (params.maxNumber as number) || 20;
  const mode = (params.mode as Mode) || 'visual';
  const emojiRef = useRef(VISUAL_EMOJI[Math.floor(Math.random() * VISUAL_EMOJI.length)]);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [chosen, setChosen] = useState<ComparisonSymbol | null>(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const startRound = useCallback(() => {
    const p = generateProblem(maxNumber, mode);
    setProblem(p);
    setChosen(null);
    announce(p, mode);
  }, [maxNumber, mode]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount, onRoundComplete, onGameFinish, startRound,
  });

  function handleSymbol(sym: ComparisonSymbol) {
    if (!problem || result !== 'idle') return;
    setChosen(sym);
    bounceAnim.setValue(0.88);
    Animated.spring(bounceAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    submitAnswer(sym === problem.answer);
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>
      <Text style={styles.instruction}>{mode === 'visual' ? '¿Cuál lado tiene más?' : '¿Mayor, menor o igual?'}</Text>

      <Animated.View style={[styles.comparisonRow, { transform: [{ scale: bounceAnim }] }]}>
        <View style={styles.side}>
          {mode === 'visual' ? (
            <VisualGroup count={problem.left} emoji={emojiRef.current} />
          ) : mode === 'expression' ? (
            <Text style={styles.expressionText}>
              {Math.floor(problem.left / 2)} + {problem.left - Math.floor(problem.left / 2)}
            </Text>
          ) : (
            <Text style={styles.numberText}>{problem.left}</Text>
          )}
        </View>
        <View style={styles.symbolSlot}>
          <Text style={styles.questionMark}>?</Text>
        </View>
        <View style={styles.side}>
          {mode === 'visual'
            ? <VisualGroup count={problem.right} emoji={emojiRef.current} />
            : <Text style={styles.numberText}>{problem.right}</Text>}
        </View>
      </Animated.View>

      <View style={styles.symbolRow}>
        {(['>', '<', '='] as ComparisonSymbol[]).map((sym) => (
          <TouchableOpacity
            key={sym}
            style={[
              styles.symbolBtn,
              chosen === sym && result === 'correct' && styles.correctSymBtn,
              chosen === sym && result === 'wrong' && styles.wrongSymBtn,
              result !== 'idle' && sym === problem.answer && styles.correctSymBtn,
            ]}
            onPress={() => handleSymbol(sym)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.symbolBtnText}>{sym}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && <Text style={[styles.badge, styles.badgeCorrect]}>{problem.left} {problem.answer} {problem.right} ✓ ⭐</Text>}
      {result === 'wrong' && <Text style={[styles.badge, styles.badgeWrong]}>La respuesta es {problem.answer} 💪</Text>}
    </View>
  );
}
