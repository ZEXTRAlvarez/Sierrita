import { Button, Text } from 'tamagui';
import { colorTokens } from '../../tokens/colors';
import { radiusTokens } from '../../tokens/radius';
import { spacingTokens } from '../../tokens/spacing';

export type PrimaryButtonColor = 'brand' | 'success' | 'danger' | 'purple';

const COLOR_MAP: Record<PrimaryButtonColor, string> = {
  brand: colorTokens.brand700,
  success: colorTokens.success,
  danger: colorTokens.error,
  purple: '#4A148C',
};

export interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  color?: PrimaryButtonColor;
  disabled?: boolean;
}

/** Replaces the `actionBtn` pattern (3+ near-identical color variants) repeated across screens. */
export function PrimaryButton({ label, onPress, color = 'brand', disabled = false }: PrimaryButtonProps) {
  return (
    <Button
      // Tamagui's `disabled` prop alone doesn't gate the onPress callback in
      // every environment, so guard it explicitly rather than relying on it.
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw hex passthrough, not a Tamagui token
      backgroundColor={COLOR_MAP[color] as any}
      borderRadius={radiusTokens.xl}
      paddingVertical={spacingTokens.md}
      opacity={disabled ? 0.5 : 1}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text color="#fff" fontSize={17} fontWeight="800">
        {label}
      </Text>
    </Button>
  );
}
