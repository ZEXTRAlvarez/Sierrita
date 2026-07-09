import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation';
import type { PetType } from '../../../store/atoms';
import { useProfiles } from '../../../hooks/useProfiles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export type OnboardingStep = 'name' | 'age' | 'pet';

/** Wizard state (name/age/pet + step) plus the card "pop" transition and profile creation. */
export function useOnboardingFlow() {
  const navigation = useNavigation<Nav>();
  const { addProfile, selectProfile } = useProfiles();

  const [step, setStep] = useState<OnboardingStep>('name');
  const [name, setName] = useState('');
  const [age, setAge] = useState<4 | 5 | 6 | null>(null);
  const [pet, setPet] = useState<PetType | null>(null);
  const [saving, setSaving] = useState(false);

  const cardScale = useRef(new Animated.Value(1)).current;

  function goNext(nextStep: OnboardingStep) {
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
    setStep(nextStep);
  }

  async function handleCreate() {
    if (!name.trim() || !age || !pet || saving) return;
    setSaving(true);
    try {
      const profile = await addProfile(name.trim(), age, pet);
      selectProfile(profile.id);
      navigation.replace('Main');
    } catch (e) {
      console.error('Error creating profile', e);
    } finally {
      setSaving(false);
    }
  }

  return {
    step,
    name,
    setName,
    age,
    setAge,
    pet,
    setPet,
    saving,
    cardScale,
    goNext,
    handleCreate,
  };
}
