import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Dimensions, Platform, ImageBackground,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue } from 'jotai';
import { activeProfileAtom, petStateAtom, petMoodAtom } from '../../store/atoms';
import { getEvolutionLabel, getXpProgress } from '@sierrita/pet';
import { PetAnimation } from '../../components/PetAnimation';
import { IconAnimation } from '../../components/IconAnimation';
import type { IconAnimationName } from '../../components/IconAnimation';
import type { RootStackParamList } from '../../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: W } = Dimensions.get('window');
const IS_TABLET = W >= 600;

const MOOD_BUBBLE: Record<string, { text: string; accent: string }> = {
  happy:   { text: '¡Estoy de gran humor! ✨',     accent: '#4CAF50' },
  neutral: { text: 'Listo para una aventura 🌤️',   accent: '#FBC02D' },
  hungry:  { text: 'Se me escucha la pancita…',    accent: '#FF7043' },
  thirsty: { text: 'Necesito un trago de agua 💧', accent: '#2196F3' },
  sad:     { text: 'Te extrañé un montón 🥺',      accent: '#E91E63' },
};

const WORLD_CARDS: Array<{
  id: string;
  iconName: IconAnimationName;
  name: string;
  subject: string;
  bg: string;
  dark: string;
  accent: string;
  games: number;
}> = [
  {
    id: 'jungle',
    iconName: 'selva',
    name: 'Selva\nMágica',
    subject: 'Escritura',
    bg: '#4CAF50',
    dark: '#2E7D32',
    accent: '#A5D6A7',
    games: 4,
  },
  {
    id: 'ocean',
    iconName: 'oceano',
    name: 'Océano\nProfundo',
    subject: 'Matemáticas',
    bg: '#2196F3',
    dark: '#1565C0',
    accent: '#90CAF9',
    games: 4,
  },
  {
    id: 'space',
    iconName: 'cohete',
    name: 'Espacio\nEstelar',
    subject: 'Lógica',
    bg: '#9C27B0',
    dark: '#4A148C',
    accent: '#CE93D8',
    games: 4,
  },
];

const TIPS = [
  'Un ratito de práctica al día te convierte en una estrella ⭐',
  'Cada letra nueva es un superpoder que sumás 📚',
  'Los números son divertidos cuando jugás con ellos 🔢',
  'Tu compañero te espera con muchas ganas de jugar 🐾',
  'Equivocarse también es aprender — ¡seguí intentando! 💡',
];

function dailyTip(): string {
  const day = new Date().getDate();
  return TIPS[day % TIPS.length];
}

