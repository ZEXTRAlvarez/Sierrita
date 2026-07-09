import type { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { styles } from './SectionCard.styles';

export interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Shared "white rounded card with a title" wrapper used across the pet detail sections. */
export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}
