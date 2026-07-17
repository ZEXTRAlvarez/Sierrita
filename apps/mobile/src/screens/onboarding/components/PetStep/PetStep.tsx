import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { IconAnimation } from '../../../../components/IconAnimation';
import { PetAnimation } from '../../../../components/PetAnimation';
import type { PetType } from '../../../../store/atoms';
import { PET_OPTIONS } from '../../data/onboardingOptions';
import { styles } from './PetStep.styles';

export interface PetStepProps {
  pet: PetType | null;
  saving: boolean;
  onSelectPet: (pet: PetType) => void;
  onCreate: () => void;
}

export function PetStep({ pet, saving, onSelectPet, onCreate }: PetStepProps) {
  return (
    <>
      <IconAnimation name="paw" size={72} style={{ marginBottom: 12 }} />
      <Text style={styles.title}>¡Elegí tu mascota!</Text>
      <View style={styles.petGrid}>
        {PET_OPTIONS.map((p) => (
          <TouchableOpacity
            key={p.type}
            style={[
              styles.petOption,
              pet === p.type && styles.petOptionSelected,
            ]}
            onPress={() => onSelectPet(p.type)}
            activeOpacity={0.8}
          >
            <PetAnimation petType={p.type} mood="happy" size={56} />
            <Text style={styles.petLabel}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.btn, (!pet || saving) && styles.btnDisabled]}
        onPress={onCreate}
        activeOpacity={0.8}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnText}>¡Empezar!</Text>
        )}
      </TouchableOpacity>
    </>
  );
}
