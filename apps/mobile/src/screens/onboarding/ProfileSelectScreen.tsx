import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue } from 'jotai';
import { activeProfileIdAtom } from '../../store/atoms';
import { useProfileSelection } from './hooks/useProfileSelection';
import { useProfileCardAnimations } from './hooks/useProfileCardAnimations';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileCard } from './components/ProfileCard';
import { AddProfileCard } from './components/AddProfileCard';
import { styles } from './ProfileSelectScreen.styles';

export default function ProfileSelectScreen() {
  const { navigation, profiles, handleSelect, handleDelete } = useProfileSelection();
  const activeProfileId = useAtomValue(activeProfileIdAtom);
  const isSwitching = !!activeProfileId && navigation.canGoBack();
  const cardAnims = useProfileCardAnimations(profiles.length);

  return (
    <ImageBackground
      source={require('../../../assets/images/Fondo-detalle.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(232,245,233,0.45)', 'rgba(232,245,233,0.92)']}
        locations={[0, 0.5]}
        style={StyleSheet.absoluteFill}
      />

      <ProfileHeader isSwitching={isSwitching} onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {profiles.map((p, idx) => (
          <ProfileCard key={p.id} profile={p} anim={cardAnims[idx]} onSelect={handleSelect} onDelete={handleDelete} />
        ))}

        {profiles.length < 5 && (
          <AddProfileCard anim={cardAnims[profiles.length]} onPress={() => navigation.navigate('Onboarding')} />
        )}
      </ScrollView>

      <Text style={styles.hint}>Mantené presionado para borrar un perfil</Text>
    </ImageBackground>
  );
}
