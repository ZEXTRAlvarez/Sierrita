import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styles } from './FeedbackModal.styles';

export interface FeedbackModalProps {
  onSend: (text: string) => void;
  onCancel: () => void;
}

export function FeedbackModal({ onSend, onCancel }: FeedbackModalProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  function handleSend() {
    if (!text.trim()) {
      setError('Contanos algo antes de enviar');
      return;
    }
    onSend(text.trim());
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.title}>✉️ Enviar comentarios</Text>
        <Text style={styles.label}>
          Contanos qué te parece la app o qué le agregarías
        </Text>
        <TextInput
          testID="feedback-input"
          style={styles.input}
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={4}
          autoFocus
        />
        {error !== '' && <Text style={styles.error}>{error}</Text>}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSend}>
            <Text style={styles.saveText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
