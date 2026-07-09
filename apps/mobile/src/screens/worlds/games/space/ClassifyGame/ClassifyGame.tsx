import { ScrollView, Text } from 'react-native';
import type { GameProps } from '../../../GameScreen';
import { useClassifyGameState } from './hooks/useClassifyGameState';
import { ItemBank } from './components/ItemBank';
import { CategoryBins } from './components/CategoryBins';
import { styles } from './ClassifyGame.styles';

export default function ClassifyGame({ params, onRoundComplete, onGameFinish, roundCount }: GameProps) {
  const categories = (params.categories as number) || 2;
  const attribute = (params.attribute as string) || 'color';
  const itemCount = (params.itemCount as number) || 6;

  const {
    round, bins, pending, selected, result, roundsDone, bounceAnim,
    handleItemPress, handleBinPress,
  } = useClassifyGameState({ categories, attribute, itemCount, onRoundComplete, onGameFinish, roundCount });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.progress}>{roundsDone + 1} / {roundCount}</Text>
      <Text style={styles.instruction}>Clasificá los objetos ↓</Text>

      <ItemBank items={pending} selectedId={selected?.id ?? null} onSelect={handleItemPress} />

      <CategoryBins
        categories={round.categories}
        bins={bins}
        hasSelection={!!selected}
        bounceAnim={bounceAnim}
        onPressBin={handleBinPress}
      />

      {result === 'correct' && (
        <Text style={[styles.badge, styles.badgeCorrect]}>¡Clasificaste todo! ⭐</Text>
      )}

      {selected && (
        <Text style={styles.hint}>Tocá un grupo para poner {selected.emoji} allí</Text>
      )}
    </ScrollView>
  );
}
