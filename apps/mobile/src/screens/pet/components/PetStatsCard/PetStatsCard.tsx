import { Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { IconAnimation } from '../../../../components/IconAnimation';
import type { PetState } from '@sierrita/pet';
import { PetNeedBar } from '../PetNeedBar';
import { styles } from './PetStatsCard.styles';

export interface PetStatsCardProps {
  petState: PetState;
  stageName: string;
  xpProgress: number;
  nextXp: number;
}

export function PetStatsCard({ petState, stageName, xpProgress, nextXp }: PetStatsCardProps) {
  return (
    <BlurView intensity={50} tint="light" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.stage}>{stageName}</Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpBadgeText}>⭐ {petState.totalXp} XP</Text>
        </View>
      </View>

      {petState.evolutionStage < 3 && (
        <View style={styles.xpBarRow}>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${Math.round(xpProgress * 100)}%` as any }]} />
          </View>
          <Text style={styles.xpBarLabel}>Faltan {nextXp} XP para crecer</Text>
        </View>
      )}

      <View style={styles.needsGrid}>
        <PetNeedBar icon={<IconAnimation name="apple" size={18} />} label="Hambre" value={petState.hunger} color="#FF7043" />
        <PetNeedBar icon={<IconAnimation name="water" size={18} />} label="Sed" value={petState.thirst} color="#42A5F5" />
        <PetNeedBar icon={<IconAnimation name="carino" size={18} />} label="Cariño" value={petState.happiness} color="#FFCA28" />
      </View>
    </BlurView>
  );
}
