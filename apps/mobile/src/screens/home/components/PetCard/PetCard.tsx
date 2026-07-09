import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PetAnimation } from '../../../../components/PetAnimation';
import type { PetState, PetMood, PetType } from '@sierrita/pet';
import { NeedDot } from '../NeedDot';
import type { MoodBubbleContent } from '../../data/homeContent';
import { styles } from './PetCard.styles';

export interface PetCardProps {
  pet: PetState | null;
  petType: PetType;
  mood: PetMood;
  moodCfg: MoodBubbleContent;
  stageName: string;
  xpProgress: number;
  petBounce: Animated.Value;
  entranceStyle: { opacity: Animated.Value; transform: { translateY: Animated.AnimatedInterpolation<number> }[] };
}

export function PetCard({ pet, petType, mood, moodCfg, stageName, xpProgress, petBounce, entranceStyle }: PetCardProps) {
  return (
    <Animated.View style={[styles.wrap, entranceStyle]}>
      <ImageBackground
        source={require('../../../../../assets/images/Fondo-detalle.png')}
        style={styles.card}
        imageStyle={styles.cardImage}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.92)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View style={[styles.left, { transform: [{ translateY: petBounce }] }]}>
          <View style={[styles.glow, { backgroundColor: moodCfg.accent + '33' }]} />
          <PetAnimation petType={petType} mood={mood} size={88} />
        </Animated.View>

        <View style={styles.right}>
          <View style={[styles.moodBubble, { borderLeftColor: moodCfg.accent }]}>
            <Text style={styles.moodText}>{moodCfg.text}</Text>
          </View>

          {pet && (
            <View style={styles.needsRow}>
              <NeedDot value={pet.hunger} color="#FF7043" />
              <NeedDot value={pet.thirst} color="#2196F3" />
              <NeedDot value={pet.happiness} color="#FFC107" />
            </View>
          )}

          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>{stageName}</Text>
            <View style={styles.xpTrack}>
              <Animated.View style={[styles.xpFill, { width: `${Math.round(xpProgress * 100)}%` as any }]} />
            </View>
          </View>

          <Text style={styles.xpAmount}>⭐ {pet?.totalXp ?? 0} XP</Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}
