import type { ImageStyle, StyleProp } from 'react-native';
import { Image } from 'expo-image';

export type IconAnimationName =
  | 'water'
  | 'play'
  | 'paw'
  | 'mundo'
  | 'mano'
  | 'engranaje'
  | 'selva'
  | 'oceano'
  | 'cohete'
  | 'apple'
  | 'carino';

// WebP animado con canal alfa (fondo verde de chroma quitado con ffmpeg).
const ICONS: Record<IconAnimationName, number> = {
  water: require('../../../assets/animations/Icons-animation/Gota-icon.webp'),
  play: require('../../../assets/animations/Icons-animation/Joystick-icon.webp'),
  paw: require('../../../assets/animations/Icons-animation/Huellas-icon.webp'),
  mundo: require('../../../assets/animations/Icons-animation/Mundo-icon.webp'),
  mano: require('../../../assets/animations/Icons-animation/Mano-icon.webp'),
  engranaje: require('../../../assets/animations/Icons-animation/Engranaje-icon.webp'),
  selva: require('../../../assets/animations/Icons-animation/Selva-icon.webp'),
  oceano: require('../../../assets/animations/Icons-animation/Oceano-icon.webp'),
  cohete: require('../../../assets/animations/Icons-animation/Cohete-icon.webp'),
  apple: require('../../../assets/animations/Icons-animation/Apple-icon.webp'),
  carino: require('../../../assets/animations/Icons-animation/Carino-icon.webp'),
};

export interface IconAnimationProps {
  name: IconAnimationName;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export function IconAnimation({ name, size = 32, style }: IconAnimationProps) {
  return (
    <Image
      source={ICONS[name]}
      style={[{ width: size, height: size }, style]}
      contentFit="contain"
      autoplay
    />
  );
}
