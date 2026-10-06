import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Canvas, Path, Circle, Rect, Skia } from '@shopify/react-native-skia';
import type { GestureResponderEvent } from 'react-native';
import type { Checkpoint, LetterDef, Point } from '@sierrita/games';
import { checkStrokePoint, sampleSvgPath } from '@sierrita/games';

interface Props {
  size: number;
  letterDef: LetterDef;
  showGuide: boolean;
  guideOpacity?: number;
  useCursive?: boolean;
  /** Every checkpoint was reached, in order — the trazo is done. */
  onComplete: () => void;
  /** The trazo strayed off the guide, or hit a checkpoint out of turn — it's wrong. */
  onTrackLost: (reason: 'off-path' | 'out-of-order') => void;
}

type Status = 'active' | 'lost' | 'complete';

// Grosores en unidades del espacio 0-100 del lienzo (se multiplican por
// `scale`). Gruesos a propósito: los niños pequeños necesitan una guía y un
// trazo bien visibles.
const GUIDE_STROKE_WIDTH = 12;
const DRAWN_STROKE_WIDTH = 10;

const COLOR_DRAWN = '#1565C0';
const COLOR_LOST = '#E53935';
const COLOR_COMPLETE = '#2E9E44';
const COMPLETE_GUIDE_COLOR = 'rgba(46, 158, 68, 0.35)';

