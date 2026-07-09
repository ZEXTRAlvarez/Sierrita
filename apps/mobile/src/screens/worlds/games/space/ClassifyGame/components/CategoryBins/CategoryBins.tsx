import { Animated, Text, TouchableOpacity, View } from 'react-native';
import type { Item } from '../../logic/generateRound';
import { styles } from './CategoryBins.styles';

export interface CategoryBinsProps {
  categories: { label: string }[];
  bins: Item[][];
  hasSelection: boolean;
  bounceAnim: Animated.Value;
  onPressBin: (binIdx: number) => void;
}

/** The category drop-zones; disabled until an item bank chip is selected. */
export function CategoryBins({
  categories,
  bins,
  hasSelection,
  bounceAnim,
  onPressBin,
}: CategoryBinsProps) {
  return (
    <Animated.View
      style={[styles.binsRow, { transform: [{ scale: bounceAnim }] }]}
    >
      {categories.map((cat, ci) => (
        <TouchableOpacity
          key={ci}
          testID="classify-bin"
          style={[styles.bin, hasSelection && styles.binActive]}
          onPress={() => onPressBin(ci)}
          disabled={!hasSelection}
        >
          <Text style={styles.binLabel}>{cat.label}</Text>
          <View style={styles.binItems}>
            {bins[ci]?.map((item) => (
              <Text key={item.id} style={styles.binItemEmoji}>
                {item.emoji}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}
