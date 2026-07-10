import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import type { CasitaProblem, Place } from '../../logic/generateCarryProblem';
import { generateDigitOptions } from '../../logic/generateDigitOptions';
import { styles } from './Casita.styles';

export interface CasitaProps {
  problem: CasitaProblem;
  onAnswer: (correct: boolean) => void;
  result: 'idle' | 'correct' | 'wrong';
}

const REGROUP_REVEAL_DELAY_MS = 700;
const PLACE_LABEL: Record<Place, string> = {
  hundreds: 'C',
  tens: 'D',
  units: 'U',
};

/**
 * The "casita" (house) layout: 2 columns (tens/units) or 3 (hundreds/tens/
 * units), solved right-to-left like the real algorithm. Each column stays
 * locked until the one to its right is answered, so a carry/borrow badge is
 * visible before the child can touch the next column — mirrors how kids are
 * taught to solve it on paper.
 */
export function Casita({ problem, onAnswer, result }: CasitaProps) {
  const { columns } = problem;
  const [chosen, setChosen] = useState<(number | null)[]>(() =>
    columns.map(() => null),
  );
  const [revealedCount, setRevealedCount] = useState(1);
  const [badgeShown, setBadgeShown] = useState<boolean[]>(() =>
    columns.map(() => false),
  );
  const badgeAnims = useRef(columns.map(() => new Animated.Value(0))).current;

  const optionsByColumn = useRef(
    columns.map((c) => generateDigitOptions(c.resultDigit)),
  ).current;

  useEffect(() => {
    const activeIndex = revealedCount - 1;
    const activeValue = chosen[activeIndex];
    if (activeValue === null) return;

    if (revealedCount === columns.length) {
      const correct = chosen.every((v, i) => v === columns[i].resultDigit);
      onAnswer(correct);
      return;
    }

    if (columns[activeIndex].regroups) {
      setBadgeShown((prev) => {
        const next = [...prev];
        next[activeIndex] = true;
        return next;
      });
      Animated.spring(badgeAnims[activeIndex], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(
        () => setRevealedCount((n) => n + 1),
        REGROUP_REVEAL_DELAY_MS,
      );
      return () => clearTimeout(timer);
    }

    setRevealedCount((n) => n + 1);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen]);

  function selectDigit(index: number, value: number) {
    setChosen((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  const opSymbol = problem.op === 'add' ? '+' : '−';
  const displayColumns = columns
    .map((col, index) => ({ col, index }))
    .reverse();
  const halfRoofWidth = columns.length * 55;

  return (
    <View style={styles.houseRow} testID="casita-house">
      <View style={styles.opColumn}>
        {/* Spacers matching colLabel + digit exactly, so the symbol lines up with the b-digit row. */}
        <Text style={[styles.colLabel, { opacity: 0 }]}> </Text>
        <Text style={[styles.digit, { opacity: 0 }]}> </Text>
        <Text style={styles.outerOpSymbol} testID="casita-op-symbol">
          {opSymbol}
        </Text>
      </View>
      <View style={styles.house}>
        <View
          style={[
            styles.roof,
            {
              borderLeftWidth: halfRoofWidth,
              borderRightWidth: halfRoofWidth,
            },
          ]}
        />
        <View style={styles.body}>
          <View style={styles.grid}>
            {displayColumns.map(({ col, index }, displayIndex) => {
              const isRevealed = index < revealedCount;
              // The column immediately to the right (lower index) is solved
              // first; if IT needed to regroup, THIS column is the one that
              // lent (sub) or handed over (add) the 1 — show what changed
              // once this column has actually unlocked.
              const receivedRegroup =
                isRevealed && index > 0 && columns[index - 1].regroups;
              return (
                <View style={{ flexDirection: 'row' }} key={col.place}>
                  {displayIndex > 0 && <View style={styles.divider} />}
                  <View
                    style={styles.column}
                    testID={`casita-column-${col.place}`}
                  >
                    <Text style={styles.colLabel}>
                      {PLACE_LABEL[col.place]}
                    </Text>
                    <View style={styles.aDigitWrap}>
                      <Text
                        style={[
                          styles.digit,
                          receivedRegroup &&
                            problem.op === 'sub' &&
                            styles.struckDigit,
                        ]}
                        testID={`casita-${col.place}-a-digit`}
                      >
                        {col.aDigit}
                      </Text>
                      {receivedRegroup && problem.op === 'sub' && (
                        <View
                          style={styles.strikeLine}
                          testID={`casita-${col.place}-strike-line`}
                        />
                      )}
                      {receivedRegroup && problem.op === 'sub' && (
                        <Text
                          style={styles.borrowCorrection}
                          testID={`casita-${col.place}-borrow-correction`}
                        >
                          {`↗${col.aDigit - 1}`}
                        </Text>
                      )}
                      {receivedRegroup && problem.op === 'add' && (
                        <Text
                          style={styles.carryCorrection}
                          testID={`casita-${col.place}-carry-correction`}
                        >
                          +1
                        </Text>
                      )}
                    </View>
                    <Text
                      style={styles.digit}
                      testID={`casita-${col.place}-b-digit`}
                    >
                      {col.bDigit}
                    </Text>
                    <View style={styles.line} />

                    {isRevealed ? (
                      <View style={styles.answerRow}>
                        {optionsByColumn[index].map((opt) => (
                          <TouchableOpacity
                            key={opt}
                            testID={`casita-${col.place}-option`}
                            style={[
                              styles.digitBtn,
                              chosen[index] === opt && styles.selectedBtn,
                            ]}
                            onPress={() => selectDigit(index, opt)}
                            disabled={
                              result !== 'idle' || chosen[index] !== null
                            }
                          >
                            <Text style={styles.digitBtnText}>{opt}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Text
                        style={styles.lockedHint}
                        testID={`casita-${col.place}-locked`}
                      >
                        🔒
                      </Text>
                    )}

                    {badgeShown[index] && (
                      <Animated.Text
                        testID={`casita-regroup-badge-${col.place}`}
                        style={[
                          styles.regroupBadge,
                          {
                            opacity: badgeAnims[index],
                            transform: [
                              {
                                translateY: badgeAnims[index].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [10, 0],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        {problem.op === 'add'
                          ? 'Me llevo 1 👈'
                          : 'Le pido 1 👈'}
                      </Animated.Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
