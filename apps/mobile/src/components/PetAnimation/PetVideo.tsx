import { View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView, type VideoSource } from 'expo-video';

export function PetVideo({
  source,
  size,
}: {
  source: VideoSource;
  size: number;
}) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View
      style={[
        styles.frame,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <VideoView
        style={{ width: size, height: size }}
        player={player}
        // "cover" hace zoom para llenar el marco circular y evita las
        // franjas negras que dejaba "contain" con el video 16:9 original.
        contentFit="cover"
        nativeControls={false}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', backgroundColor: 'transparent' },
});
