import { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAtomValue } from 'jotai';
import { petMoodAtom } from '../../store/atoms';
import { getEvolutionLabel, getXpProgress, getPetDisplayName } from '@sierrita/pet';
import { PetRenameModal } from '../../components/PetRenameModal';
import { PET_COLOR } from './data/outfits';
import { usePetDetailState } from './hooks/usePetDetailState';
import { PetDetailHeader } from './components/PetDetailHeader';
import { PetShowcase } from './components/PetShowcase';
import { NeedBar } from './components/NeedBar';
import { OutfitGrid } from './components/OutfitGrid';
import { EvolutionTimeline } from './components/EvolutionTimeline';
import { SectionCard } from './components/SectionCard';
import { IconAnimation } from '../../components/IconAnimation';
import { styles } from './PetDetailScreen.styles';

export default function PetDetailScreen() {
  const navigation = useNavigation();
  const mood = useAtomValue(petMoodAtom);
  const { petState, selectedOutfit, currentOutfit, showRename, setShowRename, applyOutfit, applyName } =
    usePetDetailState();
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(contentAnim, { toValue: 1, damping: 14, stiffness: 90, useNativeDriver: true }).start();
  }, [contentAnim]);

  if (!petState) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Creá un perfil para ver tu mascota</Text>
      </View>
    );
  }

  const petColor = PET_COLOR[petState.petType] ?? '#FF6F00';
  const petName = getPetDisplayName(petState);
  const stageName = getEvolutionLabel(petState.evolutionStage);

  return (
    <View style={styles.container}>
      <PetDetailHeader
        petColor={petColor}
        petName={petName}
        stageName={stageName}
        totalXp={petState.totalXp}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: contentAnim,
            transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
          }}
        >
          <PetShowcase
            petState={petState}
            mood={mood}
            petName={petName}
            stageName={stageName}
            petColor={petColor}
            currentOutfit={currentOutfit}
            xpProgress={getXpProgress(petState)}
            onRename={() => setShowRename(true)}
          />

          <SectionCard title="Estado actual">
            <NeedBar icon={<IconAnimation name="apple" size={18} />} label="Hambre" value={petState.hunger} color="#FF7043" />
            <NeedBar icon={<IconAnimation name="water" size={18} />} label="Sed" value={petState.thirst} color="#2196F3" />
            <NeedBar icon={<IconAnimation name="carino" size={18} />} label="Feliz" value={petState.happiness} color="#FFC107" />
          </SectionCard>

          <SectionCard title="Outfits" subtitle="Ganás outfits acumulando XP">
            <OutfitGrid totalXp={petState.totalXp} selectedOutfit={selectedOutfit} onSelect={applyOutfit} />
          </SectionCard>

          <SectionCard title="Etapas de evolución">
            <EvolutionTimeline totalXp={petState.totalXp} currentStage={petState.evolutionStage} />
          </SectionCard>
        </Animated.View>
      </ScrollView>

      {showRename && (
        <PetRenameModal initialName={petState.petName ?? ''} onSave={applyName} onCancel={() => setShowRename(false)} />
      )}
    </View>
  );
}
