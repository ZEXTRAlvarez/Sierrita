import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { IconAnimation } from '../../../../components/IconAnimation';
import { WORLD_CARDS } from '../../data/homeContent';
import { styles, IS_TABLET } from './WorldCardsGrid.styles';

export interface WorldCardsGridProps {
  cardEntrance: Animated.Value;
  onPressWorld: () => void;
}

export function WorldCardsGrid({ cardEntrance, onPressWorld }: WorldCardsGridProps) {
  return (
    <View style={[styles.grid, IS_TABLET && styles.gridTablet]}>
      {WORLD_CARDS.map((w, idx) => (
        <Animated.View
          key={w.id}
          style={{
            opacity: cardEntrance,
            transform: [{
              translateY: cardEntrance.interpolate({
                inputRange: [0, 1], outputRange: [60 + idx * 20, 0],
              }),
            }],
          }}
        >
          <TouchableOpacity
            style={[styles.card, { backgroundColor: w.bg }]}
            activeOpacity={0.88}
            onPress={onPressWorld}
          >
            <View style={[styles.cardTop, { backgroundColor: w.dark }]} />
            <IconAnimation name={w.iconName} size={64} />
            <Text style={styles.cardName}>{w.name}</Text>
            <Text style={styles.cardSubject}>{w.subject}</Text>
            <View style={[styles.cardBadge, { backgroundColor: w.accent }]}>
              <Text style={[styles.cardBadgeText, { color: w.dark }]}>{w.games} juegos</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
}
