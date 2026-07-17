import { XStack, Text, Button } from 'tamagui';
import { colorTokens } from '../../tokens/colors';
import { spacingTokens } from '../../tokens/spacing';
import { useAccessibility } from '../../theme/AccessibilityContext';

export interface ScreenHeaderProps {
  title: string;
  onClose?: () => void;
  accentColor?: string;
}

/** Replaces the colored-bar-with-close-button header pattern repeated across screens. */
export function ScreenHeader({
  title,
  onClose,
  accentColor = colorTokens.brand700,
}: ScreenHeaderProps) {
  const { scaledFontSize } = useAccessibility();
  return (
    <XStack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw hex passthrough, not a Tamagui token
      backgroundColor={accentColor as any}
      paddingHorizontal={spacingTokens.lg}
      paddingVertical={spacingTokens.md}
      alignItems="center"
      justifyContent="space-between"
    >
      <Text color="#fff" fontWeight="800" fontSize={scaledFontSize(18)}>
        {title}
      </Text>
      {onClose && (
        <Button
          unstyled
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        >
          <Text color="#fff" fontSize={scaledFontSize(22)} fontWeight="700">
            ✕
          </Text>
        </Button>
      )}
    </XStack>
  );
}
