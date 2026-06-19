import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView, type VideoSource } from 'expo-video';
import type { PetType, PetMood } from '../store/atoms';

const PET_EMOJI: Record<PetType, string> = {
  dragon: '🐲', bunny: '🐰', dog: '🐶', cat: '🐱', rex: '🦖',
};

// Metro necesita rutas literales en require(), por eso el mapa es estático.
// "neutral" usa el clip "go-play" (¡vamos a jugar!).
const ANIMATIONS: Record<PetType, Record<PetMood, VideoSource>> = {
  dragon: {
    happy:   require('../../assets/animations/Dragon-happy.mp4'),
    neutral: require('../../assets/animations/Dragon-go-play.mp4'),
    hungry:  require('../../assets/animations/Dragon-hungry.mp4'),
    thirsty: require('../../assets/animations/Dragon-thirsty.mp4'),
    sad:     require('../../assets/animations/Dragon-sad.mp4'),
  },
  bunny: {
    happy:   require('../../assets/animations/Bunny-happy.mp4'),
    neutral: require('../../assets/animations/Bunny-go-play.mp4'),
    hungry:  require('../../assets/animations/Bunny-hungry.mp4'),
    thirsty: require('../../assets/animations/Bunny-thirsty.mp4'),
    sad:     require('../../assets/animations/Bunny-sad.mp4'),
  },
  dog: {
    happy:   require('../../assets/animations/Dog-happy.mp4'),
    neutral: require('../../assets/animations/Dog-go-play.mp4'),
    hungry:  require('../../assets/animations/Dog-hungry.mp4'),
    thirsty: require('../../assets/animations/Dog-thirsty.mp4'),
    sad:     require('../../assets/animations/Dog-sad.mp4'),
  },
  cat: {
    happy:   require('../../assets/animations/Cat-happy.mp4'),
    neutral: require('../../assets/animations/Cat-go-play.mp4'),
    hungry:  require('../../assets/animations/Cat-hungry.mp4'),
    thirsty: require('../../assets/animations/Cat-thirsty.mp4'),
    sad:     require('../../assets/animations/Cat-sad.mp4'),
  },
  rex: {
    happy:   require('../../assets/animations/Dino-happy.mp4'),
    neutral: require('../../assets/animations/Dino-go-play.mp4'),
    hungry:  require('../../assets/animations/Dino-hungry.mp4'),
    thirsty: require('../../assets/animations/Dino-thirsty.mp4'),
    sad:     require('../../assets/animations/Dino-sad.mp4'),
  },
};

interface PetAnimationProps {
  petType: PetType;
  mood: PetMood;
  size?: number;
}

export function PetAnimation({ petType, mood, size = 120 }: PetAnimationProps) {
  const source = ANIMATIONS[petType]?.[mood];

  if (!source) {
    return <Text style={{ fontSize: size }}>{PET_EMOJI[petType] ?? '🐾'}</Text>;
  }

  // key fuerza un remount (y por lo tanto un nuevo player) cuando cambia la mascota o el ánimo
  return (
    <PetVideo key={`${petType}-${mood}`} source={source} size={size} />
  );
}

function PetVideo({ source, size }: { source: VideoSource; size: number }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View style={[styles.frame, { width: size, height: size, borderRadius: size / 2 }]}>
      <VideoView
        style={{ width: size, height: size }}
        player={player}
        // "cover" hace zoom para llenar el marco circular y evita las
        // franjas negras que dejaba "contain" con el video 16:9 original.
        contentFit="cover"
        nativeControls={false}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', backgroundColor: 'transparent' },
});
