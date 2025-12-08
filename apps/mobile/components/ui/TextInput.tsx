import React, { forwardRef } from 'react'
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { colors } from '../../lib/constants/colors'

export interface TextInputProps extends RNTextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, containerStyle, style, ...props }, ref) => {
    return (
      <View style={containerStyle}>
        {label && <Text style={styles.label}>{label}</Text>}
        <RNTextInput
          ref={ref}
          {...props}
          style={[
            styles.input,
            error && styles.inputError,
            props.multiline && styles.multiline,
            style,
          ]}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.accent}
          accessibilityLabel={label}
          accessibilityHint={error}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    )
  }
)

TextInput.displayName = 'TextInput'

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 48,
  },
  inputError: {
    borderColor: colors.danger,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },
})
