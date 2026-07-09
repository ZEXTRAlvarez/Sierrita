import { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import type { RootStackParamList } from '../../navigation';
import { usePet } from '../../hooks/usePet';
import {
  getEvolutionLabel,
  getXpProgress,
  getPetDisplayName,
} from '@sierrita/pet';
import { IconAnimation } from '../../components/IconAnimation';
import { PetRenameModal } from '../../components/PetRenameModal';
import { PET_MOOD_CONFIG } from './data/petMoodConfig';
import { xpToNextStage } from './logic/xpToNextStage';
import { usePetScreenAnimations } from './hooks/usePetScreenAnimations';
import { PetStageDisplay } from './components/PetStageDisplay';
import { PetStatsCard } from './components/PetStatsCard';
import { ActionBtn } from './components/ActionBtn';
import { styles } from './PetScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PetScreen() {
  const navigation = useNavigation<Nav>();
  const { petState, mood, feed, giveWater, play, renamePet } = usePet();
  const { bounceY, actionScale, animateAction } = usePetScreenAnimations();
  const [showRename, setShowRename] = useState(false);

  if (!petState) {
    return (
      <View style={styles.emptyContainer}>
        <IconAnimation name="paw" size={64} />
        <Text style={styles.empty}>
          Creá un perfil para conocer a tu compañero
        </Text>
      </View>
    );
  }

  const moodCfg = PET_MOOD_CONFIG[mood] ?? PET_MOOD_CONFIG.neutral;
  const petName = getPetDisplayName(petState);
  const xpProgress = getXpProgress(petState);
  const nextXp = xpToNextStage(petState.evolutionStage, petState.totalXp);

  return (
    <ImageBackground
      source={require('../../../assets/images/Fondo-detalle.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.15)',
          'rgba(255,255,255,0.55)',
          'rgba(255,255,255,0.85)',
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>{petName}</Text>
          <TouchableOpacity
            onPress={() => setShowRename(true)}
            hitSlop={10}
            style={styles.editNameBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.editNameIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <PetStageDisplay
          petType={petState.petType}
          mood={mood}
          moodCfg={moodCfg}
          bounceY={bounceY}
          actionScale={actionScale}
        />

        <PetStatsCard
          petState={petState}
          stageName={getEvolutionLabel(petState.evolutionStage)}
          xpProgress={xpProgress}
          nextXp={nextXp}
        />

        <View style={styles.actions}>
          <ActionBtn
            icon={<IconAnimation name="apple" size={36} />}
            label="Alimentar"
            onPress={() => animateAction(feed)}
            colors={['#FFAB91', '#FF7043']}
          />
          <ActionBtn
            icon={<IconAnimation name="water" size={32} />}
            label="Dar agua"
            onPress={() => animateAction(giveWater)}
            colors={['#90CAF9', '#42A5F5']}
          />
          <ActionBtn
            icon={<IconAnimation name="play" size={32} />}
            label="Jugar"
            onPress={() => animateAction(play)}
            colors={['#CE93D8', '#AB47BC']}
          />
        </View>

        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => navigation.navigate('PetDetail')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#FFD54F', '#FF8F00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.detailBtnGradient}
          >
            <Text style={styles.detailBtnText}>🎽 Vestidor y evolución</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {showRename && (
        <PetRenameModal
          initialName={petState.petName ?? ''}
          onSave={(name) => {
            renamePet(name);
            setShowRename(false);
          }}
          onCancel={() => setShowRename(false)}
        />
      )}
    </ImageBackground>
  );
}
