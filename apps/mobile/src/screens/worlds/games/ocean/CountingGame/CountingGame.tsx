import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { rand } from '../../shared/rand';
import { useGameRound } from '../../shared/useGameRound';
import { generateOptions } from './logic/generateOptions';
import { ObjectGrid } from './components/ObjectGrid';
import { styles } from './CountingGame.styles';

const OBJECTS = ['🐟', '🐠', '🦀', '🐙', '🦑', '🐚', '🪸', '🦞'];

export default function CountingGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const maxNumber = (params.maxNumber as number) || 10;
  const emojiRef = useRef(OBJECTS[Math.floor(Math.random() * OBJECTS.length)]);

  const [target, setTarget] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const startRound = useCallback(() => {
    const n = rand(1, maxNumber);
    setTarget(n);
    setOptions(generateOptions(n, maxNumber));
    speak('¿Cuántos hay? Contálos');
  }, [maxNumber]);

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

  function handleAnswer(answer: number) {
    if (result !== 'idle') return;
    bounce();
    submitAnswer(answer === target);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>
      <Text style={styles.question}>¿Cuántos hay?</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        <Animated.View
          style={[styles.bounceWrap, { transform: [{ scale: bounceAnim }] }]}
        >
          <ObjectGrid count={target} emoji={emojiRef.current} />
        </Animated.View>
      </ScrollView>

      <View style={styles.optionsRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            testID="counting-option"
            style={[
              styles.optionBtn,
              result !== 'idle' && opt === target && styles.correctBtn,
            ]}
            onPress={() => handleAnswer(opt)}
            disabled={result !== 'idle'}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>¡Casi! 💪</Text>
      )}
    </View>
  );
}
