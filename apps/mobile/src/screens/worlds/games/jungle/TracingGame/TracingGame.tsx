import { useCallback, useRef, useState } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { getLetterDef, getLetterSet } from '@sierrita/games';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import LetterCanvas from '../components/LetterCanvas';
import { styles } from './TracingGame.styles';

const { width: SCREEN_W } = Dimensions.get('window');
const CANVAS_SIZE = Math.min(SCREEN_W - 48, 340);

export default function TracingGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const letterSet = (params.letterSet as string) || 'vowels';
  const showGuide = (params.showGuide as boolean) ?? true;
  const guideOpacity = (params.guideOpacity as number) ?? 0.4;

  const letters = useRef<string[]>([]);
  const nextIdx = useRef(0);
  const [currentLetter, setCurrentLetter] = useState('');
  const feedbackScale = useRef(new Animated.Value(1)).current;

  const startRound = useCallback(() => {
    if (letters.current.length === 0) {
      const set = getLetterSet(
        letterSet as 'vowels' | 'consonants-easy' | 'all',
      );
      letters.current = Array.from(
        { length: roundCount },
        (_, i) => set[i % set.length],
      );
    }
    const letter = letters.current[nextIdx.current++] ?? letters.current[0];
    setCurrentLetter(letter);
    speak(`Escribí la letra ${letter}`);
  }, [letterSet, roundCount]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  const letterDef = currentLetter ? getLetterDef(currentLetter) : undefined;

  function flashScale() {
    feedbackScale.setValue(0.92);
    Animated.spring(feedbackScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }

  const handleComplete = useCallback(() => {
    if (result !== 'idle') return;
    flashScale();
    submitAnswer(true);
  }, [result, submitAnswer]);

  const handleTrackLost = useCallback(() => {
    if (result !== 'idle') return;
    flashScale();
    submitAnswer(false, 0, 0);
  }, [result, submitAnswer]);

  const handleGiveUp = useCallback(() => {
    if (result !== 'idle') return;
    flashScale();
    submitAnswer(false, 0, 1);
  }, [result, submitAnswer]);

  if (!letterDef) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.letterLabel}>{currentLetter}</Text>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>
      <Animated.View style={{ transform: [{ scale: feedbackScale }] }}>
        <LetterCanvas
          key={`${currentLetter}-${roundsDone}`}
          size={CANVAS_SIZE}
          letterDef={letterDef}
          showGuide={showGuide}
          guideOpacity={guideOpacity}
          onComplete={handleComplete}
          onTrackLost={handleTrackLost}
        />
      </Animated.View>
      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Muy bien! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
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
