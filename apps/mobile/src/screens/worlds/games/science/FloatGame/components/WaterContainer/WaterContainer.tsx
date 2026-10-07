import { Animated, View } from 'react-native';
import { styles } from './WaterContainer.styles';

export interface WaterContainerProps {
  emoji: string;
  translateY: Animated.Value;
}

/** A simple water container: the object sits above it and animates down via `translateY` once a prediction is made. */
export function WaterContainer({ emoji, translateY }: WaterContainerProps) {
  return (
    <View style={styles.container} testID="water-container">
      <Animated.Text
        testID="water-item"
        style={[styles.item, { transform: [{ translateY }] }]}
      >
        {emoji}
      </Animated.Text>
      <View style={styles.water} />
    </View>
  );
}
