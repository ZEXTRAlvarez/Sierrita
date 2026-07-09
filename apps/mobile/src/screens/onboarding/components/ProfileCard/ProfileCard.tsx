import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { PetAnimation } from '../../../../components/PetAnimation';
import type { Profile } from '../../../../store/atoms';
import { PET_COLOR } from '../../data/petColors';
import { CARD_H, CARD_W, PET_GLOW_SIZE, PET_SIZE } from '../../data/profileCardMetrics';
import { styles } from './ProfileCard.styles';

export interface ProfileCardProps {
  profile: Profile;
  anim: Animated.Value;
  onSelect: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function ProfileCard({ profile, anim, onSelect, onDelete }: ProfileCardProps) {
  const color = PET_COLOR[profile.avatar] ?? '#4CAF50';

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [
        { scale: anim },
        { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
      ],
    }}>
      <TouchableOpacity
        style={[styles.card, { width: CARD_W, height: CARD_H }]}
        onPress={() => onSelect(profile.id)}
        onLongPress={() => onDelete(profile.id, profile.name)}
        activeOpacity={0.85}
      >
        <View style={[styles.cardStrip, { backgroundColor: color }]} />
        <View style={[styles.petStage, { width: PET_GLOW_SIZE, height: PET_GLOW_SIZE }]}>
          <View style={[
            styles.petGlow,
            { width: PET_GLOW_SIZE, height: PET_GLOW_SIZE, borderRadius: PET_GLOW_SIZE / 2, backgroundColor: color + '26' },
          ]} />
          <PetAnimation petType={profile.avatar} mood="happy" size={PET_SIZE} />
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <View style={[styles.agePill, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[styles.ageText, { color }]}>{profile.age} años</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
