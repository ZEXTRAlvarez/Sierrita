import type { VideoSource } from 'expo-video';
import type { PetType, PetMood } from '../../../store/atoms';

export const PET_EMOJI: Record<PetType, string> = {
  dragon: '🐲',
  bunny: '🐰',
  dog: '🐶',
  cat: '🐱',
  rex: '🦖',
};

// Metro necesita rutas literales en require(), por eso el mapa es estático.
// "neutral" usa el clip "go-play" (¡vamos a jugar!).
export const ANIMATIONS: Record<PetType, Record<PetMood, VideoSource>> = {
  dragon: {
    happy: require('../../../../assets/animations/Dragon-happy.mp4'),
    neutral: require('../../../../assets/animations/Dragon-go-play.mp4'),
    hungry: require('../../../../assets/animations/Dragon-hungry.mp4'),
    thirsty: require('../../../../assets/animations/Dragon-thirsty.mp4'),
    sad: require('../../../../assets/animations/Dragon-sad.mp4'),
  },
  bunny: {
    happy: require('../../../../assets/animations/Bunny-happy.mp4'),
    neutral: require('../../../../assets/animations/Bunny-go-play.mp4'),
    hungry: require('../../../../assets/animations/Bunny-hungry.mp4'),
    thirsty: require('../../../../assets/animations/Bunny-thirsty.mp4'),
    sad: require('../../../../assets/animations/Bunny-sad.mp4'),
  },
  dog: {
    happy: require('../../../../assets/animations/Dog-happy.mp4'),
    neutral: require('../../../../assets/animations/Dog-go-play.mp4'),
    hungry: require('../../../../assets/animations/Dog-hungry.mp4'),
    thirsty: require('../../../../assets/animations/Dog-thirsty.mp4'),
    sad: require('../../../../assets/animations/Dog-sad.mp4'),
  },
  cat: {
    happy: require('../../../../assets/animations/Cat-happy.mp4'),
    neutral: require('../../../../assets/animations/Cat-go-play.mp4'),
    hungry: require('../../../../assets/animations/Cat-hungry.mp4'),
    thirsty: require('../../../../assets/animations/Cat-thirsty.mp4'),
    sad: require('../../../../assets/animations/Cat-sad.mp4'),
  },
  rex: {
    happy: require('../../../../assets/animations/Dino-happy.mp4'),
    neutral: require('../../../../assets/animations/Dino-go-play.mp4'),
    hungry: require('../../../../assets/animations/Dino-hungry.mp4'),
    thirsty: require('../../../../assets/animations/Dino-thirsty.mp4'),
    sad: require('../../../../assets/animations/Dino-sad.mp4'),
  },
};
