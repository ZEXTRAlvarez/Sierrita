import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak, stopSpeech } from '@sierrita/audio';
import { styles } from './CasitaIntro.styles';
import { styles as casitaStyles } from '../Casita/Casita.styles';

export interface CasitaIntroProps {
  onFinish: () => void;
}

interface Step {
  title: string;
  caption: string;
  speechText: string;
  unitsFilled: boolean;
  tensFilled: boolean;
  showCarryBadge: boolean;
  showPalitos: boolean;
}

// Fixed, curated example (forces a carry) so every child sees the same
// worked demonstration, regardless of the real round's difficulty/operands.
const DEMO = { aTens: 2, aUnits: 5, bTens: 1, bUnits: 7 };

const STEPS: Step[] = [
  {
    title: '¡Bienvenido a la casita! 🏠',
    caption:
      'Acá vamos a sumar separando las decenas de las unidades, como los grandes.',
    speechText:
      'Bienvenido a la casita. Acá vamos a sumar separando las decenas de las unidades.',
    unitsFilled: false,
    tensFilled: false,
    showCarryBadge: false,
    showPalitos: false,
  },
  {
    title: 'Primero, las unidades 👉',
    caption:
      '5 + 7 = 12. Pero en un cuadradito solo entra un dígito: anotamos el 2.',
    speechText:
      'Primero resolvemos las unidades. 5 más 7 es 12. Como no entra, anotamos el 2.',
    unitsFilled: true,
    tensFilled: false,
    showCarryBadge: false,
    showPalitos: false,
  },
  {
    title: '¡Nos llevamos 1! ➡️',
    caption: 'Nos llevamos 1 de regalo para las decenas: 2 + 1 + 1 = 4.',
    speechText:
      'Y nos llevamos 1 de regalo para las decenas. 2 más 1 más el que nos llevamos, es 4.',
    unitsFilled: true,
    tensFilled: true,
    showCarryBadge: true,
    showPalitos: false,
  },
  {
    title: '¿Te cuesta contar? 🤏',
    caption:
      'Podés arrastrar estos palitos para ayudarte a contar. ¡Nunca es obligatorio!',
    speechText:
      'Si te cuesta contar, podés arrastrar los palitos de abajo para ayudarte. Nunca es obligatorio.',
    unitsFilled: true,
    tensFilled: true,
    showCarryBadge: true,
    showPalitos: true,
  },
];

/**
 * A short, tap-paced walkthrough shown once before the first real round:
 * worked example of a carry, then a mention of the optional stick-counting
 * aid. Ends with a button that starts the actual game.
 */
export function CasitaIntro({ onFinish }: CasitaIntroProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  useEffect(() => {
    speak(step.speechText);
  }, [step.speechText]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  function handleNext() {
    if (isLastStep) {
      onFinish();
      return;
    }
    setStepIndex((i) => i + 1);
  }

  return (
    <View style={styles.container} testID="casita-intro">
      <View style={styles.stepDots}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[styles.stepDot, i === stepIndex && styles.stepDotActive]}
          />
        ))}
      </View>

      <View style={styles.speechBubble}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.caption}>{step.caption}</Text>
      </View>

      <View style={styles.demoArea}>
        <View style={casitaStyles.houseRow}>
          <View style={casitaStyles.opColumn}>
            <Text style={[casitaStyles.colLabel, { opacity: 0 }]}> </Text>
            <Text style={[casitaStyles.digit, { opacity: 0 }]}> </Text>
            <Text style={casitaStyles.outerOpSymbol}>+</Text>
          </View>
          <View style={casitaStyles.house}>
            <View
              style={[
                casitaStyles.roof,
                { borderLeftWidth: 110, borderRightWidth: 110 },
              ]}
            />
            <View style={casitaStyles.body}>
              <View style={casitaStyles.grid}>
                {/* Tens on the left, units on the right — always, matching the real casita. */}
                <View style={casitaStyles.column} testID="casita-intro-tens">
                  <Text style={casitaStyles.colLabel}>D</Text>
                  <Text style={casitaStyles.digit}>{DEMO.aTens}</Text>
                  <Text style={casitaStyles.digit}>{DEMO.bTens}</Text>
                  <View style={casitaStyles.line} />
                  <Text style={styles.demoHint}>
                    {step.tensFilled ? '4' : '?'}
                  </Text>
                  {step.showCarryBadge && (
                    <Text style={styles.filledBadge}>Me llevo 1 👈</Text>
                  )}
                </View>
                <View style={casitaStyles.divider} />
                <View style={casitaStyles.column} testID="casita-intro-units">
                  <Text style={casitaStyles.colLabel}>U</Text>
                  <Text style={casitaStyles.digit}>{DEMO.aUnits}</Text>
                  <Text style={casitaStyles.digit}>{DEMO.bUnits}</Text>
                  <View style={casitaStyles.line} />
                  <Text style={styles.demoHint}>
                    {step.unitsFilled ? '2' : '?'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {step.showPalitos && (
        <View style={styles.palitosPreview} testID="casita-intro-palitos">
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.palitoPreview} />
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={handleNext}
        testID="casita-intro-next"
      >
        <Text style={styles.nextBtnText}>
          {isLastStep ? '¡A jugar! 🎮' : 'Siguiente'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
