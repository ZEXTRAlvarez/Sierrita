import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import { generateProblem, type Problem } from './logic/generateProblem';
import { generateFractionOptions } from './logic/generateFractionOptions';
import { fractionLabel, fractionValue, type Fraction } from './logic/fraction';
import { FractionShape } from './components/FractionShape';
import { styles } from './FractionsGame.styles';

export default function FractionsGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const denominators = (params.denominators as number[]) || [2, 4];
  const compareChance = (params.compareChance as number) || 0;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [options, setOptions] = useState<Fraction[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  const startRound = useCallback(() => {
    const p = generateProblem(denominators, compareChance);
    setProblem(p);
    setSelected([]);
    if (p.mode === 'identify') {
      setOptions(
        generateFractionOptions(
          { numerator: p.shaded, denominator: p.parts },
          denominators,
        ),
      );
      speak('¿Qué fracción está pintada?');
    } else if (p.mode === 'form') {
      speak(`Pintá ${p.target} de ${p.parts} partes`);
    } else {
      speak('¿Cuál fracción es más grande?');
    }
  }, [denominators, compareChance]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function toggleSegment(index: number) {
    if (result !== 'idle') return;
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }

  function handleIdentifyAnswer(option: Fraction) {
    if (!problem || problem.mode !== 'identify' || result !== 'idle') return;
    const correctLabel = fractionLabel({
      numerator: problem.shaded,
      denominator: problem.parts,
    });
    submitAnswer(fractionLabel(option) === correctLabel);
  }

  function handleFormConfirm() {
    if (!problem || problem.mode !== 'form' || result !== 'idle') return;
    submitAnswer(selected.length === problem.target);
  }

  function handleCompareAnswer(choice: 'a' | 'b') {
    if (!problem || problem.mode !== 'compare' || result !== 'idle') return;
    const biggerIsA = fractionValue(problem.a) > fractionValue(problem.b);
    submitAnswer((choice === 'a') === biggerIsA);
  }

  function wrongMessage(): string {
    if (!problem) return '';
    if (problem.mode === 'identify') {
      return `¡Casi! La respuesta es ${fractionLabel({ numerator: problem.shaded, denominator: problem.parts })}`;
    }
    if (problem.mode === 'form') {
      return `¡Casi! Tenías que pintar ${problem.target}/${problem.parts}`;
    }
    const biggerIsA = fractionValue(problem.a) > fractionValue(problem.b);
    const biggerLabel = biggerIsA
      ? fractionLabel(problem.a)
      : fractionLabel(problem.b);
    return `¡Casi! La fracción más grande es ${biggerLabel}`;
  }

  if (!problem) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      {problem.mode === 'identify' && (
        <>
          <Text style={styles.prompt}>¿Qué fracción está pintada?</Text>
          <FractionShape
            parts={problem.parts}
            filled={Array.from({ length: problem.shaded }, (_, i) => i)}
          />
          <View style={styles.optionsRow}>
            {options.map((opt) => {
              const isCorrectOpt =
                fractionLabel(opt) ===
                fractionLabel({
                  numerator: problem.shaded,
                  denominator: problem.parts,
                });
              return (
                <TouchableOpacity
                  key={fractionLabel(opt)}
                  testID="fraction-option"
                  style={[
                    styles.optionBtn,
                    result !== 'idle' && isCorrectOpt && styles.correctBtn,
                  ]}
                  onPress={() => handleIdentifyAnswer(opt)}
                  disabled={result !== 'idle'}
                >
                  <Text style={styles.optionText}>{fractionLabel(opt)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {problem.mode === 'form' && (
        <>
          <Text style={styles.prompt}>
            Pintá {problem.target}/{problem.parts}
          </Text>
          <FractionShape
            parts={problem.parts}
            filled={selected}
            onToggleSegment={toggleSegment}
          />
          <TouchableOpacity
            testID="fraction-confirm"
            style={styles.confirmBtn}
            onPress={handleFormConfirm}
            disabled={result !== 'idle'}
          >
            <Text style={styles.confirmText}>¡Listo!</Text>
          </TouchableOpacity>
        </>
      )}

      {problem.mode === 'compare' && (
        <>
          <Text style={styles.prompt}>¿Cuál fracción es más grande?</Text>
          <View style={styles.compareRow}>
            <TouchableOpacity
              testID="fraction-compare-a"
              style={styles.compareOption}
              onPress={() => handleCompareAnswer('a')}
              disabled={result !== 'idle'}
            >
              <FractionShape
                parts={problem.a.denominator}
                filled={Array.from(
                  { length: problem.a.numerator },
                  (_, i) => i,
                )}
              />
              <Text style={styles.compareLabel}>
                {fractionLabel(problem.a)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="fraction-compare-b"
              style={styles.compareOption}
              onPress={() => handleCompareAnswer('b')}
              disabled={result !== 'idle'}
            >
              <FractionShape
                parts={problem.b.denominator}
                filled={Array.from(
                  { length: problem.b.numerator },
                  (_, i) => i,
                )}
              />
              <Text style={styles.compareLabel}>
                {fractionLabel(problem.b)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>{wrongMessage()}</Text>
      )}
    </View>
  );
}
