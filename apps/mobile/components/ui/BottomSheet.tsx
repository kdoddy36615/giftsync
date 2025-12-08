import React, { useCallback, useMemo, forwardRef } from 'react'
import { View, Text, StyleSheet, Pressable, Keyboard } from 'react-native'
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { colors } from '../../lib/constants/colors'

export interface BottomSheetProps {
  title?: string
  snapPoints?: (string | number)[]
  onClose: () => void
  children: React.ReactNode
  scrollable?: boolean
}

export const BottomSheet = forwardRef<GorhomBottomSheet, BottomSheetProps>(
  ({ title, snapPoints = ['50%', '85%'], onClose, children, scrollable = false }, ref) => {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.7}
          pressBehavior="close"
        />
      ),
      []
    )

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          Keyboard.dismiss()
          onClose()
        }
      },
      [onClose]
    )

    const snapPointsMemo = useMemo(() => snapPoints, [snapPoints])

    const ContentWrapper = scrollable ? BottomSheetScrollView : BottomSheetView

    return (
      <GorhomBottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPointsMemo}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <ContentWrapper style={styles.content}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable
                onPress={onClose}
                style={styles.closeButton}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>
          )}
          {children}
        </ContentWrapper>
      </GorhomBottomSheet>
    )
  }
)

BottomSheet.displayName = 'BottomSheet'

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
  },
  handle: {
    backgroundColor: colors.borderLight,
    width: 40,
    height: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 28,
    color: colors.textMuted,
    lineHeight: 28,
  },
})

// Re-export the provider for use in _layout
export { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
