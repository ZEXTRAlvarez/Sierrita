import { YStack, Text } from 'tamagui';
import { colorTokens } from '../../tokens/colors';
import { radiusTokens } from '../../tokens/radius';
import { spacingTokens } from '../../tokens/spacing';
import { useAccessibility } from '../../theme/AccessibilityContext';

export interface StatTileProps {
  value: string | number;
  label: string;
}

/** Replaces the `statBox` pattern used for stat summaries (sessions/minutes/avg. score, etc). */
export function StatTile({ value, label }: StatTileProps) {
  const { scaledFontSize, colors } = useAccessibility();
  return (
    <YStack
      flex={1}
      backgroundColor={colorTokens.brand50}
      borderRadius={radiusTokens.lg}
      padding={spacingTokens.sm}
      alignItems="center"
    >
      <Text
        fontSize={scaledFontSize(28)}
        fontWeight="900"
        color={colorTokens.brand700}
      >
        {value}
      </Text>
      <Text
        fontSize={scaledFontSize(12)}
        color={colors.textMuted}
        fontWeight="600"
        marginTop={2}
      >
        {label}
      </Text>
    </YStack>
  );
}
