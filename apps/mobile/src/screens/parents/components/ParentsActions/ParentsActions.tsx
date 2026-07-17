import { View, StyleSheet } from 'react-native';
import { PrimaryButton } from '@sierrita/ui';

export interface ParentsActionsProps {
  exporting: boolean;
  onExportPdf: () => void;
  onChangePin: () => void;
  onSwitchProfile: () => void;
  onRateApp: () => void;
  onSendFeedback: () => void;
}

export function ParentsActions({
  exporting,
  onExportPdf,
  onChangePin,
  onSwitchProfile,
  onRateApp,
  onSendFeedback,
}: ParentsActionsProps) {
  return (
    <View style={styles.container}>
      <PrimaryButton
        label={exporting ? 'Generando…' : '📄 Descargar informe PDF'}
        color="brand"
        onPress={onExportPdf}
        disabled={exporting}
      />
      <PrimaryButton
        label="🔐 Cambiar PIN"
        color="purple"
        onPress={onChangePin}
      />
      <PrimaryButton
        label="🔄 Cambiar de perfil"
        color="success"
        onPress={onSwitchProfile}
      />
      <PrimaryButton
        label="⭐ Valorar la app"
        color="brand"
        onPress={onRateApp}
      />
      <PrimaryButton
        label="✉️ Enviar comentarios"
        color="purple"
        onPress={onSendFeedback}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
});
