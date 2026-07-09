import { Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './NameStep.styles';

export interface NameStepProps {
  name: string;
  onChangeName: (name: string) => void;
  onNext: () => void;
}

export function NameStep({ name, onChangeName, onNext }: NameStepProps) {
  return (
    <>
      <Text style={styles.emoji}>👋</Text>
      <Text style={styles.title}>¡Hola! ¿Cómo te llamás?</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu nombre..."
        placeholderTextColor="#AAA"
        value={name}
        onChangeText={onChangeName}
        autoFocus
        maxLength={20}
        returnKeyType="next"
        onSubmitEditing={() => name.trim() && onNext()}
      />
      <TouchableOpacity
        style={[styles.btn, !name.trim() && styles.btnDisabled]}
        onPress={() => name.trim() && onNext()}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>¡Siguiente!</Text>
      </TouchableOpacity>
    </>
  );
}
