import { Colors, Radii, Typography } from '@/constants/theme';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AvatarProps {
  /** URI for the avatar image. Falls back to initials when not provided. */
  source?: string;
  /** Full name used to derive initials when no image is available. */
  name?: string;
  /** Size variant. Default: 'md' */
  size?: AvatarSize;
  /** Shape variant. Default: 'circle' */
  shape?: AvatarShape;
  style?: ViewStyle;
}

// ─── Size Map ─────────────────────────────────────────────────────────────────

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 52,
  xl: 72,
};

const fontSizes: Record<AvatarSize, number> = {
  xs: 9,
  sm: 12,
  md: 15,
  lg: 20,
  xl: 26,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derives up to two uppercase initials from a full name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === '') return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Derives a stable background color from a name string. */
function getColorFromName(name: string): string {
  const palette = [
    '#1E3A8A', // primary
    '#0E7490', // cyan
    '#0369A1', // blue
    '#6D28D9', // violet
    '#7C3AED', // purple
    '#065F46', // emerald
    '#92400E', // amber
    '#9D174D', // rose
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Avatar — displays a user image or falls back to derived initials.
 *
 * @example
 * <Avatar source="https://…" size="md" />
 * <Avatar name="John Doe" size="lg" />
 * <Avatar name="Support Bot" shape="rounded" size="sm" />
 */
export function Avatar({ source, name = '', size = 'md', shape = 'circle', style }: AvatarProps) {
  const dimension = sizeMap[size];
  const fontSize = fontSizes[size];
  const borderRadius = shape === 'circle' ? dimension / 2 : Radii.md;
  const initials = getInitials(name);
  const bgColor = name ? getColorFromName(name) : Colors.textTertiary;

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius,
    overflow: 'hidden',
  };

  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={{ uri: source }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, { backgroundColor: bgColor }, style]}>
      <View style={styles.initialsContainer}>
        <Text style={[styles.initialsText, { fontSize, lineHeight: dimension }]}>
          {initials}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  initialsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: Colors.textInverse,
    fontWeight: '600',
    textAlign: 'center',
  },
});
