import { Text, TouchableOpacity, View } from 'react-native';
import type { Item } from '../../logic/generateRound';
import { styles } from './ItemBank.styles';

export interface ItemBankProps {
  items: Item[];
  selectedId: number | null;
  onSelect: (item: Item) => void;
}

/** Bank of not-yet-classified item chips; tap one to select it, tap again to deselect. */
export function ItemBank({ items, selectedId, onSelect }: ItemBankProps) {
  return (
    <View style={styles.itemBank}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          testID="classify-item"
          style={[
            styles.itemChip,
            selectedId === item.id && styles.itemSelected,
          ]}
          onPress={() => onSelect(item)}
        >
          <Text style={styles.itemEmoji}>{item.emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
