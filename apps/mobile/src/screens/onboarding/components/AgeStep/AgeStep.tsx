import { Text, TouchableOpacity, View } from 'react-native';
import { AGE_OPTIONS } from '../../data/onboardingOptions';
import { styles } from './AgeStep.styles';

export interface AgeStepProps {
  age: 4 | 5 | 6 | null;
  onSelectAge: (age: 4 | 5 | 6) => void;
  onNext: () => void;
}

export function AgeStep({ age, onSelectAge, onNext }: AgeStepProps) {
  return (
    <>
      <Text style={styles.emoji}>🎂</Text>
      <Text style={styles.title}>¿Cuántos años tenés?</Text>
      <View style={styles.ageRow}>
        {AGE_OPTIONS.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.agePill, age === a && styles.agePillSelected]}
            onPress={() => onSelectAge(a)}
            activeOpacity={0.8}
          >
            <Text style={[styles.ageText, age === a && styles.ageTextSelected]}>
              {a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.btn, !age && styles.btnDisabled]}
        onPress={() => age && onNext()}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>¡Siguiente!</Text>
      </TouchableOpacity>
    </>
  );
}
