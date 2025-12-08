import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../lib/constants/colors'

export type BadgeVariant = 'required' | 'optional' | 'purchased' | 'highValue'

export interface BadgeProps {
  variant: BadgeVariant
  style?: ViewStyle
}

const variantConfig: Record<BadgeVariant, { label: string; bg: string; text: string }> = {
  required: {
    label: 'Required',
    bg: 'rgba(99, 102, 241, 0.2)',
    text: colors.accent,
  },
  optional: {
    label: 'Optional',
    bg: colors.border,
    text: colors.textMuted,
  },
  purchased: {
    label: 'Purchased',
    bg: 'rgba(16, 185, 129, 0.2)',
    text: colors.success,
  },
  highValue: {
    label: 'High Value',
    bg: 'rgba(245, 158, 11, 0.2)',
    text: colors.warning,
  },
}

export function Badge({ variant, style }: BadgeProps) {
  const config = variantConfig[variant]

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={config.label}
    >
      <Text style={[styles.text, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
})