function NeedDot({ value, color }: { value: number; color: string }) {
  const opacity = value < 30 ? 1 : 0.3;
  return (
    <View style={[dotStyles.dot, { backgroundColor: color, opacity }]} />
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const profile    = useAtomValue(activeProfileAtom);
  const pet        = useAtomValue(petStateAtom);
  const mood       = useAtomValue(petMoodAtom);
  const isFocused  = useIsFocused();

  const petBounce    = useRef(new Animated.Value(0)).current;
  const cardEntrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isFocused) return;

    // Pet bounce loop
    const petAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(petBounce, { toValue: -8, duration: 700, useNativeDriver: true }),
        Animated.timing(petBounce, { toValue: 0,  duration: 700, useNativeDriver: true }),
      ]),
    );
    petAnim.start();

    // Card entrance
    cardEntrance.setValue(0);
    Animated.spring(cardEntrance, {
      toValue: 1,
      damping: 14,
      stiffness: 100,
      delay: 150,
      useNativeDriver: true,
    }).start();

    return () => petAnim.stop();
  }, [isFocused]);

  const moodCfg     = MOOD_BUBBLE[mood] ?? MOOD_BUBBLE.neutral;
  const xpProgress  = pet ? getXpProgress(pet) : 0;
  const stageName   = pet ? getEvolutionLabel(pet.evolutionStage) : '';
  const petType     = pet?.petType ?? profile?.avatar ?? 'dragon';

  const cardTranslate = cardEntrance.interpolate({
    inputRange: [0, 1], outputRange: [40, 0],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.greetingRow}>
            <Text style={styles.greeting}>¡Hola, {profile?.name ?? 'amigo'}!</Text>
            <IconAnimation name="mano" size={52} />
          </View>
          <Text style={styles.subgreeting}>¿Qué aprendemos hoy?</Text>
        </View>
        <TouchableOpacity
          style={styles.parentBtn}
          onPress={() => navigation.navigate('Parents')}
          hitSlop={12}
        >
          <IconAnimation name="engranaje" size={52} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet card — escenario sobre el nuevo fondo */}
        <Animated.View style={[styles.petCardWrap, {
          opacity: cardEntrance,
          transform: [{ translateY: cardTranslate }],
        }]}>
          <ImageBackground
            source={require('../../../assets/images/Fondo-detalle.png')}
            style={styles.petCard}
            imageStyle={styles.petCardImage}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.92)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />

            <Animated.View style={[styles.petLeft, { transform: [{ translateY: petBounce }] }]}>
              <View style={[styles.petGlow, { backgroundColor: moodCfg.accent + '33' }]} />
              <PetAnimation petType={petType} mood={mood} size={88} />
            </Animated.View>

            <View style={styles.petRight}>
              <View style={[styles.moodBubble, { borderLeftColor: moodCfg.accent }]}>
                <Text style={styles.moodText}>{moodCfg.text}</Text>
              </View>

              {pet && (
                <View style={styles.needsRow}>
                  <NeedDot value={pet.hunger}    color="#FF7043" />
                  <NeedDot value={pet.thirst}    color="#2196F3" />
                  <NeedDot value={pet.happiness} color="#FFC107" />
                </View>
              )}

              {/* XP bar */}
              <View style={styles.xpRow}>
                <Text style={styles.xpLabel}>{stageName}</Text>
                <View style={styles.xpTrack}>
                  <Animated.View
                    style={[styles.xpFill, { width: `${Math.round(xpProgress * 100)}%` as any }]}
                  />
                </View>
              </View>

              <Text style={styles.xpAmount}>⭐ {pet?.totalXp ?? 0} XP</Text>
            </View>
          </ImageBackground>
        </Animated.View>

        {/* World cards */}
        <Text style={styles.sectionTitle}>¡Elegí tu aventura!</Text>

        <View style={[styles.worldGrid, IS_TABLET && styles.worldGridTablet]}>
          {WORLD_CARDS.map((w, idx) => (
            <Animated.View
              key={w.id}
              style={{
                opacity: cardEntrance,
                transform: [{
                  translateY: cardEntrance.interpolate({
                    inputRange: [0, 1], outputRange: [60 + idx * 20, 0],
                  }),
                }],
              }}
            >
              <TouchableOpacity
                style={[styles.worldCard, { backgroundColor: w.bg }]}
                activeOpacity={0.88}
                onPress={() => (navigation as any).navigate('Worlds')}
              >
                {/* Top accent bar */}
                <View style={[styles.worldCardTop, { backgroundColor: w.dark }]} />

                <IconAnimation name={w.iconName} size={64} />
                <Text style={styles.worldCardName}>{w.name}</Text>
                <Text style={styles.worldCardSubject}>{w.subject}</Text>
                <View style={[styles.worldCardBadge, { backgroundColor: w.accent }]}>
                  <Text style={[styles.worldCardBadgeText, { color: w.dark }]}>
                    {w.games} juegos
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Daily tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>{dailyTip()}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F8E9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'android' ? 40 : 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#2E7D32',
  },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  greeting:    { fontSize: 24, fontWeight: '900', color: '#fff' },
  subgreeting: { fontSize: 14, color: '#A5D6A7', fontWeight: '600', marginTop: 2 },
  parentBtn: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32, gap: 16 },

  // Pet card — escenario con el nuevo fondo ilustrado
  petCardWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  petCardImage: { borderRadius: 24 },
  petLeft:  { alignItems: 'center', justifyContent: 'center', width: 92 },
  petGlow: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
  },
  petRight: { flex: 1, gap: 6 },
  moodBubble: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 14,
    borderLeftWidth: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  moodText: { fontSize: 13, fontWeight: '700', color: '#4E342E' },
  needsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpLabel: { fontSize: 11, fontWeight: '700', color: '#888', minWidth: 56 },
  xpTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FFC107',
  },
  xpAmount: { fontSize: 11, fontWeight: '700', color: '#FFA000' },

  // Section title
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2E7D32',
  },

  // World cards
  worldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  worldGridTablet: {
    justifyContent: 'space-between',
  },
  worldCard: {
    width: IS_TABLET ? (W - 64) / 3 : (W - 44) / 3,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    gap: 4,
  },
  worldCardTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 4,
  },
  worldCardName:    { fontSize: 13, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 16 },
  worldCardSubject: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  worldCardBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  worldCardBadgeText: { fontSize: 10, fontWeight: '800' },

  // Daily tip
  tipCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  tipIcon: { fontSize: 24 },
  tipText: { flex: 1, fontSize: 14, color: '#5D4037', fontWeight: '600', lineHeight: 20 },
});

const dotStyles = StyleSheet.create({
  dot: { width: 10, height: 10, borderRadius: 5 },
});
