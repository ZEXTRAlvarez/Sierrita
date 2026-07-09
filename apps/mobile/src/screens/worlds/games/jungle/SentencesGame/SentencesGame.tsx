import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { getSentences, shuffleWords, type SentenceEntry } from '@sierrita/games';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { WordTray } from './components/WordTray';
import { WordBank } from './components/WordBank';
import { isSentenceCorrect } from './logic/isSentenceCorrect';
import { styles } from './SentencesGame.styles';

export default function SentencesGame({ params, onRoundComplete, onGameFinish, roundCount }: GameProps) {
  const wordCount = (params.wordCount as 3 | 4 | 5) || 3;
  const sentences = useRef<SentenceEntry[]>([]);
  const nextIdx    = useRef(0);
  const [currentSentence, setCurrentSentence] = useState<SentenceEntry | undefined>(undefined);
  const [placed, setPlaced]         = useState<string[]>([]);
  const [available, setAvailable]   = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const shakeAnim                   = useRef(new Animated.Value(0)).current;

  function resetTray(entry: SentenceEntry) {
    setAvailable(shuffleWords(entry.words));
    setPlaced([]);
  }

  const startRound = useCallback(() => {
    if (sentences.current.length === 0) {
      const list = getSentences(wordCount, roundCount);
      while (list.length < roundCount) list.push(...list);
      sentences.current = list.slice(0, roundCount);
    }
    const entry = sentences.current[nextIdx.current++];
    if (!entry) return;
    setCurrentSentence(entry);
    resetTray(entry);
    speak('Ordená las palabras para formar la oración');
  }, [wordCount, roundCount]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount, onRoundComplete, onGameFinish, startRound,
  });

  function shake() {
    shakeAnim.setValue(0);
    const seq = [10, -10, 8, 0].map((v) => Animated.timing(shakeAnim, { toValue: v, duration: 60, useNativeDriver: true }));
    Animated.sequence(seq).start();
  }

  const canInteract = result === 'idle' && !wrongFlash;
  const placeWord = useCallback((word: string, fromIdx: number) => {
    if (!canInteract) return;
    setAvailable((prev) => prev.filter((_, i) => i !== fromIdx));
    setPlaced((prev) => [...prev, word]);
  }, [canInteract]);
  const removeWord = useCallback((word: string, fromIdx: number) => {
    if (!canInteract) return;
    setPlaced((prev) => prev.filter((_, i) => i !== fromIdx));
    setAvailable((prev) => [...prev, word]);
  }, [canInteract]);

  // Check once every word from the bank has been placed.
  useEffect(() => {
    if (!currentSentence || result !== 'idle' || wrongFlash) return;
    if (available.length > 0) return;
    if (isSentenceCorrect(placed, currentSentence.words)) {
      submitAnswer(true);
    } else {
      setWrongFlash(true);
      shake();
      speak('Eso no es correcto. ¡Intentá de nuevo!');
      onRoundComplete(false, 0).then(() => {
        setTimeout(() => {
          resetTray(currentSentence);
          setWrongFlash(false);
        }, 1000);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available, placed]);

  if (!currentSentence) return null;
  const status = result === 'correct' ? 'correct' : wrongFlash ? 'wrong' : 'idle';
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{currentSentence.emoji}</Text>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>
      <Text style={styles.instruction}>Ordená las palabras</Text>
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <WordTray placed={placed} status={status} disabled={!canInteract} onRemove={removeWord} />
      </Animated.View>
      <WordBank available={available} disabled={!canInteract} onPress={placeWord} />
      {result === 'correct' && <Text style={[styles.badge, styles.badgeCorrect]}>¡Perfecto! ⭐</Text>}
      {wrongFlash && <Text style={[styles.badge, styles.badgeWrong]}>¡Revisa el orden! 🔄</Text>}
    </View>
  );
}
