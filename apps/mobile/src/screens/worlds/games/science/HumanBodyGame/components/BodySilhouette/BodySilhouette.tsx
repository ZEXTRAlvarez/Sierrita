import { View } from 'react-native';
import { styles, MARKER_SIZE } from './BodySilhouette.styles';

export interface BodySilhouetteProps {
  /** Position of the highlighted marker, in the same 160×320 coordinate space as the silhouette. */
  markerX: number;
  markerY: number;
}

/** A simple human silhouette (head, torso, arms, legs) built from plain Views, with a highlighted marker at the target part. */
export function BodySilhouette({ markerX, markerY }: BodySilhouetteProps) {
  return (
    <View style={styles.container} testID="body-silhouette">
      <View style={styles.head} />
      <View style={styles.torso} />
      <View style={[styles.arm, styles.armLeft]} />
      <View style={[styles.arm, styles.armRight]} />
      <View style={[styles.leg, styles.legLeft]} />
      <View style={[styles.leg, styles.legRight]} />
      <View
        testID="body-marker"
        style={[
          styles.marker,
          {
            left: markerX - MARKER_SIZE / 2,
            top: markerY - MARKER_SIZE / 2,
          },
        ]}
      />
    </View>
  );
}
