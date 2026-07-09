import { Button, Text } from 'tamagui';
import { colorTokens } from '../../tokens/colors';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/** Replaces the `timeChip` selected/unselected pattern (session-time picker, etc). */
export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Button
      onPress={onPress}
      backgroundColor={selected ? colorTokens.brand700 : colorTokens.brand50}
      borderColor={selected ? colorTokens.brand700 : colorTokens.border}
      borderWidth={2}
      borderRadius={999}
      paddingHorizontal={14}
      paddingVertical={8}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text fontSize={14} fontWeight="700" color={selected ? '#fff' : colorTokens.brand700}>
        {label}
      </Text>
    </Button>
  );
}
