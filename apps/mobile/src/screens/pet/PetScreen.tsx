import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import type { RootStackParamList } from '../../navigation';
import { usePet } from '../../hooks/usePet';
import { getEvolutionLabel, getXpProgress, getPetDisplayName } from '../../../../../libs/pet/src/petEngine';
import { PetAnimation } from '../../components/PetAnimation';
import { IconAnimation } from '../../components/IconAnimation';
import { PetRenameModal } from '../../components/PetRenameModal';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_W } = Dimensions.get('window');
// 3 botones por fila: ancho de pantalla menos el padding horizontal del scroll (20*2) y los 2 gaps entre tarjetas (12*2)
const ACTION_BTN_W = (SCREEN_W - 40 - 24) / 3;

const MOOD_CONFIG: Record<string, { text: string; glow: string }> = {
  happy:   { text: '¡Estoy en mi mejor momento! ✨', glow: '#A5D6A7' },
  neutral: { text: 'Tengo ganas de aventuras 🌤️',    glow: '#FFE082' },
  hungry:  { text: 'Una rica comida me vendría bien…',  glow: '#FFAB91' },
  thirsty: { text: 'Se me secó la garganta… 💧',       glow: '#90CAF9' },
  sad:     { text: 'Te estuve esperando todo el día 🥺', glow: '#F48FB1' },
};

