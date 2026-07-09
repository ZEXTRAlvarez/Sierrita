import { Text, View } from 'react-native';
import { styles } from './WorldsHeader.styles';

export interface WorldsHeaderProps {
  profileName?: string;
  profileAge?: number;
}

export function WorldsHeader({ profileName, profileAge }: WorldsHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>¡Elegí tu mundo!</Text>
      {profileName && (
        <View style={styles.ageBadge}>
          <Text style={styles.ageBadgeText}>
            {profileName} · {profileAge} años
          </Text>
        </View>
      )}
    </View>
  );
}
