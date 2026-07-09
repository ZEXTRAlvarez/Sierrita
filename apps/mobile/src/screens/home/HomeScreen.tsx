import { ScrollView, Text, View } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAtomValue } from 'jotai';
import { activeProfileAtom, petStateAtom, petMoodAtom } from '../../store/atoms';
import { getEvolutionLabel, getXpProgress } from '@sierrita/pet';
import type { RootStackParamList } from '../../navigation';
import { useHomeAnimations } from './hooks/useHomeAnimations';
import { MOOD_BUBBLE, dailyTip } from './data/homeContent';
import { HomeHeader } from './components/HomeHeader';
import { PetCard } from './components/PetCard';
import { WorldCardsGrid } from './components/WorldCardsGrid';
import { DailyTipCard } from './components/DailyTipCard';
import { styles } from './HomeScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useAtomValue(activeProfileAtom);
  const pet = useAtomValue(petStateAtom);
  const mood = useAtomValue(petMoodAtom);
  const isFocused = useIsFocused();
  const { petBounce, cardEntrance, cardTranslate } = useHomeAnimations(isFocused);

  const moodCfg = MOOD_BUBBLE[mood] ?? MOOD_BUBBLE.neutral;
  const xpProgress = pet ? getXpProgress(pet) : 0;
  const stageName = pet ? getEvolutionLabel(pet.evolutionStage) : '';
  const petType = pet?.petType ?? profile?.avatar ?? 'dragon';

  return (
    <View style={styles.container}>
      <HomeHeader profileName={profile?.name} onOpenParents={() => navigation.navigate('Parents')} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PetCard
          pet={pet}
          petType={petType}
          mood={mood}
          moodCfg={moodCfg}
          stageName={stageName}
          xpProgress={xpProgress}
          petBounce={petBounce}
          entranceStyle={{ opacity: cardEntrance, transform: [{ translateY: cardTranslate }] }}
        />

        <Text style={styles.sectionTitle}>¡Elegí tu aventura!</Text>
        {/* 'Worlds' lives in the nested MainTabParamList, not RootStackParamList — not
            representable in the outer stack's typed navigate() without deeper nested typing. */}
        <WorldCardsGrid cardEntrance={cardEntrance} onPressWorld={() => (navigation as any).navigate('Worlds')} />

        <DailyTipCard tip={dailyTip()} />
      </ScrollView>
    </View>
  );
}
