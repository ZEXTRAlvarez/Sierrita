import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation';
import type { PetType } from '../../../store/atoms';
import { useProfiles } from '../../../hooks/useProfiles';
import { getParentConfig, upsertParentConfig } from '@sierrita/storage';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export type OnboardingStep = 'name' | 'age' | 'pet' | 'walkthrough';

/** Wizard state (name/age/pet + step) plus the card "pop" transition and profile creation. */
export function useOnboardingFlow() {
  const navigation = useNavigation<Nav>();
  const { addProfile, selectProfile } = useProfiles();

  const [step, setStep] = useState<OnboardingStep>('name');
  const [name, setName] = useState('');
  const [age, setAge] = useState<4 | 5 | 6 | null>(null);
  const [pet, setPet] = useState<PetType | null>(null);
  const [saving, setSaving] = useState(false);
  const [newProfileId, setNewProfileId] = useState<string | null>(null);

  const cardScale = useRef(new Animated.Value(1)).current;
  // Synchronous guard: `saving` state only reflects in the next render, so a
  // fast double-tap can slip a second handleCreate() through before then.
  const savingRef = useRef(false);

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
    if (!name.trim() || !age || !pet || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const profile = await addProfile(name.trim(), age, pet);
      selectProfile(profile.id);
      setNewProfileId(profile.id);
      setStep('walkthrough');
    } catch (e) {
      console.error('Error creating profile', e);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  async function finishWalkthrough() {
    if (newProfileId) {
      const config = await getParentConfig(newProfileId);
      if (config) {
        await upsertParentConfig({
          ...config,
          hasSeenWalkthrough: true,
          updatedAt: Date.now(),
        });
      }
    }
    // Ver comentario en useProfileSelection.handleSelect: 'Main' no existe
    // todavía en el Stack en este mismo tick.
    setTimeout(() => navigation.replace('Main'), 0);
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
    finishWalkthrough,
  };
}
