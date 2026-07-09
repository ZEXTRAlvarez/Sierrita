import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../../GameScreen';
import { useGameRound } from '../../../shared/useGameRound';
import { generateRound, type Item, type Round } from '../logic/generateRound';

export interface UseClassifyGameStateOptions {
  categories: number;
  attribute: string;
  itemCount: number;
  onRoundComplete: GameProps['onRoundComplete'];
  onGameFinish: () => void;
  roundCount: number;
}

const EMPTY_ROUND: Round = { categories: [], items: [] };

/** Owns the item-bank/bins/selection state machine for a classify round, on top of `useGameRound`. */
export function useClassifyGameState({
  categories,
  attribute,
  itemCount,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: UseClassifyGameStateOptions) {
  const [round, setRound] = useState<Round>(EMPTY_ROUND);
  const [bins, setBins] = useState<Item[][]>([]);
  const [pending, setPending] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const bounce = useCallback(() => {
    bounceAnim.setValue(0.92);
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [bounceAnim]);

  const startRound = useCallback(() => {
    const r = generateRound(categories, attribute, itemCount);
    setRound(r);
    setPending(r.items);
    setBins(Array.from({ length: r.categories.length }, () => []));
    setSelected(null);
    speak('Clasificá los objetos en su grupo');
  }, [categories, attribute, itemCount]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  const handleItemPress = useCallback(
    (item: Item) => {
      if (result !== 'idle') return;
      setSelected((prev) => (prev?.id === item.id ? null : item));
    },
    [result],
  );

  const handleBinPress = useCallback(
    async (binIdx: number) => {
      if (!selected || result !== 'idle') return;
      const item = selected;
      const correct = item.categoryIdx === binIdx;

      setPending((prev) => prev.filter((i) => i.id !== item.id));
      setBins((prev) => {
        const next = prev.map((b) => [...b]);
        next[binIdx] = [...next[binIdx], item];
        return next;
      });
      setSelected(null);

      if (!correct) {
        bounce();
        setTimeout(() => {
          setBins((prev) => {
            const next = prev.map((b) => [...b]);
            next[binIdx] = next[binIdx].filter((i) => i.id !== item.id);
            return next;
          });
          setPending((prev) => [...prev, item]);
          speak('Ese no es su grupo. ¡Intentá de nuevo!');
        }, 700);
        await onRoundComplete(false, 0);
        return;
      }

      const remainingAfter = pending.filter((i) => i.id !== item.id);
      if (remainingAfter.length === 0) {
        bounce();
        submitAnswer(true);
      }
    },
    [selected, pending, result, onRoundComplete, bounce, submitAnswer],
  );

  return {
    round,
    bins,
    pending,
    selected,
    result,
    roundsDone,
    bounceAnim,
    handleItemPress,
    handleBinPress,
  };
}
