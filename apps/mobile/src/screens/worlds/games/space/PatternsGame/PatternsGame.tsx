import { useCallback, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generatePattern, type PatternRound } from './logic/generatePattern';
import { PatternSequence } from './components/PatternSequence';
import { PatternChoices } from './components/PatternChoices';
import { styles } from './PatternsGame.styles';

export default function PatternsGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const patternLength = (params.patternLength as number) || 3;
  const attributes = (params.attributes as string[]) || ['color'];
  const choiceCount = (params.choices as number) || 2;

  const [round, setRound] = useState<PatternRound | null>(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const startRound = useCallback(() => {
    setRound(generatePattern(patternLength, attributes, choiceCount));
    speak('¿Qué sigue en la secuencia?');
  }, [patternLength, attributes, choiceCount]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function bounce() {
    bounceAnim.setValue(0.88);
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }

  function handleChoice(choice: string) {
    if (!round || result !== 'idle') return;
    bounce();
    submitAnswer(choice === round.answer);
  }

  if (!round) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>
      <Text style={styles.instruction}>¿Qué sigue?</Text>

      <PatternSequence
        sequence={round.sequence}
        missingIdx={round.missingIdx}
        bounceAnim={bounceAnim}
      />

      <PatternChoices
        choices={round.choices}
        answer={round.answer}
        result={result}
        onChoose={handleChoice}
      />

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! Era {round.answer}
        </Text>
      )}
    </View>
  );
}
