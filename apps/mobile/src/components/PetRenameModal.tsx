import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

export function PetRenameModal({
  initialName,
  onSave,
  onCancel,
}: {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
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

const styles = StyleSheet.create({
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
  title: { fontSize: 20, fontWeight: '800', color: '#FF6F00', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 2,
    borderColor: '#FF6F00',
    borderRadius: 14,
    padding: 14,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#EEE',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  cancelText: { color: '#777', fontWeight: '800', fontSize: 15 },
  saveBtn: {
    flex: 1,
    backgroundColor: '#FF6F00',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
