import React from 'react'
import { Pressable, View, StyleSheet, ViewStyle, PressableProps } from 'react-native'
import { colors } from '../../lib/constants/colors'

export interface CardProps extends Omit<PressableProps, 'style'> {
  accentColor?: string
  selected?: boolean
  completed?: boolean
  children: React.ReactNode
  style?: ViewStyle
}

export function Card({
  accentColor,
  selected = false,
  completed = false,
  children,
  style,
  onPress,
  onLongPress,
  ...props
}: CardProps) {
  const isInteractive = !!onPress || !!onLongPress

  const content = (
    <View
      style={[
        styles.card,
        accentColor && { borderLeftWidth: 4, borderLeftColor: accentColor },
        selected && styles.selected,
        completed && styles.completed,
        style,
      ]}
    >
      {children}
    </View>
  )

  if (!isInteractive) {
    return content
  }

  return (
    <Pressable
      {...props}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [pressed && styles.pressed]}
      accessibilityRole="button"
    >
      {content}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  selected: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  completed: {
    opacity: 0.6,
  },
})
