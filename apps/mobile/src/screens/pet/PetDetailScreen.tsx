import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, Platform, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAtom, useAtomValue } from 'jotai';
import { petStateAtom, petMoodAtom } from '../../store/atoms';
import { getEvolutionLabel, getXpProgress, getPetDisplayName } from '../../../../../libs/pet/src/petEngine';
import { upsertPetState } from '../../../../../libs/storage/src/petRepository';
import { PetAnimation } from '../../components/PetAnimation';
import { PetRenameModal } from '../../components/PetRenameModal';
import { IconAnimation } from '../../components/IconAnimation';

const { width: W } = Dimensions.get('window');

const PET_COLOR: Record<string, string> = {
  dragon: '#FF6F00', bunny: '#EC407A', dog: '#795548', cat: '#FF8F00', rex: '#388E3C',
};

interface OutfitDef {
  id: string;
  emoji: string;
  name: string;
  xpRequired: number;
  color: string;
}

const OUTFITS: OutfitDef[] = [
  { id: 'none',    emoji: '🐾', name: 'Natural',      xpRequired: 0,    color: '#9E9E9E' },
  { id: 'hat',     emoji: '🎩', name: 'Sombrero',     xpRequired: 50,   color: '#5C6BC0' },
  { id: 'crown',   emoji: '👑', name: 'Corona',       xpRequired: 150,  color: '#FBC02D' },
  { id: 'bowtie',  emoji: '🎀', name: 'Moño',         xpRequired: 300,  color: '#E91E63' },
  { id: 'glasses', emoji: '🕶️', name: 'Anteojos',     xpRequired: 500,  color: '#00BCD4' },
  { id: 'star',    emoji: '⭐',  name: 'Estrella',     xpRequired: 800,  color: '#FF9800' },
  { id: 'rainbow', emoji: '🌈', name: 'Arcoíris',     xpRequired: 1200, color: '#9C27B0' },
];

const EVOLUTION_STAGES = [
  { stage: 0, label: 'Bebé',   xp: 0,    emoji: '🥚', color: '#B0BEC5' },
  { stage: 1, label: 'Niño',   xp: 150,  emoji: '🌱', color: '#81C784' },
  { stage: 2, label: 'Joven',  xp: 500,  emoji: '🌿', color: '#4CAF50' },
  { stage: 3, label: 'Adulto', xp: 1200, emoji: '🌳', color: '#2E7D32' },
];

function NeedBar({ icon, label, value, color }: { icon?: React.ReactNode; label: string; value: number; color: string }) {
  const pct = Math.round(value);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: pct / 100, damping: 14, stiffness: 80, useNativeDriver: false }).start();
  }, [pct]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={needStyles.row}>
      <View style={needStyles.labelWrap}>
        {icon}
        <Text style={needStyles.label}>{label}</Text>
      </View>
      <View style={needStyles.track}>
        <Animated.View style={[needStyles.fill, { width: width as any, backgroundColor: color }]} />
      </View>
      <Text style={[needStyles.pct, { color }]}>{pct}</Text>
    </View>
  );
}

