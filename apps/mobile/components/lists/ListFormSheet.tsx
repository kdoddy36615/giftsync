import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import GorhomBottomSheet from '@gorhom/bottom-sheet'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { TextInput } from '../ui/TextInput'
import { colors } from '../../lib/constants/colors'
import { LIST_COLORS } from '../../hooks/useGiftLists'
import type { GiftList } from '../../lib/types'

interface ListFormSheetProps {
  visible: boolean
  list?: GiftList // If provided, edit mode
  onSave: (data: { name: string; color: string }) => Promise<{ success: boolean; error?: string }>
  onClose: () => void
}

export function ListFormSheet({ visible, list, onSave, onClose }: ListFormSheetProps) {
  const sheetRef = useRef<GorhomBottomSheet>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(LIST_COLORS[0])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!list

  // Reset form when opened
  useEffect(() => {
    if (visible) {
      setName(list?.name || '')
      setColor(list?.color || LIST_COLORS[0])
      setError('')
    }
  }, [visible, list])

  const handleSubmit = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Name is required')
      return
    }

    if (trimmedName.length > 100) {
      setError('Name must be less than 100 characters')
      return
    }

    setIsSubmitting(true)
    setError('')

    const result = await onSave({ name: trimmedName, color })

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
      title={isEditing ? 'Edit Gift List' : 'Create Gift List'}
      snapPoints={['45%']}
      onClose={onClose}
    >
      <View style={styles.form}>
        <TextInput
          label="Who are you shopping for?"
          placeholder="e.g., Mom, Emily, Jake"
          value={name}
          onChangeText={(text) => {
            setName(text)
            if (error) setError('')
          }}
          error={error}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <View style={styles.colorSection}>
          <Text style={styles.colorLabel}>Color</Text>
          <View style={styles.colorPicker}>
            {LIST_COLORS.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.colorOption,
                  { backgroundColor: c },
                  color === c && styles.colorSelected,
                ]}
                onPress={() => setColor(c)}
                accessibilityLabel={`Color ${c}`}
                accessibilityRole="button"
                accessibilityState={{ selected: color === c }}
              />
            ))}
          </View>
        </View>

        {!isEditing && (
          <Text style={styles.tip}>
            Create separate lists for each person to stay organized
          </Text>
        )}

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
            {isEditing ? 'Save Changes' : 'Create List'}
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
  colorSection: {
    gap: 8,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: colors.text,
    transform: [{ scale: 1.1 }],
  },
  tip: {
    fontSize: 12,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
})
