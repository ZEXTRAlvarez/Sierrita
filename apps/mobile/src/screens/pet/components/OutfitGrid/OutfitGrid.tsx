import { View, Text, TouchableOpacity } from 'react-native';
import { OUTFITS } from '../../data/outfits';
import { styles } from './OutfitGrid.styles';

export interface OutfitGridProps {
  totalXp: number;
  selectedOutfit: string;
  onSelect: (outfitId: string) => void;
}

export function OutfitGrid({ totalXp, selectedOutfit, onSelect }: OutfitGridProps) {
  return (
    <View style={styles.container}>
      {OUTFITS.map((outfit) => {
        const unlocked = totalXp >= outfit.xpRequired;
        const active = selectedOutfit === outfit.id;
        return (
          <TouchableOpacity
            key={outfit.id}
            style={[
              styles.card,
              active && { borderColor: outfit.color, borderWidth: 3, backgroundColor: outfit.color + '18' },
              !unlocked && styles.locked,
            ]}
            onPress={() => unlocked && onSelect(outfit.id)}
            activeOpacity={unlocked ? 0.8 : 1}
          >
            <Text style={[styles.emoji, !unlocked && { opacity: 0.35 }]}>{outfit.emoji}</Text>
            <Text style={[styles.name, !unlocked && { color: '#CCC' }]}>{outfit.name}</Text>
            {!unlocked && (
              <View style={styles.lockBadge}>
                <Text style={styles.lockText}>🔒 {outfit.xpRequired} XP</Text>
              </View>
            )}
            {active && (
              <View style={[styles.activeBadge, { backgroundColor: outfit.color }]}>
                <Text style={styles.activeBadgeText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
