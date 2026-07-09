import { YStack, Text } from 'tamagui';
import { colorTokens } from '../../tokens/colors';
import { radiusTokens } from '../../tokens/radius';
import { spacingTokens } from '../../tokens/spacing';

export interface StatTileProps {
  value: string | number;
  label: string;
}

/** Replaces the `statBox` pattern used for stat summaries (sessions/minutes/avg. score, etc). */
export function StatTile({ value, label }: StatTileProps) {
  return (
    <YStack
      flex={1}
      backgroundColor={colorTokens.brand50}
      borderRadius={radiusTokens.lg}
      padding={spacingTokens.sm}
      alignItems="center"
    >
      <Text fontSize={28} fontWeight="900" color={colorTokens.brand700}>
        {value}
      </Text>
      <Text
        fontSize={12}
        color={colorTokens.textMuted}
        fontWeight="600"
        marginTop={2}
      >
        {label}
      </Text>
    </YStack>
  );
}
