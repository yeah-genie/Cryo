import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Colors, { radius, spacing, shadows } from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

type CardVariant = 'glass' | 'neon' | 'solid';
type GlowColor = 'orange' | 'mint' | 'purple';

interface GlowCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  glowColor?: GlowColor;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function GlowCard({
  children,
  variant = 'glass',
  glowColor = 'orange',
  style,
  contentStyle,
}: GlowCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const getGlowBorderColor = () => {
    switch (glowColor) {
      case 'mint':
        return colors.tintSecondary;
      case 'purple':
        return colors.tintAccent;
      case 'orange':
      default:
        return colors.tint;
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'solid':
        return colors.backgroundElevated;
      case 'neon':
        return colorScheme === 'dark'
          ? 'rgba(255, 255, 255, 0.04)'
          : 'rgba(0, 0, 0, 0.02)';
      case 'glass':
      default:
        return colors.cardBackground;
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'neon':
        return getGlowBorderColor() + '30';
      case 'solid':
        return colors.border;
      case 'glass':
      default:
        return colors.cardBorder;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        variant === 'neon' && shadows.sm,
        style,
      ]}
    >
      {/* Neon glow effect */}
      {variant === 'neon' && (
        <View style={[styles.glowWrapper, { borderRadius: radius.lg }]}>
          <LinearGradient
            colors={[getGlowBorderColor() + '20', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
      
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

// Gradient Border Card for special occasions
export function GradientBorderCard({
  children,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.gradientBorderContainer, style]}>
      <LinearGradient
        colors={[colors.gradientStart + '40', colors.gradientEnd + '40']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      />
      <View
        style={[
          styles.gradientBorderInner,
          { backgroundColor: colors.backgroundElevated },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  glowWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.lg,
  },
  gradientBorderContainer: {
    borderRadius: radius.lg,
    padding: 1.5,
    overflow: 'hidden',
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBorderInner: {
    borderRadius: radius.lg - 1.5,
    padding: spacing.lg,
  },
});
