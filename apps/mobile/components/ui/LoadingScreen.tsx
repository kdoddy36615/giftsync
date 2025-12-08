import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../lib/constants/colors'

export interface LoadingScreenProps {
  message?: string
  style?: ViewStyle
}

export function LoadingScreen({ message, style }: LoadingScreenProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={colors.accent} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
})
