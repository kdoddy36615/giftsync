import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native'
import { colors } from '../../lib/constants/colors'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
  visible: boolean
  message: string
  type?: ToastType
  duration?: number
  onDismiss: () => void
  action?: {
    label: string
    onPress: () => void
  }
}

const typeConfig: Record<ToastType, { borderColor: string; iconColor: string }> = {
  success: {
    borderColor: colors.success,
    iconColor: colors.success,
  },
  error: {
    borderColor: colors.danger,
    iconColor: colors.danger,
  },
  info: {
    borderColor: colors.accent,
    iconColor: colors.accent,
  },
}

export function Toast({
  visible,
  message,
  type = 'info',
  duration = 4000,
  onDismiss,
  action,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 15,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()

      const timer = setTimeout(() => {
        onDismiss()
      }, duration)

      return () => clearTimeout(timer)
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, duration, onDismiss, translateY, opacity])

  if (!visible) return null

  const config = typeConfig[type]

  return (
    <Animated.View
      style={[
        styles.container,
        { borderColor: config.borderColor },
        { transform: [{ translateY }], opacity },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
      {action && (
        <Pressable onPress={action.onPress}>
          <Text style={[styles.action, { color: config.iconColor }]}>
            {action.label}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
  },
})
