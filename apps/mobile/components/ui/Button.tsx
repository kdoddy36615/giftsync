import React from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native'
import { colors } from '../../lib/constants/colors'

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        pressed && styles[`${variant}Pressed`],
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#fff' : colors.text}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`${variant}Text`],
            styles[`size_${size}Text`],
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  // Variants
  primary: {
    backgroundColor: colors.accent,
  },
  primaryPressed: {
    backgroundColor: colors.accentPressed,
  },
  primaryText: {
    color: '#fff',
  },

  secondary: {
    backgroundColor: colors.border,
  },
  secondaryPressed: {
    backgroundColor: colors.borderLight,
  },
  secondaryText: {
    color: colors.text,
  },

  danger: {
    backgroundColor: colors.danger,
  },
  dangerPressed: {
    backgroundColor: '#b91c1c',
  },
  dangerText: {
    color: '#fff',
  },

  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  ghostPressed: {
    backgroundColor: colors.border,
  },
  ghostText: {
    color: colors.text,
  },

  // Sizes
  size_sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  size_smText: {
    fontSize: 12,
    fontWeight: '600',
  },

  size_md: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  size_mdText: {
    fontSize: 14,
    fontWeight: '600',
  },

  size_lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  size_lgText: {
    fontSize: 16,
    fontWeight: '600',
  },

  text: {
    textAlign: 'center',
  },

  disabled: {
    opacity: 0.5,
  },
})
