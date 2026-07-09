import { View } from 'react-native';
import type { OnboardingStep } from '../../hooks/useOnboardingFlow';
import { styles } from './StepDots.styles';

const STEPS: OnboardingStep[] = ['name', 'age', 'pet'];

export interface StepDotsProps {
  step: OnboardingStep;
}

export function StepDots({ step }: StepDotsProps) {
  return (
    <View style={styles.dots}>
      {STEPS.map((s) => (
        <View key={s} testID={`step-dot-${s}`} style={[styles.dot, step === s && styles.dotActive]} />
      ))}
    </View>
  );
}
