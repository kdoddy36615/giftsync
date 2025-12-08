import { View, Text, Pressable, StyleSheet, Switch, ScrollView, Linking, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { colors } from '../../lib/constants/colors'
import { useAuth } from '../../providers/AuthProvider'
import { usePrivacy } from '../../providers/PrivacyProvider'
import { useHaptics } from '../../hooks/useHaptics'
import { useToast } from '../../providers/ToastProvider'

interface SettingsRowProps {
  icon: React.ComponentProps<typeof FontAwesome>['name']
  label: string
  value?: string
  onPress?: () => void
  rightElement?: React.ReactNode
  danger?: boolean
}

function SettingsRow({ icon, label, value, onPress, rightElement, danger = false }: SettingsRowProps) {
  const content = (
    <View style={styles.row}>
      <View style={[styles.iconContainer, danger && styles.iconContainerDanger]}>
        <FontAwesome name={icon} size={16} color={danger ? colors.danger : colors.accent} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      {rightElement || (onPress && (
        <FontAwesome name="chevron-right" size={14} color={colors.textMuted} />
      ))}
    </View>
  )

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.rowContainer, pressed && styles.rowPressed]}
        onPress={onPress}
      >
        {content}
      </Pressable>
    )
  }

  return <View style={styles.rowContainer}>{content}</View>
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth()
  const { isBlurred, toggleBlur } = usePrivacy()
  const haptics = useHaptics()
  const { showToast } = useToast()

  const handleToggleBlur = () => {
    haptics.selection()
    toggleBlur()
    showToast(
      isBlurred ? 'Prices are now visible' : 'Prices are now hidden',
      'success'
    )
  }

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            haptics.medium()
            await signOut()
          },
        },
      ]
    )
  }

  const handleContact = () => {
    Linking.openURL('mailto:support@giftsync.app?subject=GiftSync%20Feedback')
  }

  const handleRate = () => {
    // TODO: Replace with actual app store links
    showToast('Coming soon to app stores!', 'info')
  }

  const handlePrivacy = () => {
    Linking.openURL('https://giftsync.vercel.app/privacy')
  }

  const handleTerms = () => {
    Linking.openURL('https://giftsync.vercel.app/terms')
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="user"
              label="Email"
              value={user?.email || 'Not signed in'}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="eye-slash"
              label="Privacy Mode"
              rightElement={
                <Switch
                  value={isBlurred}
                  onValueChange={handleToggleBlur}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor="#fff"
                />
              }
            />
            <View style={styles.rowDivider} />
            <View style={styles.hintContainer}>
              <Text style={styles.hint}>
                When enabled, all prices and totals will be hidden. Perfect for shopping in public.
              </Text>
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="envelope"
              label="Contact Us"
              onPress={handleContact}
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              icon="star"
              label="Rate GiftSync"
              onPress={handleRate}
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="shield"
              label="Privacy Policy"
              onPress={handlePrivacy}
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              icon="file-text-o"
              label="Terms of Service"
              onPress={handleTerms}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <View style={styles.card}>
            <SettingsRow
              icon="sign-out"
              label="Sign Out"
              onPress={handleSignOut}
              danger
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>GiftSync v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with care for gift givers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  rowContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowPressed: {
    backgroundColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerDanger: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  rowLabelDanger: {
    color: colors.danger,
  },
  rowValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 60,
  },
  hintContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textMuted,
  },
})
