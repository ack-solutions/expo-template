import { Colors, Radii } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SkeletonProps {
  /** Explicit pixel width. Defaults to '100%' (full container width). */
  width?: number | `${number}%`;
  /** Height in pixels. Default: 16 */
  height?: number;
  /** Border radius. Default: Radii.sm */
  borderRadius?: number;
  style?: ViewStyle;
}

interface SkeletonTextProps {
  /** Number of lines to render. Default: 3 */
  lines?: number;
  /** Height per line. Default: 14 */
  lineHeight?: number;
  /** Gap between lines. Default: 8 */
  gap?: number;
  /** Shortens the last line to simulate natural text. Default: true */
  shortenLast?: boolean;
}

// ─── Pulse Animation ──────────────────────────────────────────────────────────

const PULSE_MIN = 0.4;
const PULSE_MAX = 0.85;
const PULSE_DURATION = 900;

function usePulse() {
  const opacity = useRef(new Animated.Value(PULSE_MIN)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: PULSE_MAX,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: PULSE_MIN,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return opacity;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

/**
 * Skeleton — animated loading placeholder for a single block.
 *
 * @example
 * <Skeleton width={120} height={120} borderRadius={60} />  // Avatar
 * <Skeleton height={20} />                                  // Title line
 * <Skeleton height={14} width="70%" />                      // Partial line
 */
export function Skeleton({ width = '100%', height = 16, borderRadius = Radii.sm, style }: SkeletonProps) {
  const opacity = usePulse();

  return (
    <Animated.View
      style={[
        styles.block,
        { width: width as ViewStyle['width'], height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

// ─── SkeletonText ─────────────────────────────────────────────────────────────

/**
 * SkeletonText — stack of skeleton lines that mimic a paragraph.
 *
 * @example
 * <SkeletonText lines={4} />
 */
export function SkeletonText({ lines = 3, lineHeight = 14, gap = 8, shortenLast = true }: SkeletonTextProps) {
  const opacity = usePulse();

  return (
    <View style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => {
        const isLast = i === lines - 1;
        const lineWidth = isLast && shortenLast ? '65%' : '100%';
        return (
          <Animated.View
            key={i}
            style={[
              styles.block,
              {
                width: lineWidth as ViewStyle['width'],
                height: lineHeight,
                borderRadius: Radii.sm,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

// ─── SkeletonCard ─────────────────────────────────────────────────────────────

/**
 * SkeletonCard — pre-built card-shaped skeleton (avatar + text lines).
 *
 * @example
 * {isLoading && <SkeletonCard />}
 */
export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={styles.cardText}>
        <Skeleton height={14} width="60%" />
        <Skeleton height={12} width="90%" />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  block: {
    backgroundColor: Colors.borderLight,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  cardText: {
    flex: 1,
    gap: 8,
  },
});
