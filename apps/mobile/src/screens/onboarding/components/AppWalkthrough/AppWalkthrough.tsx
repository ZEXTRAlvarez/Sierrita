import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { speak, stopSpeech } from '@sierrita/audio';
import { styles } from './AppWalkthrough.styles';

export interface AppWalkthroughProps {
  onFinish: () => void;
}

interface Step {
  emoji: string;
  title: string;
  caption: string;
  speechText: string;
}

const STEPS: Step[] = [
  {
    emoji: '🏠',
    title: 'Este es tu Inicio',
    caption: 'Acá vas a ver a tu mascota y podés entrar a jugar cuando quieras.',
    speechText: 'Este es tu inicio. Acá vas a ver a tu mascota.',
  },
  {
    emoji: '🗺️',
    title: 'Explorá los Mundos',
    caption: 'Selva, océano y espacio tienen un montón de juegos para aprender.',
    speechText: 'En mundos vas a encontrar un montón de juegos para aprender.',
  },
  {
    emoji: '🐾',
    title: 'Cuidá a tu mascota',
    caption: 'Dale de comer y jugá con ella para verla crecer y evolucionar.',
    speechText: 'Cuidá a tu mascota para verla crecer.',
  },
  {
    emoji: '🔒',
    title: 'Zona de Padres',
    caption:
      'Papá o mamá pueden entrar acá para ver tu progreso y configurar la app.',
    speechText: 'La zona de padres está protegida con un PIN.',
  },
];

/**
 * Short, skippable app-wide tour shown once, right after a new profile is
 * created — before entering the main app for the first time.
 */
export function AppWalkthrough({ onFinish }: AppWalkthroughProps) {
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
    <View style={styles.container} testID="app-walkthrough">
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={onFinish}
        testID="app-walkthrough-skip"
      >
        <Text style={styles.skipText}>Saltar ✕</Text>
      </TouchableOpacity>

      <View style={styles.stepDots}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[styles.stepDot, i === stepIndex && styles.stepDotActive]}
          />
        ))}
      </View>

      <Text style={styles.emoji}>{step.emoji}</Text>

      <View style={styles.speechBubble}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.caption}>{step.caption}</Text>
      </View>

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={handleNext}
        testID="app-walkthrough-next"
      >
        <Text style={styles.nextBtnText}>
          {isLastStep ? '¡Empezar a jugar! 🎮' : 'Siguiente'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