export default function PetDetailScreen() {
  const navigation = useNavigation();
  const [petState, setPetState] = useAtom(petStateAtom);
  const mood = useAtomValue(petMoodAtom);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const [selectedOutfit, setSelectedOutfit] = useState<string>(petState?.outfitId ?? 'none');
  const [showRename, setShowRename]         = useState(false);

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(headerAnim, { toValue: 1, damping: 14, stiffness: 100, useNativeDriver: true }),
      Animated.spring(contentAnim, { toValue: 1, damping: 14, stiffness: 90, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!petState) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Creá un perfil para ver tu mascota</Text>
      </View>
    );
  }

  const petColor   = PET_COLOR[petState.petType]  ?? '#FF6F00';
  const petName    = getPetDisplayName(petState);
  const xpProgress = getXpProgress(petState);
  const stageName  = getEvolutionLabel(petState.evolutionStage);

  const currentOutfit = OUTFITS.find((o) => o.id === selectedOutfit) ?? OUTFITS[0];

  function applyOutfit(outfitId: string) {
    setSelectedOutfit(outfitId);
    const updated = { ...petState!, outfitId };
    setPetState(updated);
    upsertPetState(updated).catch(console.error);
  }

  function applyName(name: string) {
    const trimmed = name.trim();
    const updated = { ...petState!, petName: trimmed === '' ? null : trimmed };
    setPetState(updated);
    upsertPetState(updated).catch(console.error);
    setShowRename(false);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: petColor },
          { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0,1], outputRange: [-20, 0] }) }] },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{petName}</Text>
        <Text style={styles.headerStage}>{stageName} · ⭐ {petState.totalXp} XP</Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{
          opacity: contentAnim,
          transform: [{ translateY: contentAnim.interpolate({ inputRange: [0,1], outputRange: [30, 0] }) }],
        }}>

          {/* Pet showcase */}
          <View style={[styles.showcaseCard, { borderColor: petColor + '44' }]}>
            <View style={[styles.showcaseBg, { backgroundColor: petColor + '18' }]}>
              <PetAnimation petType={petState.petType} mood={mood} size={96} />
              {currentOutfit.id !== 'none' && (
                <Text style={styles.outfitBadge}>{currentOutfit.emoji}</Text>
              )}
            </View>
            <View style={styles.showcaseInfo}>
              <View style={styles.showcaseNameRow}>
                <Text style={styles.showcaseName}>{petName}</Text>
                <TouchableOpacity
                  onPress={() => setShowRename(true)}
                  hitSlop={10}
                  style={styles.editNameBtn}
                >
                  <Text style={styles.editNameIcon}>✏️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.showcaseStage}>{stageName}</Text>

              {/* XP progress */}
              {petState.evolutionStage < 3 && (
                <View style={styles.xpSection}>
                  <View style={styles.xpLabelRow}>
                    <Text style={styles.xpLabel}>Progreso de evolución</Text>
                    <Text style={[styles.xpPct, { color: petColor }]}>
                      {Math.round(xpProgress * 100)}%
                    </Text>
                  </View>
                  <View style={styles.xpTrack}>
                    <View style={[styles.xpFill, {
                      width: `${Math.round(xpProgress * 100)}%` as any,
                      backgroundColor: petColor,
                    }]} />
                  </View>
                </View>
              )}
              {petState.evolutionStage === 3 && (
                <View style={[styles.maxBadge, { backgroundColor: petColor }]}>
                  <Text style={styles.maxBadgeText}>¡Evolución máxima!</Text>
                </View>
              )}
            </View>
          </View>

          {/* Needs */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Estado actual</Text>
            <NeedBar icon={<IconAnimation name="apple" size={18} />} label="Hambre" value={petState.hunger}    color="#FF7043" />
            <NeedBar icon={<IconAnimation name="water" size={18} />} label="Sed"    value={petState.thirst}    color="#2196F3" />
            <NeedBar icon={<IconAnimation name="carino" size={18} />} label="Feliz"  value={petState.happiness} color="#FFC107" />
          </View>

          {/* Outfits */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Outfits</Text>
            <Text style={styles.sectionSubtitle}>Ganás outfits acumulando XP</Text>
            <View style={styles.outfitGrid}>
              {OUTFITS.map((outfit) => {
                const unlocked = petState.totalXp >= outfit.xpRequired;
                const active   = selectedOutfit === outfit.id;
                return (
                  <TouchableOpacity
                    key={outfit.id}
                    style={[
                      styles.outfitCard,
                      active && { borderColor: outfit.color, borderWidth: 3, backgroundColor: outfit.color + '18' },
                      !unlocked && styles.outfitLocked,
                    ]}
                    onPress={() => unlocked && applyOutfit(outfit.id)}
                    activeOpacity={unlocked ? 0.8 : 1}
                  >
                    <Text style={[styles.outfitEmoji, !unlocked && { opacity: 0.35 }]}>
                      {outfit.emoji}
                    </Text>
                    <Text style={[styles.outfitName, !unlocked && { color: '#CCC' }]}>
                      {outfit.name}
                    </Text>
                    {!unlocked && (
                      <View style={styles.outfitLockBadge}>
                        <Text style={styles.outfitLockText}>🔒 {outfit.xpRequired} XP</Text>
                      </View>
                    )}
                    {active && (
                      <View style={[styles.activeBadge, { backgroundColor: outfit.color }]}>
                        <Text style={styles.activeBadgeText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Evolution timeline */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Etapas de evolución</Text>
            <View style={styles.timeline}>
              {EVOLUTION_STAGES.map((ev, i) => {
                const reached = petState.totalXp >= ev.xp;
                const current = petState.evolutionStage === ev.stage;
                return (
                  <View key={ev.stage} style={styles.timelineRow}>
                    <View style={[
                      styles.timelineDot,
                      { backgroundColor: reached ? ev.color : '#E0E0E0' },
                      current && styles.timelineDotCurrent,
                    ]}>
                      <Text style={styles.timelineDotEmoji}>{ev.emoji}</Text>
                    </View>
                    {i < EVOLUTION_STAGES.length - 1 && (
                      <View style={[
                        styles.timelineLine,
                        { backgroundColor: petState.evolutionStage > ev.stage ? ev.color : '#E0E0E0' },
                      ]} />
                    )}
                    <View style={styles.timelineInfo}>
                      <Text style={[styles.timelineLabel, current && { color: ev.color, fontWeight: '900' }]}>
                        {ev.label} {current ? '← Estás aquí' : ''}
                      </Text>
                      <Text style={styles.timelineXp}>{ev.xp === 0 ? 'Desde el inicio' : `${ev.xp} XP`}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

        </Animated.View>
      </ScrollView>

      {showRename && (
        <PetRenameModal
          initialName={petState.petName ?? ''}
          onSave={applyName}
          onCancel={() => setShowRename(false)}
        />
      )}
    </View>
  );
}

const OUTFIT_CARD_W = (W - 48 - 32) / 4;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#999', textAlign: 'center' },

  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
  headerStage: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 4 },

  scroll: { padding: 16, paddingBottom: 48, gap: 16 },

  showcaseCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    flexDirection: 'row',
    alignItems: 'center',
  },
  showcaseBg: {
    width: 120,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outfitBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 28,
  },
  showcaseInfo: { flex: 1, padding: 16, gap: 8 },
  showcaseNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  showcaseName: { fontSize: 22, fontWeight: '900', color: '#222' },
  editNameBtn: { padding: 4 },
  editNameIcon: { fontSize: 16 },
  showcaseStage: { fontSize: 14, color: '#888', fontWeight: '600' },
  xpSection: { gap: 4, marginTop: 4 },
  xpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpLabel: { fontSize: 11, color: '#AAA', fontWeight: '600' },
  xpPct: { fontSize: 12, fontWeight: '800' },
  xpTrack: { height: 10, backgroundColor: '#EEE', borderRadius: 5, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 5 },
  maxBadge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
  maxBadgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    gap: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#333' },
  sectionSubtitle: { fontSize: 12, color: '#AAA', fontWeight: '600', marginTop: -6 },

  outfitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  outfitCard: {
    width: OUTFIT_CARD_W,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    padding: 10,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  outfitLocked: { backgroundColor: '#F5F5F5' },
  outfitEmoji: { fontSize: 32 },
  outfitName: { fontSize: 11, fontWeight: '700', color: '#444', textAlign: 'center' },
  outfitLockBadge: {
    backgroundColor: '#EEEEEE',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  outfitLockText: { fontSize: 9, color: '#999', fontWeight: '700' },
  activeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBadgeText: { fontSize: 10, color: '#fff', fontWeight: '900' },

  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, position: 'relative' },
  timelineDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineDotCurrent: {
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  timelineDotEmoji: { fontSize: 20 },
  timelineLine: {
    position: 'absolute',
    left: 21,
    top: 44,
    width: 3,
    height: 24,
    borderRadius: 2,
    zIndex: 0,
  },
  timelineInfo: { flex: 1, paddingTop: 10, paddingBottom: 20 },
  timelineLabel: { fontSize: 15, fontWeight: '700', color: '#444' },
  timelineXp: { fontSize: 12, color: '#AAA', fontWeight: '600', marginTop: 2 },
});

const needStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  labelWrap: { width: 80, flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 13, fontWeight: '700', color: '#666' },
  track: { flex: 1, height: 14, backgroundColor: '#EEE', borderRadius: 7, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 7 },
  pct: { fontSize: 12, fontWeight: '800', width: 28, textAlign: 'right' },
});
