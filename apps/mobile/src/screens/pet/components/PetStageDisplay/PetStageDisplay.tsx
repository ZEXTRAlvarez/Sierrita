import { Animated, Text, View } from 'react-native';
import { PetAnimation } from '../../../../components/PetAnimation';
import type { PetMood, PetType } from '@sierrita/pet';
import type { PetMoodConfig } from '../../data/petMoodConfig';
import { styles } from './PetStageDisplay.styles';

export interface PetStageDisplayProps {
  petType: PetType;
  mood: PetMood;
  moodCfg: PetMoodConfig;
  bounceY: Animated.Value;
  actionScale: Animated.Value;
}

export function PetStageDisplay({ petType, mood, moodCfg, bounceY, actionScale }: PetStageDisplayProps) {
  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.center, { transform: [{ scale: actionScale }] }]}>
        <View style={[styles.glow, { backgroundColor: moodCfg.glow }]} />
        <Animated.View style={{ transform: [{ translateY: bounceY }] }}>
          <PetAnimation petType={petType} mood={mood} size={150} />
        </Animated.View>
      </Animated.View>

      <View style={styles.moodPill}>
        <Text style={styles.moodPillText}>{moodCfg.text}</Text>
      </View>
    </View>
  );
}
