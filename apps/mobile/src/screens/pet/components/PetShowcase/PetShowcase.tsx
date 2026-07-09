import { View, Text, TouchableOpacity } from 'react-native';
import { PetAnimation } from '../../../../components/PetAnimation';
import type { PetState, PetMood } from '@sierrita/pet';
import type { OutfitDef } from '../../data/outfits';
import { styles } from './PetShowcase.styles';

export interface PetShowcaseProps {
  petState: PetState;
  mood: PetMood;
  petName: string;
  stageName: string;
  petColor: string;
  currentOutfit: OutfitDef;
  xpProgress: number;
  onRename: () => void;
}

export function PetShowcase({
  petState,
  mood,
  petName,
  stageName,
  petColor,
  currentOutfit,
  xpProgress,
  onRename,
}: PetShowcaseProps) {
  return (
    <View style={[styles.card, { borderColor: petColor + '44' }]}>
      <View style={[styles.bg, { backgroundColor: petColor + '18' }]}>
        <PetAnimation petType={petState.petType} mood={mood} size={96} />
        {currentOutfit.id !== 'none' && (
          <Text style={styles.outfitBadge}>{currentOutfit.emoji}</Text>
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{petName}</Text>
          <TouchableOpacity
            onPress={onRename}
            hitSlop={10}
            style={styles.editBtn}
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.stage}>{stageName}</Text>

        {petState.evolutionStage < 3 ? (
          <View style={styles.xpSection}>
            <View style={styles.xpLabelRow}>
              <Text style={styles.xpLabel}>Progreso de evolución</Text>
              <Text style={[styles.xpPct, { color: petColor }]}>
                {Math.round(xpProgress * 100)}%
              </Text>
            </View>
            <View style={styles.xpTrack}>
              <View
                style={[
                  styles.xpFill,
                  {
                    width: `${Math.round(xpProgress * 100)}%`,
                    backgroundColor: petColor,
                  },
                ]}
              />
            </View>
          </View>
        ) : (
          <View style={[styles.maxBadge, { backgroundColor: petColor }]}>
            <Text style={styles.maxBadgeText}>¡Evolución máxima!</Text>
          </View>
        )}
      </View>
    </View>
  );
}
