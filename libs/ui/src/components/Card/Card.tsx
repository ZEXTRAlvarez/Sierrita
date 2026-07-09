import { styled, YStack } from 'tamagui';
import { colorTokens } from '../../tokens/colors';
import { radiusTokens } from '../../tokens/radius';
import { spacingTokens } from '../../tokens/spacing';

/** Replaces the `sectionStyles.container` card pattern repeated across screens. */
export const Card = styled(YStack, {
  name: 'Card',
  backgroundColor: colorTokens.backgroundCard,
  borderRadius: radiusTokens.xl,
  padding: spacingTokens.lg,
});
