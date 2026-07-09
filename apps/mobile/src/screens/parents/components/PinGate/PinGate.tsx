import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { verifyPin } from '@sierrita/parents';
import { colorTokens } from '@sierrita/ui';

export interface PinGateProps {
  isSetup: boolean;
  storedHash: string;
  onSuccess: (pin: string) => void;
}

/** Full-screen PIN lock/setup gate shown before the parents dashboard unlocks. */
export function PinGate({ isSetup, storedHash, onSuccess }: PinGateProps) {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    if (isSetup) {
      if (pin.length < 4) { setError('Mínimo 4 dígitos'); return; }
      if (step === 'enter') { setStep('confirm'); return; }
      if (pin !== confirm) { setError('Los PINs no coinciden'); setConfirm(''); return; }
      onSuccess(pin);
    } else {
      const valid = await verifyPin(pin, storedHash);
      if (!valid) {
        setError('PIN incorrecto');
        setPin('');
      } else {
        onSuccess(pin);
      }
    }
  }

  const title = isSetup ? (step === 'enter' ? 'Creá tu PIN de padre/madre' : 'Repetí el PIN') : 'Zona de Padres';

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.lockEmoji}>{isSetup ? '🔐' : '🔒'}</Text>
      <Text style={styles.title}>{title}</Text>
      {isSetup && <Text style={styles.subtitle}>Este PIN protege la zona de padres</Text>}

      <TextInput
        style={styles.pinInput}
        placeholder="• • • •"
        value={step === 'confirm' ? confirm : pin}
        onChangeText={step === 'confirm' ? setConfirm : setPin}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        autoFocus
      />

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>{isSetup ? (step === 'enter' ? 'Siguiente →' : 'Crear PIN') : 'Ingresar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colorTokens.brand50, justifyContent: 'center', alignItems: 'center', padding: 24 },
  closeBtn: { position: 'absolute', top: 56, right: 24 },
  closeText: { fontSize: 24, color: colorTokens.brand700, fontWeight: '700' },
  lockEmoji: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colorTokens.brand700, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 20, textAlign: 'center' },
  pinInput: {
    borderWidth: 3,
    borderColor: colorTokens.worldOcean,
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
  error: { color: colorTokens.error, fontWeight: '700', marginBottom: 12, fontSize: 15 },
  btn: { backgroundColor: colorTokens.worldOcean, borderRadius: 16, paddingHorizontal: 32, paddingVertical: 14 },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
});
