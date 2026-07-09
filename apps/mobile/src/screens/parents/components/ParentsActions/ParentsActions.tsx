import { View, StyleSheet } from 'react-native';
import { PrimaryButton } from '@sierrita/ui';

export interface ParentsActionsProps {
  exporting: boolean;
  onExportPdf: () => void;
  onChangePin: () => void;
  onSwitchProfile: () => void;
}

export function ParentsActions({ exporting, onExportPdf, onChangePin, onSwitchProfile }: ParentsActionsProps) {
  return (
    <View style={styles.container}>
      <PrimaryButton
        label={exporting ? 'Generando…' : '📄 Descargar informe PDF'}
        color="brand"
        onPress={onExportPdf}
        disabled={exporting}
      />
      <PrimaryButton label="🔐 Cambiar PIN" color="purple" onPress={onChangePin} />
      <PrimaryButton label="🔄 Cambiar de perfil" color="success" onPress={onSwitchProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
});
