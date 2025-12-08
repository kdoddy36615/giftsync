import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import GorhomBottomSheet from '@gorhom/bottom-sheet'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { TextInput } from '../ui/TextInput'
import { colors } from '../../lib/constants/colors'
import type { GiftItem, CreateItemInput, UpdateItemInput } from '../../lib/types'

interface ItemFormSheetProps {
  visible: boolean
  listId: string
  item?: GiftItem // If provided, edit mode
  onSave: (data: CreateItemInput | UpdateItemInput) => Promise<{ success: boolean; error?: string }>
  onClose: () => void
}

export function ItemFormSheet({ visible, listId, item, onSave, onClose }: ItemFormSheetProps) {
  const sheetRef = useRef<GorhomBottomSheet>(null)

  const [name, setName] = useState('')
  const [status, setStatus] = useState<'required' | 'optional'>('required')
  const [notes, setNotes] = useState('')
  const [priceLow, setPriceLow] = useState('')
  const [priceHigh, setPriceHigh] = useState('')
  const [isHighValue, setIsHighValue] = useState(false)

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!item

  // Reset form when opened
  useEffect(() => {
    if (visible) {
      setName(item?.name || '')
      setStatus(item?.status || 'required')
      setNotes(item?.notes || '')
      setPriceLow(item?.price_low?.toString() || '')
      setPriceHigh(item?.price_high?.toString() || '')
      setIsHighValue(item?.value_tag === 'HIGH')
      setError('')
    }
  }, [visible, item])

  const handleSubmit = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Item name is required')
      return
    }

    if (trimmedName.length > 200) {
      setError('Name must be less than 200 characters')
      return
    }

    setIsSubmitting(true)
    setError('')

    const data = isEditing
      ? {
          name: trimmedName,
          status,
          notes: notes.trim() || null,
          price_low: priceLow ? parseFloat(priceLow) : null,
          price_high: priceHigh ? parseFloat(priceHigh) : null,
          value_tag: isHighValue ? 'HIGH' : null,
        }
      : {
          list_id: listId,
          name: trimmedName,
          status,
          notes: notes.trim() || null,
          price_low: priceLow ? parseFloat(priceLow) : null,
          price_high: priceHigh ? parseFloat(priceHigh) : null,
          value_tag: isHighValue ? 'HIGH' : null,
        }

    const result = await onSave(data)

    setIsSubmitting(false)

    if (result.success) {
      sheetRef.current?.close()
    } else {
      setError(result.error || 'Something went wrong')
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      sheetRef.current?.close()
    }
  }

  if (!visible) return null

  return (
    <BottomSheet
      ref={sheetRef}
      title={isEditing ? 'Edit Item' : 'Add Item'}
      snapPoints={['70%', '90%']}
      onClose={onClose}
      scrollable
    >
      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TextInput
          label="Item Name"
          placeholder="e.g., Wireless Headphones"
          value={name}
          onChangeText={(text) => {
            setName(text)
            if (error) setError('')
          }}
          autoFocus
        />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Status</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[
                styles.toggleButton,
                status === 'required' && styles.toggleActive,
              ]}
              onPress={() => setStatus('required')}
            >
              <Text
                style={[
                  styles.toggleText,
                  status === 'required' && styles.toggleTextActive,
                ]}
              >
                Required
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleButton,
                status === 'optional' && styles.toggleActive,
              ]}
              onPress={() => setStatus('optional')}
            >
              <Text
                style={[
                  styles.toggleText,
                  status === 'optional' && styles.toggleTextActive,
                ]}
              >
                Optional
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.priceRow}>
          <View style={styles.priceField}>
            <TextInput
              label="Price Low"
              placeholder="$0"
              value={priceLow}
              onChangeText={setPriceLow}
              keyboardType="decimal-pad"
            />
          </View>
          <Text style={styles.priceSeparator}>-</Text>
          <View style={styles.priceField}>
            <TextInput
              label="Price High"
              placeholder="$0"
              value={priceHigh}
              onChangeText={setPriceHigh}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Pressable
          style={styles.checkbox}
          onPress={() => setIsHighValue(!isHighValue)}
        >
          <View style={[styles.checkboxBox, isHighValue && styles.checkboxChecked]}>
            {isHighValue && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>High Value</Text>
          <Text style={styles.checkboxHint}>(outsized happiness per dollar)</Text>
        </Pressable>

        <TextInput
          label="Notes"
          placeholder="Add any notes or preferences..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        <View style={styles.actions}>
          <Button
            variant="secondary"
            onPress={handleClose}
            disabled={isSubmitting}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit}
            loading={isSubmitting}
            style={{ ...styles.button, flex: 2 }}
          >
            {isEditing ? 'Save Changes' : 'Add Item'}
          </Button>
        </View>
      </ScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  errorBox: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
  },
  section: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.border,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 20,
  },
  priceField: {
    flex: 1,
  },
  priceSeparator: {
    fontSize: 16,
    color: colors.textMuted,
    paddingBottom: 14,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  checkboxHint: {
    fontSize: 12,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    flex: 1,
  },
})
