import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Dimensions, Platform,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAtomValue } from 'jotai';
import { IconAnimation } from '../../components/IconAnimation';
import type { IconAnimationName } from '../../components/IconAnimation';
import type { RootStackParamList } from '../../navigation';
import { activeProfileAtom } from '../../store/atoms';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: W } = Dimensions.get('window');
const IS_TABLET    = W >= 600;

interface GameDef {
  id: string;
  name: string;
  emoji: string;
  minAge: number;
}

interface WorldDef {
  id: string;
  iconName: IconAnimationName;
  name: string;
  subject: string;
  color: string;
  dark: string;
  light: string;
  games: GameDef[];
}

const WORLDS: WorldDef[] = [
  {
    id: 'jungle', iconName: 'selva' as IconAnimationName, name: 'Selva Mágica', subject: 'Escritura',
    color: '#4CAF50', dark: '#2E7D32', light: '#E8F5E9',
    games: [
      { id: 'tracing',   name: 'Trazos y Letras',  emoji: '✏️',  minAge: 4 },
      { id: 'words',     name: 'Palabras Mágicas', emoji: '🔤',  minAge: 5 },
      { id: 'sentences', name: 'Armar Oraciones',  emoji: '📝',  minAge: 6 },
      { id: 'cursive',   name: 'Letra Cursiva',    emoji: '🖊️',  minAge: 6 },
    ],
  },
  {
    id: 'ocean', iconName: 'oceano' as IconAnimationName, name: 'Océano Profundo', subject: 'Matemáticas',
    color: '#2196F3', dark: '#1565C0', light: '#E3F2FD',
    games: [
      { id: 'counting',  name: 'Contar Pececitos', emoji: '🐟',  minAge: 4 },
      { id: 'sums',      name: 'Sumas y Restas',   emoji: '➕',   minAge: 5 },
      { id: 'hundreds',  name: 'Centenas y Decenas', emoji: '💯', minAge: 6 },
      { id: 'compare',   name: 'Mayor y Menor',    emoji: '⚖️',  minAge: 4 },
    ],
  },
  {
    id: 'space', iconName: 'cohete' as IconAnimationName, name: 'Espacio Estelar', subject: 'Lógica',
    color: '#9C27B0', dark: '#4A148C', light: '#F3E5F5',
    games: [
      { id: 'patterns',  name: 'Secuencias',       emoji: '🔮',  minAge: 4 },
      { id: 'memory',    name: 'Memoria Estelar',  emoji: '🃏',  minAge: 4 },
      { id: 'classify',  name: 'Clasificar',       emoji: '📦',  minAge: 4 },
      { id: 'maze',      name: 'Laberinto',        emoji: '🌀',  minAge: 5 },
    ],
  },
];

function GameCard({
  game, world, profileAge, navigation, cardAnim,
}: {
  game: GameDef;
  world: WorldDef;
  profileAge: number;
  navigation: Nav;
  cardAnim: Animated.Value;
}) {
  const isLocked = game.minAge > profileAge;

  return (
    <Animated.View style={{ opacity: cardAnim, transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }}>
      <TouchableOpacity
        style={[
          styles.gameCard,
          { borderColor: world.color },
          isLocked && styles.gameCardLocked,
        ]}
        onPress={() => {
          if (!isLocked) {
            navigation.navigate('Game', { worldId: world.id, gameId: game.id });
          }
        }}
        activeOpacity={isLocked ? 1 : 0.8}
      >
        <Text style={[styles.gameEmoji, isLocked && { opacity: 0.4 }]}>{game.emoji}</Text>
        <Text style={[styles.gameName, isLocked && { color: '#BBB' }]}>
          {game.name}
        </Text>
        {isLocked && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockText}>🔒 {game.minAge}+</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function WorldSection({
  world, profileAge, navigation, entrance,
}: {
  world: WorldDef;
  profileAge: number;
  navigation: Nav;
  entrance: Animated.Value;
}) {
  const unlockedCount = world.games.filter((g) => g.minAge <= profileAge).length;

  return (
    <Animated.View style={[styles.worldCard, {
      opacity: entrance,
      transform: [{
        translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }),
      }],
    }]}>
      {/* Header */}
      <View style={[styles.worldHeader, { backgroundColor: world.dark }]}>
        <IconAnimation name={world.iconName} size={64} />
        <View style={styles.worldHeaderText}>
          <Text style={styles.worldName}>{world.name}</Text>
          <Text style={styles.worldSubject}>{world.subject}</Text>
        </View>
        <View style={[styles.progressBadge, { backgroundColor: world.color }]}>
          <Text style={styles.progressText}>{unlockedCount}/{world.games.length}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.worldProgressTrack, { backgroundColor: world.light }]}>
        <View style={[
          styles.worldProgressFill,
          {
            width: `${(unlockedCount / world.games.length) * 100}%` as any,
            backgroundColor: world.color,
          },
        ]} />
      </View>

      {/* Game grid */}
      <View style={[styles.gameGrid, { backgroundColor: world.light }]}>
        {world.games.map((game, i) => (
          <GameCard
            key={game.id}
            game={game}
            world={world}
            profileAge={profileAge}
            navigation={navigation}
            cardAnim={entrance}
          />
        ))}
      </View>
    </Animated.View>
  );
}

export default function WorldsScreen() {
  const navigation  = useNavigation<Nav>();
  const profile     = useAtomValue(activeProfileAtom);
  const isFocused   = useIsFocused();
  const profileAge  = profile?.age ?? 4;

  const entranceAnims = useRef(WORLDS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!isFocused) return;

    // Staggered entrance per world
    entranceAnims.forEach((anim) => anim.setValue(0));
    Animated.stagger(
      140,
      entranceAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          damping: 14,
          stiffness: 100,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>¡Elegí tu mundo!</Text>
        {profile && (
          <View style={styles.ageBadge}>
            <Text style={styles.ageBadgeText}>{profile.name} · {profileAge} años</Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {WORLDS.map((world, i) => (
          <WorldSection
            key={world.id}
            world={world}
            profileAge={profileAge}
            navigation={navigation}
            entrance={entranceAnims[i]}
          />
        ))}

        {/* Unlock hint */}
        <View style={styles.hintCard}>
          <Text style={styles.hintText}>
            🔒 Los juegos con candado se desbloquean a medida que crecés
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_W = IS_TABLET ? (W - 64) / 2 : (W - 52) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    paddingTop: Platform.OS === 'android' ? 36 : 52,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#1A237E',
    gap: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
  },
  ageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  ageBadgeText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },
  scrollContent: { padding: 16, gap: 20, paddingBottom: 40 },

  // World card
  worldCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  worldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  worldHeaderText:  { flex: 1 },
  worldName:    { fontSize: 20, fontWeight: '900', color: '#fff' },
  worldSubject: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 2 },
  progressBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  progressText: { fontSize: 15, fontWeight: '900', color: '#fff' },
  worldProgressTrack: {
    height: 4,
    width: '100%',
  },
  worldProgressFill: {
    height: '100%',
  },

  // Game grid
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 14,
    gap: 10,
  },
  gameCard: {
    width: CARD_W,
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    position: 'relative',
  },
  gameCardLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#DDD',
    borderStyle: 'dashed',
  },
  gameEmoji: { fontSize: 32 },
  gameName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    lineHeight: 17,
  },
  lockBadge: {
    backgroundColor: '#EEE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  lockText: { fontSize: 11, fontWeight: '700', color: '#999' },

  // Hint
  hintCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 13,
    color: '#5C6BC0',
    fontWeight: '600',
    textAlign: 'center',
  },
});
