import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { hashPin, verifyPin } from '@sierrita/parents';
import { styles } from './ChangePinModal.styles';

export interface ChangePinModalProps {
  currentHash: string;
  onSave: (newHash: string) => void;
  onCancel: () => void;
}

type Step = 'verify' | 'new' | 'confirm';

const PROMPTS: Record<Step, string> = {
  verify: 'Ingresá tu PIN actual',
  new: 'Nuevo PIN (mínimo 4 dígitos)',
  confirm: 'Repetí el nuevo PIN',
};

export function ChangePinModal({
  currentHash,
  onSave,
  onCancel,
}: ChangePinModalProps) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState<Step>('verify');
  const [error, setError] = useState('');

  const skipVerify = currentHash === '';

  useEffect(() => {
    if (skipVerify) setStep('new');
  }, [skipVerify]);

  async function advance() {
    setError('');
    if (step === 'verify') {
      const valid = await verifyPin(current, currentHash);
      if (!valid) {
        setError('PIN incorrecto');
        setCurrent('');
        return;
      }
      setStep('new');
    } else if (step === 'new') {
      if (next.length < 4) {
        setError('Mínimo 4 dígitos');
        return;
      }
      setStep('confirm');
    } else {
      if (next !== confirm) {
        setError('No coinciden');
        setConfirm('');
        return;
      }
      onSave(await hashPin(next));
    }
  }

  const value = step === 'verify' ? current : step === 'new' ? next : confirm;
  const setValue =
    step === 'verify' ? setCurrent : step === 'new' ? setNext : setConfirm;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.title}>🔐 Cambiar PIN</Text>
        <Text style={styles.label}>{PROMPTS[step]}</Text>
        <TextInput
          testID="change-pin-input"
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={6}
          autoFocus
        />
        {error !== '' && <Text style={styles.error}>{error}</Text>}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={advance}>
            <Text style={styles.saveText}>
              {step === 'confirm' ? 'Guardar' : 'Siguiente →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
