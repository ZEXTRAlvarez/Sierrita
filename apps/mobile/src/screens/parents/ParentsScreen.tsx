import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Switch, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAtomValue } from 'jotai';
import type { RootStackParamList } from '../../navigation';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { activeProfileAtom, activeProfileIdAtom } from '../../store/atoms';
import { getParentConfig, upsertParentConfig } from '../../../../../libs/storage/src/parentConfigRepository';
import { getProfileStats, getGameStats } from '../../../../../libs/storage/src/gameSessionRepository';
import type { ParentConfig, World } from '../../../../../libs/parents/src/types';
import type { GameStat } from '../../../../../libs/storage/src/gameSessionRepository';

// ── PIN hashing ────────────────────────────────────────────────────────────────

function hashPin(pin: string): string {
  let h = 5381;
  for (let i = 0; i < pin.length; i++) {
    h = ((h << 5) + h + pin.charCodeAt(i)) | 0;
  }
  return String(h >>> 0);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const WORLD_LABEL: Record<World, string> = {
  jungle: '🌿 Selva',
  ocean:  '🌊 Océano',
  space:  '🚀 Espacio',
};

const GAME_LABEL: Record<string, string> = {
  tracing:   'Trazos y Letras',
  words:     'Palabras Mágicas',
  sentences: 'Armar Oraciones',
  cursive:   'Letra Cursiva',
  counting:  'Contar Pececitos',
  sums:      'Sumas y Restas',
  hundreds:  'Centenas y Decenas',
  compare:   'Mayor y Menor',
  patterns:  'Secuencias',
  memory:    'Memoria Estelar',
  classify:  'Clasificar Objetos',
  maze:      'Laberinto Estelar',
};

// ── PIN Screen ────────────────────────────────────────────────────────────────

function PinScreen({
  isSetup,
  onSuccess,
  storedHash,
}: {
  isSetup: boolean;
  onSuccess: (pin: string) => void;
  storedHash: string;
}) {
  const navigation = useNavigation();
  const [pin, setPin]         = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep]       = useState<'enter' | 'confirm'>('enter');
  const [error, setError]     = useState('');

  function handleSubmit() {
    setError('');
    if (isSetup) {
      if (pin.length < 4) { setError('Mínimo 4 dígitos'); return; }
      if (step === 'enter') { setStep('confirm'); return; }
      if (pin !== confirm) { setError('Los PINs no coinciden'); setConfirm(''); return; }
      onSuccess(pin);
    } else {
      if (hashPin(pin) !== storedHash) {
        setError('PIN incorrecto');
        setPin('');
      } else {
        onSuccess(pin);
      }
    }
  }

  const title = isSetup
    ? (step === 'enter' ? 'Creá tu PIN de padre/madre' : 'Repetí el PIN')
    : 'Zona de Padres';

  return (
    <View style={pinStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={pinStyles.closeBtn}>
        <Text style={pinStyles.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={pinStyles.lockEmoji}>{isSetup ? '🔐' : '🔒'}</Text>
      <Text style={pinStyles.title}>{title}</Text>

      {isSetup && (
        <Text style={pinStyles.subtitle}>
          Este PIN protege la zona de padres
        </Text>
      )}

      <TextInput
        style={pinStyles.pinInput}
        placeholder="• • • •"
        value={step === 'confirm' ? confirm : pin}
        onChangeText={step === 'confirm' ? setConfirm : setPin}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        autoFocus
      />

      {error !== '' && <Text style={pinStyles.error}>{error}</Text>}

      <TouchableOpacity style={pinStyles.btn} onPress={handleSubmit}>
        <Text style={pinStyles.btnText}>
          {isSetup ? (step === 'enter' ? 'Siguiente →' : 'Crear PIN') : 'Ingresar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Stats Section ─────────────────────────────────────────────────────────────

function StatsSection({
  globalStats,
  gameStats,
}: {
  globalStats: { totalSessions: number; totalMinutes: number; avgScore: number };
  gameStats: GameStat[];
}) {
  const [expanded, setExpanded] = useState(false);

  const worldOrder: World[] = ['jungle', 'ocean', 'space'];

  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>📊 Estadísticas</Text>

      {/* Global summary */}
      <View style={sectionStyles.statRow}>
        <StatBox value={globalStats.totalSessions} label="partidas" />
        <StatBox value={globalStats.totalMinutes} label="minutos" />
        <StatBox value={`${globalStats.avgScore}%`} label="prom." />
      </View>

      {/* Per-game breakdown */}
      <TouchableOpacity
        style={sectionStyles.expandBtn}
        onPress={() => setExpanded((e) => !e)}
      >
        <Text style={sectionStyles.expandText}>
          {expanded ? '▲ Ocultar detalle' : '▼ Ver por juego'}
        </Text>
      </TouchableOpacity>

      {expanded && worldOrder.map((world) => {
        const games = gameStats.filter((g) => g.world === world);
        if (games.length === 0) return null;
        return (
          <View key={world} style={sectionStyles.worldBlock}>
            <Text style={sectionStyles.worldLabel}>{WORLD_LABEL[world]}</Text>
            {games.map((gs) => (
              <View key={gs.gameId} style={sectionStyles.gameRow}>
                <Text style={sectionStyles.gameName}>{GAME_LABEL[gs.gameId] ?? gs.gameId}</Text>
                <Text style={sectionStyles.gameStat}>{gs.sessions}× · {gs.avgScore}% · Niv.{gs.lastLevel}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

function StatBox({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={sectionStyles.statBox}>
      <Text style={sectionStyles.statValue}>{value}</Text>
      <Text style={sectionStyles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Settings Section ──────────────────────────────────────────────────────────

function SettingsSection({
  config,
  onChange,
}: {
  config: ParentConfig;
  onChange: (c: ParentConfig) => void;
}) {
  const WORLDS: World[] = ['jungle', 'ocean', 'space'];
  const TIME_OPTIONS = [15, 20, 30, 45, 60];

  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>⚙️ Configuración</Text>

      {/* Session limit */}
      <Text style={sectionStyles.settingLabel}>Tiempo de sesión</Text>
      <View style={sectionStyles.timeRow}>
        {TIME_OPTIONS.map((mins) => (
          <TouchableOpacity
            key={mins}
            style={[
              sectionStyles.timeChip,
              config.maxSessionMinutes === mins && sectionStyles.timeChipSelected,
            ]}
            onPress={() => onChange({ ...config, maxSessionMinutes: mins, updatedAt: Date.now() })}
          >
            <Text style={[
              sectionStyles.timeChipText,
              config.maxSessionMinutes === mins && sectionStyles.timeChipTextSelected,
            ]}>
              {mins}min
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Worlds enabled */}
      <Text style={[sectionStyles.settingLabel, { marginTop: 16 }]}>Mundos habilitados</Text>
      {WORLDS.map((world) => (
        <View key={world} style={sectionStyles.switchRow}>
          <Text style={sectionStyles.switchLabel}>{WORLD_LABEL[world]}</Text>
          <Switch
            value={config.worldsEnabled.includes(world)}
            onValueChange={(val) => {
              const next: World[] = val
                ? [...config.worldsEnabled, world]
                : config.worldsEnabled.filter((w) => w !== world);
              if (next.length === 0) return; // at least 1 world must be enabled
              onChange({ ...config, worldsEnabled: next, updatedAt: Date.now() });
            }}
            trackColor={{ false: '#DDD', true: '#4CAF50' }}
            thumbColor="#fff"
          />
        </View>
      ))}
    </View>
  );
}

// ── PDF export ────────────────────────────────────────────────────────────────

function buildPdfHtml(
  profileName: string,
  profileAge: number,
  globalStats: { totalSessions: number; totalMinutes: number; avgScore: number },
  gameStats: GameStat[],
  config: ParentConfig,
  date: string,
): string {
  const gameRows = gameStats.map((g) => `
    <tr>
      <td>${GAME_LABEL[g.gameId] ?? g.gameId}</td>
      <td>${WORLD_LABEL[g.world as World] ?? g.world}</td>
      <td>${g.sessions}</td>
      <td>${g.avgScore}%</td>
      <td>${g.bestScore}%</td>
      <td>${g.totalMinutes} min</td>
      <td>Nivel ${g.lastLevel}</td>
    </tr>
  `).join('');

  const worldsHtml = config.worldsEnabled.map((w) => WORLD_LABEL[w]).join(', ');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<style>
  body { font-family: Arial, sans-serif; color: #222; padding: 32px; }
  h1 { color: #1565C0; font-size: 28px; margin-bottom: 4px; }
  h2 { color: #333; font-size: 18px; margin: 24px 0 8px; border-bottom: 2px solid #E3F2FD; padding-bottom: 4px; }
  .meta { color: #777; font-size: 13px; margin-bottom: 24px; }
  .summary { display: flex; gap: 24px; margin-bottom: 16px; }
  .stat-box { background: #E3F2FD; border-radius: 10px; padding: 12px 20px; text-align: center; }
  .stat-val { font-size: 32px; font-weight: bold; color: #1565C0; }
  .stat-lbl { font-size: 12px; color: #555; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { background: #1565C0; color: #fff; padding: 8px 10px; text-align: left; }
  td { padding: 7px 10px; border-bottom: 1px solid #EEE; }
  tr:nth-child(even) td { background: #F5F9FF; }
  .footer { margin-top: 32px; font-size: 11px; color: #AAA; text-align: center; }
</style>
</head>
<body>
  <h1>🌿 Sierrita — Reporte de progreso</h1>
  <p class="meta">
    Alumno: <strong>${profileName}</strong> · Edad: ${profileAge} años<br/>
    Generado el: ${date} · Mundos activos: ${worldsHtml} · Límite de sesión: ${config.maxSessionMinutes} min
  </p>

  <h2>Resumen global</h2>
  <div class="summary">
    <div class="stat-box"><div class="stat-val">${globalStats.totalSessions}</div><div class="stat-lbl">partidas jugadas</div></div>
    <div class="stat-box"><div class="stat-val">${globalStats.totalMinutes}</div><div class="stat-lbl">minutos jugados</div></div>
    <div class="stat-box"><div class="stat-val">${globalStats.avgScore}%</div><div class="stat-lbl">promedio general</div></div>
  </div>

  <h2>Detalle por juego</h2>
  ${gameStats.length === 0
    ? '<p style="color:#AAA">Sin partidas registradas aún.</p>'
    : `<table>
    <thead>
      <tr>
        <th>Juego</th><th>Mundo</th><th>Partidas</th><th>Promedio</th><th>Mejor</th><th>Tiempo</th><th>Nivel</th>
      </tr>
    </thead>
    <tbody>${gameRows}</tbody>
  </table>`}

  <p class="footer">Generado por Sierrita — App educativa para niños de 4 a 6 años</p>
</body>
</html>`;
}

// ── Change PIN Modal ──────────────────────────────────────────────────────────

function ChangePinModal({
  currentHash,
  onSave,
  onCancel,
}: {
  currentHash: string;
  onSave: (newHash: string) => void;
  onCancel: () => void;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext]       = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep]       = useState<'verify' | 'new' | 'confirm'>('verify');
  const [error, setError]     = useState('');

  // If no PIN set, skip verify step
  const skipVerify = currentHash === '';

  useEffect(() => {
    if (skipVerify) setStep('new');
  }, [skipVerify]);

  function advance() {
    setError('');
    if (step === 'verify') {
      if (hashPin(current) !== currentHash) { setError('PIN incorrecto'); setCurrent(''); return; }
      setStep('new');
    } else if (step === 'new') {
      if (next.length < 4) { setError('Mínimo 4 dígitos'); return; }
      setStep('confirm');
    } else {
      if (next !== confirm) { setError('No coinciden'); setConfirm(''); return; }
      onSave(hashPin(next));
    }
  }

  const prompts: Record<string, string> = {
    verify:  'Ingresá tu PIN actual',
    new:     'Nuevo PIN (mínimo 4 dígitos)',
    confirm: 'Repetí el nuevo PIN',
  };
  const value = step === 'verify' ? current : step === 'new' ? next : confirm;
  const setValue = step === 'verify' ? setCurrent : step === 'new' ? setNext : setConfirm;

  return (
    <View style={modalStyles.overlay}>
      <View style={modalStyles.box}>
        <Text style={modalStyles.title}>🔐 Cambiar PIN</Text>
        <Text style={modalStyles.label}>{prompts[step]}</Text>
        <TextInput
          style={modalStyles.input}
          value={value}
          onChangeText={setValue}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={6}
          autoFocus
        />
        {error !== '' && <Text style={modalStyles.error}>{error}</Text>}
        <View style={modalStyles.btnRow}>
          <TouchableOpacity style={modalStyles.cancelBtn} onPress={onCancel}>
            <Text style={modalStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={modalStyles.saveBtn} onPress={advance}>
            <Text style={modalStyles.saveText}>
              {step === 'confirm' ? 'Guardar' : 'Siguiente →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

type Screen = 'stats' | 'settings';
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ParentsScreen() {
  const navigation   = useNavigation<Nav>();
  const profile      = useAtomValue(activeProfileAtom);
  const profileId    = useAtomValue(activeProfileIdAtom);

  const [parentConfig, setParentConfig]   = useState<ParentConfig | null>(null);
  const [globalStats, setGlobalStats]     = useState<{ totalSessions: number; totalMinutes: number; avgScore: number } | null>(null);
  const [gameStats, setGameStats]         = useState<GameStat[]>([]);
  const [loading, setLoading]             = useState(true);
  const [unlocked, setUnlocked]           = useState(false);
  const [activeScreen, setActiveScreen]   = useState<Screen>('stats');
  const [showChangePIN, setShowChangePIN] = useState(false);
  const [exporting, setExporting]         = useState(false);

  // Load config from SQLite
  useEffect(() => {
    if (!profileId) return;
    (async () => {
      const [cfg, gs, gst] = await Promise.all([
        getParentConfig(profileId),
        getProfileStats(profileId),
        getGameStats(profileId),
      ]);
      setParentConfig(cfg);
      setGlobalStats(gs);
      setGameStats(gst);
      setLoading(false);
    })();
  }, [profileId]);

  const handleUnlock = useCallback(async (pin: string) => {
    if (!parentConfig || !profileId) return;
    // First time: save the hash
    if (parentConfig.pinHash === '') {
      const updated: ParentConfig = {
        ...parentConfig,
        pinHash: hashPin(pin),
        updatedAt: Date.now(),
      };
      await upsertParentConfig(updated);
      setParentConfig(updated);
    }
    setUnlocked(true);
  }, [parentConfig, profileId]);

  const handleConfigChange = useCallback(async (updated: ParentConfig) => {
    setParentConfig(updated);
    await upsertParentConfig(updated);
  }, []);

  const handleChangePIN = useCallback(async (newHash: string) => {
    if (!parentConfig) return;
    const updated: ParentConfig = { ...parentConfig, pinHash: newHash, updatedAt: Date.now() };
    await upsertParentConfig(updated);
    setParentConfig(updated);
    setShowChangePIN(false);
    Alert.alert('PIN actualizado', 'Tu nuevo PIN fue guardado correctamente.');
  }, [parentConfig]);

  const handleExportPDF = useCallback(async () => {
    if (!profile || !parentConfig || !globalStats) return;
    setExporting(true);
    try {
      const date = new Date().toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      });
      const html = buildPdfHtml(
        profile.name,
        profile.age,
        globalStats,
        gameStats,
        parentConfig,
        date,
      );
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Reporte de ${profile.name}`,
        });
      } else {
        Alert.alert('PDF generado', `Guardado en: ${uri}`);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo generar el PDF.');
    } finally {
      setExporting(false);
    }
  }, [profile, parentConfig, globalStats, gameStats]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!parentConfig) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se encontró configuración. Seleccioná un perfil.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!unlocked) {
    return (
      <PinScreen
        isSetup={parentConfig.pinHash === ''}
        storedHash={parentConfig.pinHash}
        onSuccess={handleUnlock}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.headerClose}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zona de Padres</Text>
        <TouchableOpacity onPress={() => setUnlocked(false)} hitSlop={12}>
          <Text style={styles.headerLock}>🔒</Text>
        </TouchableOpacity>
      </View>

      {/* Profile info */}
      <View style={styles.profileBanner}>
        <Text style={styles.profileName}>{profile?.name}</Text>
        <Text style={styles.profileAge}>{profile?.age} años</Text>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeScreen === 'stats' && styles.tabActive]}
          onPress={() => setActiveScreen('stats')}
        >
          <Text style={[styles.tabText, activeScreen === 'stats' && styles.tabTextActive]}>
            📊 Estadísticas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeScreen === 'settings' && styles.tabActive]}
          onPress={() => setActiveScreen('settings')}
        >
          <Text style={[styles.tabText, activeScreen === 'settings' && styles.tabTextActive]}>
            ⚙️ Configuración
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {activeScreen === 'stats' && globalStats && (
          <StatsSection globalStats={globalStats} gameStats={gameStats} />
        )}

        {activeScreen === 'settings' && (
          <SettingsSection config={parentConfig} onChange={handleConfigChange} />
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.pdfBtn]}
            onPress={handleExportPDF}
            disabled={exporting}
          >
            {exporting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.actionBtnText}>📄 Descargar informe PDF</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.pinBtn]}
            onPress={() => setShowChangePIN(true)}
          >
            <Text style={styles.actionBtnText}>🔐 Cambiar PIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.switchBtn]}
            onPress={() => navigation.navigate('ProfileSelect')}
          >
            <Text style={styles.actionBtnText}>🔄 Cambiar de perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showChangePIN && (
        <ChangePinModal
          currentHash={parentConfig.pinHash}
          onSave={handleChangePIN}
          onCancel={() => setShowChangePIN(false)}
        />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F5F9FF' },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText:     { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 12 },
  linkText:      { fontSize: 16, color: '#2196F3', fontWeight: '700' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 56,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#1565C0',
  },
  headerClose: { fontSize: 22, color: '#fff', fontWeight: '700' },
  headerTitle: { fontSize: 18, color: '#fff', fontWeight: '800' },
  headerLock:  { fontSize: 22 },
  profileBanner: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  profileName: { fontSize: 22, fontWeight: '900', color: '#fff' },
  profileAge:  { fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1565C0',
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive:     { borderBottomColor: '#FFF' },
  tabText:       { fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
  tabTextActive: { color: '#fff' },
  scroll:        { flex: 1 },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 40 },
  actionsSection: { gap: 12 },
  actionBtn: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  pdfBtn:        { backgroundColor: '#0277BD' },
  pinBtn:        { backgroundColor: '#4A148C' },
  switchBtn:     { backgroundColor: '#2E7D32' },
  actionBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});

const pinStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  closeBtn: { position: 'absolute', top: 56, right: 24 },
  closeText: { fontSize: 24, color: '#1565C0', fontWeight: '700' },
  lockEmoji: { fontSize: 72, marginBottom: 16 },
  title:     { fontSize: 24, fontWeight: '800', color: '#1565C0', marginBottom: 8, textAlign: 'center' },
  subtitle:  { fontSize: 15, color: '#666', marginBottom: 20, textAlign: 'center' },
  pinInput: {
    borderWidth: 3,
    borderColor: '#2196F3',
    borderRadius: 16,
    padding: 16,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    width: 180,
    marginBottom: 16,
    letterSpacing: 8,
    backgroundColor: '#fff',
  },
  error: { color: '#F44336', fontWeight: '700', marginBottom: 12, fontSize: 15 },
  btn:   { backgroundColor: '#2196F3', borderRadius: 16, paddingHorizontal: 32, paddingVertical: 14 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
});

const sectionStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title:     { fontSize: 18, fontWeight: '800', color: '#1565C0', marginBottom: 14 },
  statRow:   { flexDirection: 'row', gap: 10, marginBottom: 10 },
  statBox: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 28, fontWeight: '900', color: '#1565C0' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2, fontWeight: '600' },
  expandBtn: { alignSelf: 'center', marginTop: 4 },
  expandText: { color: '#1976D2', fontWeight: '700', fontSize: 14 },
  worldBlock: { marginTop: 14 },
  worldLabel: { fontSize: 15, fontWeight: '800', color: '#333', marginBottom: 6 },
  gameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4FF',
  },
  gameName:  { fontSize: 14, color: '#333', flex: 1 },
  gameStat:  { fontSize: 13, color: '#888', fontWeight: '600' },
  settingLabel: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 10 },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  timeChipSelected: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  timeChipText:     { fontSize: 14, fontWeight: '700', color: '#1565C0' },
  timeChipTextSelected: { color: '#fff' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4FF',
  },
  switchLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
});

const modalStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    elevation: 10,
  },
  title:  { fontSize: 20, fontWeight: '800', color: '#4A148C', marginBottom: 16, textAlign: 'center' },
  label:  { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 10, textAlign: 'center' },
  input: {
    borderWidth: 2,
    borderColor: '#9C27B0',
    borderRadius: 14,
    padding: 14,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 10,
  },
  error:  { color: '#F44336', fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#EEE',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#7B1FA2',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontWeight: '700', color: '#555' },
  saveText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
});
