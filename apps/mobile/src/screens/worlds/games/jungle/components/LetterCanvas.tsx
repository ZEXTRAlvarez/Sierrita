import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Path, Circle, Rect, Skia } from '@shopify/react-native-skia';
import type { GestureResponderEvent } from 'react-native';
import type { LetterDef } from '@sierrita/games';
import type { Point } from '@sierrita/games';
import { checkNewPoint } from '@sierrita/games';

interface Props {
  size: number;
  letterDef: LetterDef;
  showGuide: boolean;
  guideOpacity?: number;
  useCursive?: boolean;
  hitMap: boolean[];
  onPointDrawn: (point: Point, newHitMap: boolean[]) => void;
  onStrokeEnd: (points: Point[]) => void;
}

export default function LetterCanvas({
  size,
  letterDef,
  showGuide,
  guideOpacity = 0.4,
  useCursive = false,
  hitMap,
  onPointDrawn,
  onStrokeEnd,
}: Props) {
  const [drawnSegments, setDrawnSegments] = useState<Point[][]>([]);
  const currentStroke = useRef<Point[]>([]);
  const currentHitMap = useRef<boolean[]>(hitMap);

  React.useEffect(() => {
    currentHitMap.current = [...hitMap];
    setDrawnSegments([]);
    currentStroke.current = [];
  }, [hitMap, letterDef]);

  const scale = size / 100;
  const guideSvgPath = useCursive && letterDef.cursivePath
    ? letterDef.cursivePath
    : letterDef.guidePath;

  const scaledGuideSvg = scaleSvgPath(guideSvgPath, scale);
  const guidePath = React.useMemo(() => {
    try {
      return Skia.Path.MakeFromSVGString(scaledGuideSvg) ?? undefined;
    } catch {
      return undefined;
    }
  }, [scaledGuideSvg]);

  const handleTouchStart = useCallback((evt: GestureResponderEvent) => {
    const { locationX, locationY } = evt.nativeEvent;
    currentStroke.current = [{ x: locationX, y: locationY }];
    setDrawnSegments((prev) => [...prev, [{ x: locationX, y: locationY }]]);
  }, []);

  const handleTouchMove = useCallback((evt: GestureResponderEvent) => {
    const { locationX, locationY } = evt.nativeEvent;
    const point: Point = { x: locationX, y: locationY };
    currentStroke.current.push(point);

    const { updated, newHitMap } = checkNewPoint(
      point,
      letterDef.checkpoints,
      currentHitMap.current,
      size,
    );
    if (updated) {
      currentHitMap.current = newHitMap;
      onPointDrawn(point, newHitMap);
    }

    setDrawnSegments((prev) => {
      if (prev.length === 0) return [[point]];
      const next = [...prev];
      next[next.length - 1] = [...currentStroke.current];
      return next;
    });
  }, [letterDef, size, onPointDrawn]);

  const handleTouchEnd = useCallback(() => {
    onStrokeEnd([...currentStroke.current]);
    currentStroke.current = [];
  }, [onStrokeEnd]);

  const buildStrokePath = (points: Point[]) => {
    if (points.length < 2) return null;
    const p = Skia.Path.Make();
    p.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      p.lineTo(points[i].x, points[i].y);
    }
    return p;
  };

  const startHintX = letterDef.startHint.x * scale;
  const startHintY = letterDef.startHint.y * scale;
  const showHint = drawnSegments.length === 0;

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouchStart}
      onResponderMove={handleTouchMove}
      onResponderRelease={handleTouchEnd}
    >
      <Canvas style={{ width: size, height: size }}>
        {/* Background */}
        <Rect x={0} y={0} width={size} height={size} color="#FFF9F0" />

        {/* Guide path */}
        {showGuide && guidePath && (
          <Path
            path={guidePath}
            color={`rgba(120, 180, 120, ${guideOpacity})`}
            style="stroke"
            strokeWidth={6 * scale}
            strokeCap="round"
            strokeJoin="round"
          />
        )}

        {/* Checkpoint circles */}
        {letterDef.checkpoints.map((cp, i) => (
          <Circle
            key={i}
            cx={cp.x * scale}
            cy={cp.y * scale}
            r={cp.r * scale * 0.55}
            color={hitMap[i]
              ? 'rgba(76, 175, 80, 0.85)'
              : 'rgba(200, 230, 200, 0.55)'}
          />
        ))}

        {/* Start hint dot */}
        {showHint && (
          <Circle
            cx={startHintX}
            cy={startHintY}
            r={9 * scale}
            color="rgba(255, 193, 7, 0.9)"
          />
        )}

        {/* Drawn strokes */}
        {drawnSegments.map((pts, idx) => {
          const p = buildStrokePath(pts);
          if (!p) return null;
          return (
            <Path
              key={idx}
              path={p}
              color="#1565C0"
              style="stroke"
              strokeWidth={7 * scale}
              strokeCap="round"
              strokeJoin="round"
            />
          );
        })}
      </Canvas>
    </View>
  );
}

function scaleSvgPath(svgPath: string, scale: number): string {
  return svgPath.replace(/(-?\d+(?:\.\d+)?)/g, (match) =>
    String(Math.round(parseFloat(match) * scale * 10) / 10),
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#C8E6C9',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
