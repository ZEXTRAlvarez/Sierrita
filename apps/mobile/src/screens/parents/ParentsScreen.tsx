import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';
import { colorTokens } from '@sierrita/ui';
import { useParentDashboard } from './hooks/useParentDashboard';
import { PinGate } from './components/PinGate';
import { ParentsHeader } from './components/ParentsHeader';
import { ParentsTabBar } from './components/ParentsTabBar';
import type { ParentsTab } from './components/ParentsTabBar';
import { StatsSection } from './components/StatsSection';
import { SettingsSection } from './components/SettingsSection';
import { ChangePinModal } from './components/ChangePinModal';
import { ParentsActions } from './components/ParentsActions';
import { FeedbackModal } from './components/FeedbackModal';
import { styles } from './ParentsScreen.styles';

const PLAY_STORE_ID = 'com.rodaalvarez.sierrita';
const FEEDBACK_EMAIL = 'rodaaa18@gmail.com';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ParentsScreen() {
  const navigation = useNavigation<Nav>();
  const dashboard = useParentDashboard();
  const {
    profile,
    parentConfig,
    globalStats,
    gameStats,
    learningGoal,
    weeklyProgress,
    loading,
    exporting,
  } = dashboard;

  const [unlocked, setUnlocked] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ParentsTab>('stats');
  const [showChangePIN, setShowChangePIN] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  async function handleUnlock(pin: string) {
    await dashboard.unlock(pin);
    setUnlocked(true);
  }

  async function handleChangePIN(newHash: string) {
    await dashboard.changePin(newHash);
    setShowChangePIN(false);
    Alert.alert('PIN actualizado', 'Tu nuevo PIN fue guardado correctamente.');
  }

  async function handleExportPDF() {
    const result = await dashboard.exportPdf();
    if (!result.ok) {
      Alert.alert('Error', 'No se pudo generar el PDF.');
    } else if (!result.shared) {
      Alert.alert('PDF generado', `Guardado en: ${result.uri}`);
    }
  }

  async function handleRateApp() {
    const androidUrl = `market://details?id=${PLAY_STORE_ID}`;
    const fallbackUrl = `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`;
    try {
      const canOpen = await Linking.canOpenURL(androidUrl);
      await Linking.openURL(canOpen ? androidUrl : fallbackUrl);
    } catch {
      await Linking.openURL(fallbackUrl);
    }
  }

  async function handleSendFeedback(text: string) {
    const subject = encodeURIComponent('Feedback Sierrita');
    const body = encodeURIComponent(text);
    const url = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
    setShowFeedback(false);
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) throw new Error('no-mail-app');
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'No se encontró una app de correo',
        `Escribinos a ${FEEDBACK_EMAIL} desde tu app de mail preferida.`,
      );
    }
  }

  if (loading) {
    return (
      <View style={styles.center} testID="parents-screen-loading">
        <ActivityIndicator size="large" color={colorTokens.worldOcean} />
      </View>
    );
  }

  if (!parentConfig) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          No se encontró configuración. Seleccioná un perfil.
        </Text>
        <Text style={styles.linkText} onPress={() => navigation.goBack()}>
          ← Volver
        </Text>
      </View>
    );
  }

  if (!unlocked) {
    return (
      <PinGate
        isSetup={parentConfig.pinHash === ''}
        storedHash={parentConfig.pinHash}
        onSuccess={handleUnlock}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ParentsHeader
        profileName={profile?.name}
        profileAge={profile?.age}
        onClose={() => navigation.goBack()}
        onLock={() => setUnlocked(false)}
      />
      <ParentsTabBar active={activeScreen} onChange={setActiveScreen} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {activeScreen === 'stats' && globalStats && (
          <StatsSection
            globalStats={globalStats}
            gameStats={gameStats}
            weeklyProgress={weeklyProgress}
          />
        )}
        {activeScreen === 'settings' && (
          <SettingsSection
            config={parentConfig}
            onChange={dashboard.updateConfig}
            goalTarget={learningGoal?.targetSessionsPerWeek ?? null}
            onChangeGoal={dashboard.updateGoal}
          />
        )}
        <ParentsActions
          exporting={exporting}
          onExportPdf={handleExportPDF}
          onChangePin={() => setShowChangePIN(true)}
          onSwitchProfile={() => navigation.navigate('ProfileSelect')}
          onRateApp={handleRateApp}
          onSendFeedback={() => setShowFeedback(true)}
        />
      </ScrollView>
      {showChangePIN && (
        <ChangePinModal
          currentHash={parentConfig.pinHash}
          onSave={handleChangePIN}
          onCancel={() => setShowChangePIN(false)}
        />
      )}
      {showFeedback && (
        <FeedbackModal
          onSend={handleSendFeedback}
          onCancel={() => setShowFeedback(false)}
        />
      )}
    </View>
  );
}
