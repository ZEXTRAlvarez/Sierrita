import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './PetRenameModal.styles';

export interface PetRenameModalProps {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function PetRenameModal({ initialName, onSave, onCancel }: PetRenameModalProps) {
  const [name, setName] = useState(initialName);

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.title}>✏️ Nombre de tu mascota</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Escribí un nombre"
          maxLength={20}
          autoFocus
        />
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(name)}>
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
