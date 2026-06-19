import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import type { PetType } from '../../store/atoms';
import { useProfiles } from '../../hooks/useProfiles';
import { IconAnimation } from '../../components/IconAnimation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const PET_OPTIONS: { type: PetType; emoji: string; label: string }[] = [
  { type: 'dragon', emoji: '🐲', label: 'Dragoncito' },
  { type: 'bunny',  emoji: '🐰', label: 'Conejita' },
  { type: 'dog',    emoji: '🐶', label: 'Perrito' },
  { type: 'cat',    emoji: '🐱', label: 'Gatito' },
  { type: 'rex',    emoji: '🦖', label: 'Rex' },
];

const AGE_OPTIONS = [4, 5, 6] as const;

type Step = 'name' | 'age' | 'pet';

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();
  const { addProfile, selectProfile } = useProfiles();

  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [age, setAge] = useState<4 | 5 | 6 | null>(null);
  const [pet, setPet] = useState<PetType | null>(null);
  const [saving, setSaving] = useState(false);

  const cardScale = useRef(new Animated.Value(1)).current;

  function goNext(nextStep: Step) {
    Animated.sequence([
      Animated.timing(cardScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, friction: 6, useNativeDriver: true }),
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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>

        {step === 'name' && (
          <>
            <Text style={styles.emoji}>👋</Text>
            <Text style={styles.title}>¡Hola! ¿Cómo te llamás?</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre..."
              placeholderTextColor="#AAA"
              value={name}
              onChangeText={setName}
              autoFocus
              maxLength={20}
              returnKeyType="next"
              onSubmitEditing={() => name.trim() && goNext('age')}
            />
            <TouchableOpacity
              style={[styles.btn, !name.trim() && styles.btnDisabled]}
              onPress={() => name.trim() && goNext('age')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>¡Siguiente!</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'age' && (
          <>
            <Text style={styles.emoji}>🎂</Text>
            <Text style={styles.title}>¿Cuántos años tenés?</Text>
            <View style={styles.ageRow}>
              {AGE_OPTIONS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.agePill, age === a && styles.agePillSelected]}
                  onPress={() => setAge(a)}
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
              onPress={() => age && goNext('pet')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>¡Siguiente!</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'pet' && (
          <>
            <IconAnimation name="paw" size={72} style={{ marginBottom: 12 }} />
            <Text style={styles.title}>¡Elegí tu mascota!</Text>
            <View style={styles.petGrid}>
              {PET_OPTIONS.map((p) => (
                <TouchableOpacity
                  key={p.type}
                  style={[styles.petOption, pet === p.type && styles.petOptionSelected]}
                  onPress={() => setPet(p.type)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.petEmoji}>{p.emoji}</Text>
                  <Text style={styles.petLabel}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.btn, (!pet || saving) && styles.btnDisabled]}
              onPress={handleCreate}
              activeOpacity={0.8}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#FFF" />
                : <Text style={styles.btnText}>¡Empezar!</Text>
              }
            </TouchableOpacity>
          </>
        )}

      </Animated.View>

      <View style={styles.dots}>
        {(['name', 'age', 'pet'] as Step[]).map((s) => (
          <View key={s} style={[styles.dot, step === s && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#FFF9C4',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 32, padding: 32,
    alignItems: 'center', width: '100%', elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 4 },
  },
  emoji: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: 28 },
  input: {
    width: '100%', borderWidth: 3, borderColor: '#4CAF50', borderRadius: 16,
    padding: 16, fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 24, color: '#222',
  },
  btn: {
    backgroundColor: '#4CAF50', borderRadius: 20,
    paddingHorizontal: 40, paddingVertical: 16, minWidth: 160, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#BDBDBD' },
  btnText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  ageRow: { flexDirection: 'row', gap: 16, marginBottom: 28 },
  agePill: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 3, borderColor: '#4CAF50', justifyContent: 'center', alignItems: 'center',
  },
  agePillSelected: { backgroundColor: '#4CAF50' },
  ageText: { fontSize: 32, fontWeight: '800', color: '#4CAF50' },
  ageTextSelected: { color: '#FFF' },
  petGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 24 },
  petOption: {
    width: 100, height: 110, borderRadius: 20,
    borderWidth: 3, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center',
  },
  petOptionSelected: { borderColor: '#FF7043', backgroundColor: '#FFF3E0' },
  petEmoji: { fontSize: 40 },
  petLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginTop: 4 },
  dots: { flexDirection: 'row', gap: 10, marginTop: 24 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#DDD' },
  dotActive: { backgroundColor: '#4CAF50', width: 24 },
});
