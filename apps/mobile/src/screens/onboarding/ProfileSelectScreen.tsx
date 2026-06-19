import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
  Animated, Dimensions, Platform, ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue } from 'jotai';
import type { RootStackParamList } from '../../navigation';
import { useProfiles } from '../../hooks/useProfiles';
import { activeProfileIdAtom } from '../../store/atoms';
import { PetAnimation } from '../../components/PetAnimation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProfileSelect'>;

const { width: W } = Dimensions.get('window');
const IS_TABLET = W >= 600;

const PET_COLOR: Record<string, string> = {
  dragon: '#FF6F00', bunny: '#EC407A', dog: '#795548', cat: '#FF8F00', rex: '#388E3C',
};

export default function ProfileSelectScreen() {
  const navigation = useNavigation<Nav>();
  const { profiles, selectProfile, removeProfile } = useProfiles();
  const activeProfileId = useAtomValue(activeProfileIdAtom);
  const isSwitching = !!activeProfileId && navigation.canGoBack();

  // One animated value per card slot (max 6 including "add" button)
  const cardAnims = useRef(
    Array.from({ length: 6 }, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    Animated.stagger(
      80,
      cardAnims.slice(0, profiles.length + 1).map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          damping: 12,
          stiffness: 120,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [profiles.length]);

  function handleSelect(id: string) {
    selectProfile(id);
    navigation.replace('Main');
  }

  function handleDelete(id: string, name: string) {
    Alert.alert(
      'Borrar perfil',
      `¿Querés borrar el perfil de ${name}? Se perderá todo su progreso.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: () => removeProfile(id) },
      ],
    );
  }

  const CARD_W = IS_TABLET ? 180 : 148;
  const CARD_H = IS_TABLET ? 200 : 172;
  const PET_SIZE = CARD_W * 0.62;
  const PET_GLOW_SIZE = PET_SIZE + 16;

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

      {/* Header */}
      <View style={styles.header}>
        {isSwitching && (
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={12}>
            <Text style={styles.backBtnText}>← Volver</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>¿Quién juega hoy?</Text>
        <Text style={styles.subtitle}>
          {isSwitching ? 'Elegí un perfil o creá uno nuevo' : 'Tocá tu perfil para entrar'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {profiles.map((p, idx) => {
          const anim = cardAnims[idx];
          const color = PET_COLOR[p.avatar] ?? '#4CAF50';
          return (
            <Animated.View key={p.id} style={{
              opacity: anim,
              transform: [
                { scale: anim },
                { translateY: anim.interpolate({ inputRange: [0,1], outputRange: [30, 0] }) },
              ],
            }}>
              <TouchableOpacity
                style={[styles.card, { width: CARD_W, height: CARD_H }]}
                onPress={() => handleSelect(p.id)}
                onLongPress={() => handleDelete(p.id, p.name)}
                activeOpacity={0.85}
              >
                {/* Color top strip */}
                <View style={[styles.cardStrip, { backgroundColor: color }]} />
                <View style={[styles.petStage, { width: PET_GLOW_SIZE, height: PET_GLOW_SIZE }]}>
                  <View style={[
                    styles.petGlow,
                    { width: PET_GLOW_SIZE, height: PET_GLOW_SIZE, borderRadius: PET_GLOW_SIZE / 2, backgroundColor: color + '26' },
                  ]} />
                  <PetAnimation petType={p.avatar} mood="happy" size={PET_SIZE} />
                </View>
                <Text style={styles.name}>{p.name}</Text>
                <View style={[styles.agePill, { backgroundColor: color + '22', borderColor: color }]}>
                  <Text style={[styles.ageText, { color }]}>{p.age} años</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {profiles.length < 5 && (
          <Animated.View style={{
            opacity: cardAnims[profiles.length],
            transform: [{ scale: cardAnims[profiles.length] }],
          }}>
            <TouchableOpacity
              style={[styles.card, styles.newCard, { width: CARD_W, height: CARD_H }]}
              onPress={() => navigation.navigate('Onboarding')}
              activeOpacity={0.8}
            >
              <Text style={styles.plusEmoji}>+</Text>
              <Text style={styles.newLabel}>Nuevo perfil</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      <Text style={styles.hint}>Mantené presionado para borrar un perfil</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 56,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  backBtnText: { fontSize: 15, fontWeight: '800', color: '#2E7D32' },
  title: {
    fontSize: 30, fontWeight: '900', color: '#2E7D32',
  },
  subtitle: {
    fontSize: 14, color: '#5D4037', fontWeight: '600', marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    gap: 6,
    overflow: 'hidden',
  },
  cardStrip: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 5,
  },
  petStage: { alignItems: 'center', justifyContent: 'center' },
  petGlow: { position: 'absolute' },
  name: { fontSize: 17, fontWeight: '900', color: '#222', textAlign: 'center' },
  agePill: {
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  ageText: { fontSize: 13, fontWeight: '800' },
  newCard: {
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    backgroundColor: '#F9FBE7',
    elevation: 2,
  },
  plusEmoji: {
    fontSize: 52,
    color: '#4CAF50',
    lineHeight: 60,
    fontWeight: '300',
  },
  newLabel: { fontSize: 14, fontWeight: '800', color: '#4CAF50' },
  hint: {
    textAlign: 'center',
    color: '#7CB342',
    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 16,
  },
});
