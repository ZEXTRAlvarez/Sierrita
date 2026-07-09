import { Dimensions } from 'react-native';

const { width: W } = Dimensions.get('window');
const IS_TABLET = W >= 600;

export const CARD_W = IS_TABLET ? 180 : 148;
export const CARD_H = IS_TABLET ? 200 : 172;
export const PET_SIZE = CARD_W * 0.62;
export const PET_GLOW_SIZE = PET_SIZE + 16;
