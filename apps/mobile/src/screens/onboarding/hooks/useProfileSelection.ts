import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation';
import { useProfiles } from '../../../hooks/useProfiles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProfileSelect'>;

/** Profile list + the select/delete actions (delete goes through a confirmation alert). */
export function useProfileSelection() {
  const navigation = useNavigation<Nav>();
  const { profiles, selectProfile, removeProfile } = useProfiles();

  function handleSelect(id: string) {
    selectProfile(id);
    // 'Main' solo se registra en el Stack una vez que activeProfileId pasa a
    // ser verdadero (ver navigation/index.tsx). Si se navega en el mismo tick,
    // React todavía no re-renderizó el navigator y la acción falla con
    // "was not handled by any navigator" — se difiere al próximo tick.
    setTimeout(() => navigation.replace('Main'), 0);
  }

  function handleDelete(id: string, name: string) {
    Alert.alert(
      'Borrar perfil',
      `¿Querés borrar el perfil de ${name}? Se perderá todo su progreso.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => removeProfile(id),
        },
      ],
    );
  }

  return { navigation, profiles, handleSelect, handleDelete };
}