export default function PetScreen() {
  const navigation = useNavigation<Nav>();
  const { petState, mood, feed, giveWater, play, renamePet } = usePet();
  const bounceY  = useRef(new Animated.Value(0)).current;
  const actionScale = useRef(new Animated.Value(1)).current;
  const [showRename, setShowRename] = useState(false);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceY, { toValue: -10, duration: 1100, useNativeDriver: true }),
        Animated.timing(bounceY, { toValue: 0,   duration: 1100, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  function animateAction(fn: () => void) {
    actionScale.setValue(0.92);
    Animated.spring(actionScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    fn();
  }

  if (!petState) {
    return (
      <View style={styles.emptyContainer}>
        <IconAnimation name="paw" size={64} />
        <Text style={styles.empty}>Creá un perfil para conocer a tu compañero</Text>
      </View>
    );
  }

  const moodCfg = MOOD_CONFIG[mood] ?? MOOD_CONFIG.neutral;
  const petName = getPetDisplayName(petState);
  const xpProgress = getXpProgress(petState);
  const nextXp = petState.evolutionStage < 3
    ? [150, 500, 1200][petState.evolutionStage] - petState.totalXp
    : 0;

  return (
    <ImageBackground
      source={require('../../../assets/images/Fondo-detalle.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0.85)']}
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

        {/* Escenario de la mascota */}
        <View style={styles.stageWrap}>
          <Animated.View style={[styles.stageCenter, { transform: [{ scale: actionScale }] }]}>
            <View style={[styles.stageGlow, { backgroundColor: moodCfg.glow }]} />
            <Animated.View style={{ transform: [{ translateY: bounceY }] }}>
              <PetAnimation petType={petState.petType} mood={mood} size={150} />
            </Animated.View>
          </Animated.View>

          <View style={styles.moodPill}>
            <Text style={styles.moodPillText}>{moodCfg.text}</Text>
          </View>
        </View>

        {/* Tarjeta de estado (glass) */}
        <BlurView intensity={50} tint="light" style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.stage}>{getEvolutionLabel(petState.evolutionStage)}</Text>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>⭐ {petState.totalXp} XP</Text>
            </View>
          </View>

          {petState.evolutionStage < 3 && (
            <View style={styles.xpBarRow}>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${Math.round(xpProgress * 100)}%` as any }]} />
              </View>
              <Text style={styles.xpBarLabel}>Faltan {nextXp} XP para crecer</Text>
            </View>
          )}

          <View style={styles.needsGrid}>
            <NeedBar icon={<IconAnimation name="apple" size={18} />} label="Hambre"   value={petState.hunger}    color="#FF7043" />
            <NeedBar icon={<IconAnimation name="water" size={18} />} label="Sed"      value={petState.thirst}    color="#42A5F5" />
            <NeedBar icon={<IconAnimation name="carino" size={18} />} label="Cariño"  value={petState.happiness} color="#FFCA28" />
          </View>
        </BlurView>

        {/* Acciones */}
        <View style={styles.actions}>
          <ActionBtn icon={<IconAnimation name="apple" size={36} />}              label="Alimentar" onPress={() => animateAction(feed)}      colors={['#FFAB91', '#FF7043']} />
          <ActionBtn icon={<IconAnimation name="water" size={32} />} label="Dar agua"  onPress={() => animateAction(giveWater)} colors={['#90CAF9', '#42A5F5']} />
          <ActionBtn icon={<IconAnimation name="play" size={32} />}  label="Jugar"      onPress={() => animateAction(play)}      colors={['#CE93D8', '#AB47BC']} />
        </View>

        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => navigation.navigate('PetDetail')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#FFD54F', '#FF8F00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.detailBtnGradient}>
            <Text style={styles.detailBtnText}>🎽 Vestidor y evolución</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {showRename && (
        <PetRenameModal
          initialName={petState.petName ?? ''}
          onSave={(name) => { renamePet(name); setShowRename(false); }}
          onCancel={() => setShowRename(false)}
        />
      )}
    </ImageBackground>
  );
}

function NeedBar({ icon, label, value, color }: { icon?: React.ReactNode; label: string; value: number; color: string }) {
  const pct = Math.round(value);
  return (
    <View style={needStyles.row}>
      <View style={needStyles.labelWrap}>
        {icon}
        <Text style={needStyles.label}>{label}</Text>
      </View>
      <View style={needStyles.track}>
        <View style={[needStyles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={needStyles.pct}>{pct}</Text>
    </View>
  );
}

function ActionBtn({ icon, label, onPress, colors }: {
  icon: React.ReactNode; label: string; onPress: () => void; colors: [string, string];
}) {
  return (
    <View style={actionStyles.shadow}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={actionStyles.wrap}>
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={actionStyles.btn}>
          <View style={actionStyles.iconBox}>{icon}</View>
          <Text style={actionStyles.label}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 56, paddingBottom: 36 },
  titleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginBottom: 8,
  },
  title: {
    fontSize: 26, fontWeight: '900', color: '#3E2723', textAlign: 'center',
    letterSpacing: 0.3,
  },
  editNameBtn: { padding: 4 },
  editNameIcon: { fontSize: 18 },

  // Escenario
  stageWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 4, marginBottom: 18 },
  stageCenter: {
    width: 190, height: 190, alignItems: 'center', justifyContent: 'center',
  },
  stageGlow: {
    position: 'absolute', width: '100%', height: '100%', borderRadius: 95,
    opacity: 0.5,
  },
  moodPill: {
    marginTop: 14, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20,
    paddingVertical: 10, paddingHorizontal: 18, elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    maxWidth: '90%',
  },
  moodPillText: { fontSize: 15, fontWeight: '700', color: '#5D4037', textAlign: 'center' },

  // Tarjeta de stats (glass)
  statsCard: {
    borderRadius: 28, padding: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 18,
  },
  statsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 14,
  },
  stage: { fontSize: 17, fontWeight: '800', color: '#4E342E' },
  xpBadge: { backgroundColor: '#FFF8E1', borderRadius: 14, paddingVertical: 5, paddingHorizontal: 12 },
  xpBadgeText: { fontSize: 13, fontWeight: '800', color: '#F9A825' },
  xpBarRow: { marginBottom: 16, gap: 6 },
  xpTrack: { width: '100%', height: 10, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 5, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 5, backgroundColor: '#FFCA28' },
  xpBarLabel: { fontSize: 12, color: '#6D4C41', fontWeight: '600' },
  needsGrid: { gap: 10 },

  // Acciones
  actions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  detailBtn: { borderRadius: 22, overflow: 'hidden', elevation: 3 },
  detailBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  detailBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F8E9', gap: 10 },
  empty: { fontSize: 17, color: '#8D6E63', textAlign: 'center', fontWeight: '600', paddingHorizontal: 40 },
});

const needStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  labelWrap: { width: 84, flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 13, fontWeight: '700', color: '#5D4037' },
  track: { flex: 1, height: 14, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 7, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 7 },
  pct: { fontSize: 12, fontWeight: '700', color: '#8D6E63', width: 28, textAlign: 'right' },
});

const actionStyles = StyleSheet.create({
  shadow: {
    width: ACTION_BTN_W, borderRadius: 20, backgroundColor: '#FFF',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.18,
    shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  wrap: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  btn: { flex: 1, justifyContent: 'center', paddingVertical: 14, alignItems: 'center', gap: 6 },
  iconBox: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 28, lineHeight: 32 },
  label: { fontSize: 11, fontWeight: '800', color: '#FFF', textAlign: 'center' },
});
