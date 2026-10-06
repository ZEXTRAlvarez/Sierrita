import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak } from '@sierrita/audio';
import type { GameProps } from '../../../GameScreen';
import { useGameRound } from '../../shared/useGameRound';
import {
  generateProblem,
  timeLabel,
  type Problem,
  type TimeValue,
} from './logic/generateProblem';
import { generateTimeOptions } from './logic/generateTimeOptions';
import { ClockFace } from './components/ClockFace';
import { styles } from './ClockGame.styles';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function ClockGame({
  params,
  onRoundComplete,
  onGameFinish,
  roundCount,
}: GameProps) {
  const minutePool = (params.minutePool as number[]) || [0];

  const [problem, setProblem] = useState<Problem | null>(null);
  const [options, setOptions] = useState<TimeValue[]>([]);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const startRound = useCallback(() => {
    const p = generateProblem(minutePool);
    setProblem(p);
    if (p.mode === 'identify') {
      setOptions(generateTimeOptions(p, minutePool));
      speak('¿Qué hora muestra el reloj?');
    } else {
      setSelectedHour(12);
      setSelectedMinute(0);
      speak(`Mostrá las ${timeLabel(p)}`);
    }
  }, [minutePool]);

  const { result, roundsDone, submitAnswer } = useGameRound({
    roundCount,
    onRoundComplete,
    onGameFinish,
    startRound,
  });

  function handleIdentifyAnswer(opt: TimeValue) {
    if (!problem || problem.mode !== 'identify' || result !== 'idle') return;
    submitAnswer(opt.hour === problem.hour && opt.minute === problem.minute);
  }

  function handleSetConfirm() {
    if (!problem || problem.mode !== 'set' || result !== 'idle') return;
    submitAnswer(
      selectedHour === problem.hour && selectedMinute === problem.minute,
    );
  }

  if (!problem) return null;

  const displayTime: TimeValue =
    problem.mode === 'identify'
      ? problem
      : { hour: selectedHour, minute: selectedMinute };

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {roundsDone + 1} / {roundCount}
      </Text>

      <Text style={styles.prompt}>
        {problem.mode === 'identify'
          ? '¿Qué hora muestra el reloj?'
          : `Mostrá las ${timeLabel(problem)}`}
      </Text>

      <ClockFace hour={displayTime.hour} minute={displayTime.minute} />

      {problem.mode === 'identify' && (
        <View style={styles.optionsRow}>
          {options.map((opt) => {
            const isCorrectOpt =
              opt.hour === problem.hour && opt.minute === problem.minute;
            return (
              <TouchableOpacity
                key={timeLabel(opt)}
                testID="clock-option"
                style={[
                  styles.optionBtn,
                  result !== 'idle' && isCorrectOpt && styles.correctBtn,
                ]}
                onPress={() => handleIdentifyAnswer(opt)}
                disabled={result !== 'idle'}
              >
                <Text style={styles.optionText}>{timeLabel(opt)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {problem.mode === 'set' && (
        <>
          <Text style={styles.sectionLabel}>Hora</Text>
          <View style={styles.chipsRow}>
            {HOURS.map((h) => (
              <TouchableOpacity
                key={h}
                testID="clock-hour-chip"
                style={[styles.chip, selectedHour === h && styles.chipSelected]}
                onPress={() => result === 'idle' && setSelectedHour(h)}
                disabled={result !== 'idle'}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedHour === h && styles.chipTextSelected,
                  ]}
                >
                  {h}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Minutos</Text>
          <View style={styles.chipsRow}>
            {minutePool.map((m) => (
              <TouchableOpacity
                key={m}
                testID="clock-minute-chip"
                style={[
                  styles.chip,
                  selectedMinute === m && styles.chipSelected,
                ]}
                onPress={() => result === 'idle' && setSelectedMinute(m)}
                disabled={result !== 'idle'}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedMinute === m && styles.chipTextSelected,
                  ]}
                >
                  {String(m).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            testID="clock-confirm"
            style={styles.confirmBtn}
            onPress={handleSetConfirm}
            disabled={result !== 'idle'}
          >
            <Text style={styles.confirmText}>¡Listo!</Text>
          </TouchableOpacity>
        </>
      )}

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Correcto! ⭐</Text>
      )}
      {result === 'wrong' && (
        <Text style={[styles.badge, styles.badgeWrong]}>
          ¡Casi! La hora correcta es {timeLabel(problem)}
        </Text>
      )}
    </View>
  );
}
