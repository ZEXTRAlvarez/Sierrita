import { ScrollView, View } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAtomValue } from 'jotai';
import type { RootStackParamList } from '../../navigation';
import { activeProfileAtom } from '../../store/atoms';
import { WORLDS } from './data/worldsContent';
import { useWorldsEntrance } from './hooks/useWorldsEntrance';
import { WorldsHeader } from './components/WorldsHeader';
import { WorldSection } from './components/WorldSection';
import { UnlockHintCard } from './components/UnlockHintCard';
import { styles } from './WorldsScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WorldsScreen() {
  const navigation = useNavigation<Nav>();
  const profile = useAtomValue(activeProfileAtom);
  const isFocused = useIsFocused();
  const profileAge = profile?.age ?? 4;
  const entranceAnims = useWorldsEntrance(WORLDS.length, isFocused);

  return (
    <View style={styles.container}>
      <WorldsHeader profileName={profile?.name} profileAge={profileAge} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {WORLDS.map((world, i) => (
          <WorldSection
            key={world.id}
            world={world}
            profileAge={profileAge}
            entrance={entranceAnims[i]}
            onPressGame={(gameId) =>
              navigation.navigate('Game', { worldId: world.id, gameId })
            }
          />
        ))}

        <UnlockHintCard />
      </ScrollView>
    </View>
  );
}
