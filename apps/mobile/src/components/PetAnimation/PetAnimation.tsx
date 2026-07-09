import { Text } from 'react-native';
import type { VideoSource } from 'expo-video';
import type { PetType, PetMood } from '../../store/atoms';
import { PET_EMOJI, ANIMATIONS } from './data/petAnimationSources';
import { PetVideo } from './PetVideo';

export interface PetAnimationProps {
  petType: PetType;
  mood: PetMood;
  size?: number;
}

export function PetAnimation({ petType, mood, size = 120 }: PetAnimationProps) {
  const source: VideoSource | undefined = ANIMATIONS[petType]?.[mood];

  if (!source) {
    return <Text style={{ fontSize: size }}>{PET_EMOJI[petType] ?? '🐾'}</Text>;
  }

  // key fuerza un remount (y por lo tanto un nuevo player) cuando cambia la mascota o el ánimo
  return <PetVideo key={`${petType}-${mood}`} source={source} size={size} />;
}
