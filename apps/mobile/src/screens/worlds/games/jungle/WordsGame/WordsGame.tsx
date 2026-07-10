import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import {
  getWords,
  getBlanks,
  getForcedBlank,
  getLetterOptions,
  getPhoneticOptions,
  type WordEntry,
} from '@sierrita/games';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { WordBlanks } from './components/WordBlanks';
import { LetterOptions } from './components/LetterOptions';
import { spellWord } from './logic/spellWord';
import { isWordCorrect } from './logic/isWordCorrect';
import { fillFirstEmpty, eraseLast } from './logic/chosenLetters';
import { styles } from './WordsGame.styles';

type Focus = 'h' | 'soft-c';

/** Specific spelling-rule reminder shown/narrated after a wrong answer in an H/soft-C round. */
function focusHint(word: string, focus?: Focus): string {
  if (focus === 'h') return `La H no suena, pero ${word} se escribe con H`;
  if (focus === 'soft-c')
    return `Acá la C suena como S, pero ${word} se escribe con C`;
  return '¡Casi! Intentá de nuevo';
}

export default function WordsGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const wordLength = (params.wordLength as 3 | 4 | 5) || 3;
  const blanks = (params.blanks as number) || 1;
  const category =
    (params.category as 'animals' | 'objects' | 'mixed') || 'animals';
  const focus = params.focus as Focus | undefined;

  const words = useRef<WordEntry[]>([]);
  const nextIdx = useRef(0);
  const blankIndices = useRef<number[]>([]);
  const options = useRef<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState<WordEntry | undefined>(
    undefined,
  );
  const [chosen, setChosen] = useState<(string | null)[]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const startRound = useCallback(() => {
    if (words.current.length === 0) {
      const list = getWords(wordLength, category, roundCount, focus);
      while (list.length < roundCount) list.push(...list);
      words.current = list.slice(0, roundCount);
    }
    const entry = words.current[nextIdx.current++];
    if (!entry) return;
    const bi = focus
      ? getForcedBlank(entry.word, focus === 'h' ? 'H' : 'C')
      : getBlanks(entry.word, blanks);
    blankIndices.current = bi;
    options.current = focus
      ? getPhoneticOptions(entry.word, bi[0], focus)
      : getLetterOptions(entry.word, bi);
    setCurrentEntry(entry);
    setChosen(bi.map(() => null));
    speak(`Completá la palabra: ${spellWord(entry.word, bi)}`);
  }, [wordLength, category, blanks, roundCount, focus]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function shake() {
    shakeAnim.setValue(0);
    const seq = [8, -8, 6, 0].map((v) =>
      Animated.timing(shakeAnim, {
        toValue: v,
        duration: 60,
        useNativeDriver: true,
      }),
    );
    Animated.sequence(seq).start();
  }

  const handleLetterPress = useCallback(
    (letter: string) => {
      if (result === 'idle' && !wrongFlash)
        setChosen((prev) => fillFirstEmpty(prev, letter));
    },
    [result, wrongFlash],
  );

  const handleErase = useCallback(() => {
    if (result === 'idle' && !wrongFlash) setChosen(eraseLast);
  }, [result, wrongFlash]);

  // Auto-evaluate once every blank has a chosen letter.
  useEffect(() => {
    if (result !== 'idle' || wrongFlash || !currentEntry) return;
    if (chosen.includes(null)) return;
    if (isWordCorrect(chosen, currentEntry.word, blankIndices.current)) {
      submitAnswer(true);
    } else {
      setWrongFlash(true);
      shake();
      speak(focusHint(currentEntry.word, focus));
      onRoundComplete(false, 0).then(() => {
        setTimeout(() => {
          setChosen(blankIndices.current.map(() => null));
          setWrongFlash(false);
        }, 800);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen]);

  if (!currentEntry) return null;
  const status =
    result === 'correct' ? 'correct' : wrongFlash ? 'wrong' : 'idle';
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{currentEntry.emoji}</Text>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <WordBlanks
          word={currentEntry.word}
          blankIndices={blankIndices.current}
          chosen={chosen}
          status={status}
        />
      </Animated.View>
      <TouchableOpacity style={styles.eraseBtn} onPress={handleErase}>
        <Text style={styles.eraseText}>⌫ Borrar</Text>
      </TouchableOpacity>
      <LetterOptions
        options={options.current}
        disabled={result !== 'idle' || wrongFlash}
        onPress={handleLetterPress}
      />
      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Perfecto! ⭐</Text>
      )}
      {wrongFlash && (
        <Text
          style={[styles.badge, styles.badgeWrong]}
          testID="words-wrong-badge"
        >
          {focusHint(currentEntry.word, focus)} 💪
        </Text>
      )}
    </View>
  );
}
