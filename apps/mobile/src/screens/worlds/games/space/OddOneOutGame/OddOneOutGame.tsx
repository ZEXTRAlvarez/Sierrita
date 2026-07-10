import { useCallback, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import {
  generateRound,
  type OddOneOutMode,
  type OddOneOutRound,
} from './logic/generateRound';
import { ItemChoices } from './components/ItemChoices';
import { styles } from './OddOneOutGame.styles';

export default function OddOneOutGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const itemCount = (params.itemCount as number) || 4;
  const mode = (params.mode as OddOneOutMode) || 'category';

  const [round, setRound] = useState<OddOneOutRound | null>(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const startRound = useCallback(() => {
    setRound(generateRound(itemCount, mode));
    speak('¿Cuál no pertenece al grupo?');
  }, [itemCount, mode]);

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

  function handleChoice(item: string) {
    if (!round || result !== 'idle') return;
    bounce();
    submitAnswer(item === round.intruder);
  }

  if (!round) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>
      <Text style={styles.instruction}>¿Cuál no pertenece al grupo? 🔍</Text>

      <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
        <ItemChoices
          items={round.items}
          intruder={round.intruder}
          result={result}
          onChoose={handleChoice}
        />
      </Animated.View>

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>
          ¡Encontraste al intruso! ⭐
        </Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! Era {round.intruder}
        </Text>
      )}
    </View>
  );
}
