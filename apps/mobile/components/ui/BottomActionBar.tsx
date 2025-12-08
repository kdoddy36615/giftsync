import React from 'react'
import { View, Text, Pressable, StyleSheet, Share, Platform } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { colors } from '../../lib/constants/colors'

interface BottomActionBarProps {
  selectedCount: number
  onMarkPurchased: () => void
  onShareLinks?: () => void
  onCancel: () => void
  loading?: boolean
}

export function BottomActionBar({
  selectedCount,
  onMarkPurchased,
  onShareLinks,
  onCancel,
  loading = false,
}: BottomActionBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.countSection}>
        <Pressable onPress={onCancel} style={styles.cancelButton}>
          <FontAwesome name="times" size={16} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.countText}>
          {selectedCount} selected
        </Text>
      </View>

      <View style={styles.actions}>
        {onShareLinks && (
          <Pressable
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={onShareLinks}
            disabled={loading}
            accessibilityLabel="Share links"
            accessibilityRole="button"
          >
            <FontAwesome name="share-alt" size={16} color={colors.accent} />
            <Text style={styles.secondaryActionText}>Share</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.actionButton, styles.primaryAction, loading && styles.disabled]}
          onPress={onMarkPurchased}
          disabled={loading}
          accessibilityLabel="Mark as purchased"
          accessibilityRole="button"
        >
          <FontAwesome name="check" size={16} color="#fff" />
          <Text style={styles.primaryActionText}>
            {loading ? 'Updating...' : 'Mark Purchased'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    gap: 12,
  },
  countSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  primaryAction: {
    backgroundColor: colors.success,
  },
  secondaryAction: {
    backgroundColor: colors.border,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  disabled: {
    opacity: 0.6,
  },
})
