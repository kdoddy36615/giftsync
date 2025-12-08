import React from 'react'
import { Pressable, StyleSheet, ViewStyle } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { colors } from '../../lib/constants/colors'

export interface FABProps {
  onPress: () => void
  icon?: keyof typeof FontAwesome.glyphMap
  style?: ViewStyle
  accessibilityLabel?: string
}

export function FAB({
  onPress,
  icon = 'plus',
  style,
  accessibilityLabel = 'Add',
}: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        pressed && styles.fabPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <FontAwesome name={icon} size={24} color="#fff" />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  fabPressed: {
    backgroundColor: colors.accentPressed,
    transform: [{ scale: 0.95 }],
  },
})