export default function LetterCanvas({
  size,
  letterDef,
  showGuide,
  guideOpacity = 0.4,
  useCursive = false,
  onComplete,
  onTrackLost,
}: Props) {
  const isCursive = useCursive && !!letterDef.cursivePath;
  const rawGuidePath = isCursive
    ? (letterDef.cursivePath as string)
    : letterDef.guidePath;
  const checkpoints: Checkpoint[] =
    (isCursive && letterDef.cursiveCheckpoints) || letterDef.checkpoints;

  const [drawnSegments, setDrawnSegments] = useState<Point[][]>([]);
  const [hitMap, setHitMap] = useState<boolean[]>(() =>
    checkpoints.map(() => false),
  );
  const [status, setStatus] = useState<Status>('active');
  const statusRef = useRef<Status>('active');
  const hitMapRef = useRef<boolean[]>(hitMap);
  const currentStroke = useRef<Point[]>([]);

  const scale = size / 100;

  // Guide path in its own 0-100 space, sampled once for off-path distance
  // checks — kept separate from the scaled Skia path below so it only
  // recomputes when the letter/variant actually changes.
  const guideSubpaths = useMemo(
    () => sampleSvgPath(rawGuidePath),
    [rawGuidePath],
  );

  const scaledGuideSvg = useMemo(
    () => scaleSvgPath(rawGuidePath, scale),
    [rawGuidePath, scale],
  );
  const guidePath = useMemo(() => {
    try {
      return Skia.Path.MakeFromSVGString(scaledGuideSvg) ?? undefined;
    } catch {
      return undefined;
    }
  }, [scaledGuideSvg]);

  const evaluatePoint = useCallback(
    (point: Point) => {
      if (statusRef.current !== 'active') return;

      const result = checkStrokePoint(
        point,
        checkpoints,
        hitMapRef.current,
        size,
        guideSubpaths,
      );

      if (result.failed) {
        statusRef.current = 'lost';
        setStatus('lost');
        onTrackLost(result.reason ?? 'off-path');
        return;
      }

      if (result.advanced) {
        hitMapRef.current = result.newHitMap;
        setHitMap(result.newHitMap);
        if (result.newHitMap.every(Boolean)) {
          statusRef.current = 'complete';
          setStatus('complete');
          onComplete();
        }
      }
    },
    [checkpoints, size, guideSubpaths, onComplete, onTrackLost],
  );

  const handleTouchStart = useCallback(
    (evt: GestureResponderEvent) => {
      if (statusRef.current !== 'active') return;
      const { locationX, locationY } = evt.nativeEvent;
      const point: Point = { x: locationX, y: locationY };
      currentStroke.current = [point];
      setDrawnSegments((prev) => [...prev, [point]]);
      evaluatePoint(point);
    },
    [evaluatePoint],
  );

  const handleTouchMove = useCallback(
    (evt: GestureResponderEvent) => {
      if (statusRef.current !== 'active') return;
      const { locationX, locationY } = evt.nativeEvent;
      const point: Point = { x: locationX, y: locationY };
      currentStroke.current.push(point);

      setDrawnSegments((prev) => {
        if (prev.length === 0) return [[point]];
        const next = [...prev];
        next[next.length - 1] = [...currentStroke.current];
        return next;
      });

      evaluatePoint(point);
    },
    [evaluatePoint],
  );

  const handleTouchEnd = useCallback(() => {
    currentStroke.current = [];
  }, []);

  const buildStrokePath = (points: Point[]) => {
    if (points.length < 2) return null;
    const p = Skia.Path.Make();
    p.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      p.lineTo(points[i].x, points[i].y);
    }
    return p;
  };

  const isComplete = status === 'complete';
  const strokeColor =
    status === 'lost' ? COLOR_LOST : isComplete ? COLOR_COMPLETE : COLOR_DRAWN;
  const guideColor = isComplete
    ? COMPLETE_GUIDE_COLOR
    : `rgba(120, 180, 120, ${guideOpacity})`;
  const borderColor = isComplete
    ? COLOR_COMPLETE
    : status === 'lost'
      ? COLOR_LOST
      : '#C8E6C9';

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderColor },
        isComplete && styles.containerComplete,
      ]}
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
        {(showGuide || isComplete) && guidePath && (
          <Path
            path={guidePath}
            color={guideColor}
            style="stroke"
            strokeWidth={GUIDE_STROKE_WIDTH * scale}
            strokeCap="round"
            strokeJoin="round"
          />
        )}

        {/* Checkpoint circles — the next one expected stands out so the
            child knows which numbered point to go for. */}
        {checkpoints.map((cp, i) => {
          const nextIndex = hitMap.findIndex((hit) => !hit);
          const isHit = hitMap[i];
          const isNext = !isHit && i === nextIndex;
          const color = isHit
            ? 'rgba(76, 175, 80, 0.85)'
            : isNext
              ? 'rgba(255, 193, 7, 0.65)'
              : 'rgba(200, 230, 200, 0.55)';
          return (
            <Circle
              key={i}
              cx={cp.x * scale}
              cy={cp.y * scale}
              r={cp.r * scale * (isNext ? 0.65 : 0.55)}
              color={color}
            />
          );
        })}

        {/* Drawn strokes */}
        {drawnSegments.map((pts, idx) => {
          const p = buildStrokePath(pts);
          if (!p) return null;
          return (
            <Path
              key={idx}
              path={p}
              color={strokeColor}
              style="stroke"
              strokeWidth={DRAWN_STROKE_WIDTH * scale}
              strokeCap="round"
              strokeJoin="round"
            />
          );
        })}
      </Canvas>

      {/* Checkpoint numbers overlay — plain RN Text so we don't need to
          load a font into Skia just to label a dozen small circles. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {checkpoints.map((cp, i) => {
          if (hitMap[i]) return null;
          const badgeSize = Math.max(26, cp.r * scale * 0.9);
          return (
            <View
              key={i}
              style={[
                styles.numberBadge,
                {
                  width: badgeSize,
                  height: badgeSize,
                  left: cp.x * scale - badgeSize / 2,
                  top: cp.y * scale - badgeSize / 2,
                },
              ]}
            >
              <Text style={styles.numberText}>{i + 1}</Text>
            </View>
          );
        })}
      </View>
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
    borderWidth: 4,
    borderColor: '#C8E6C9',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  containerComplete: {
    shadowColor: COLOR_COMPLETE,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  numberBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1B5E20',
  },
});
