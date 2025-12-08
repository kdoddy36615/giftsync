import { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../lib/constants/colors'
import { getSupabase } from '../../lib/supabase/client'
import { Button, EmptyState, Card } from '../../components/ui'
import { useAuth } from '../../providers/AuthProvider'
import { useToast } from '../../providers/ToastProvider'
import { useHaptics } from '../../hooks/useHaptics'

interface InviteDetails {
  id: string
  list_id: string
  list_name: string
  inviter_email: string
  role: 'viewer' | 'editor'
  expires_at: string
}

export default function InviteScreen() {
  const { token } = useLocalSearchParams<{ token: string }>()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { showToast } = useToast()
  const haptics = useHaptics()

  const [invite, setInvite] = useState<InviteDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)

  const fetchInvite = useCallback(async () => {
    if (!token) {
      setError('Invalid invite link')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const supabase = getSupabase()

      const { data, error: fetchError } = await supabase
        .from('invites')
        .select(`
          id,
          list_id,
          role,
          expires_at,
          gift_lists!inner (
            name
          ),
          profiles!inner (
            email
          )
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('This invite has expired or already been used')
        } else {
          throw fetchError
        }
        return
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        setError('This invite has expired')
        return
      }

      // Type assertions for Supabase joined tables
      const giftList = data.gift_lists as unknown as { name: string }
      const profile = data.profiles as unknown as { email: string }

      setInvite({
        id: data.id,
        list_id: data.list_id,
        list_name: giftList.name,
        inviter_email: profile.email,
        role: data.role,
        expires_at: data.expires_at,
      })
    } catch (err) {
      console.error('Fetch invite error:', err)
      setError('Unable to load invite. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchInvite()
  }, [fetchInvite])

  const handleAccept = async () => {
    if (!invite || !user) return

    setIsAccepting(true)

    try {
      const supabase = getSupabase()

      // Add user as collaborator
      const { error: colabError } = await supabase
        .from('list_collaborators')
        .insert({
          list_id: invite.list_id,
          user_id: user.id,
          role: invite.role,
        })

      if (colabError) {
        // Check if already a collaborator
        if (colabError.code === '23505') {
          // Update invite status anyway
          await supabase
            .from('invites')
            .update({ status: 'accepted' })
            .eq('id', invite.id)

          haptics.success()
          showToast("You're already a collaborator on this list", 'info')
          router.replace(`/list/${invite.list_id}`)
          return
        }
        throw colabError
      }

      // Update invite status
      await supabase
        .from('invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id)

      haptics.success()
      showToast(`You can now access "${invite.list_name}"`, 'success')
      router.replace(`/list/${invite.list_id}`)
    } catch (err) {
      console.error('Accept invite error:', err)
      haptics.error()
      showToast('Failed to accept invite. Please try again.', 'error')
    } finally {
      setIsAccepting(false)
    }
  }

  const handleDecline = () => {
    router.replace('/')
  }

  // Show login prompt if not authenticated
  if (!isAuthLoading && !user) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Invite',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
          }}
        />
        <SafeAreaView style={styles.container}>
          <EmptyState
            icon="🔐"
            title="Login Required"
            subtitle="Please login to accept this invite"
            actionLabel="Login"
            onAction={() => router.replace('/(auth)/login')}
          />
        </SafeAreaView>
      </>
    )
  }

  if (isLoading || isAuthLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Invite',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
          }}
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading invite...</Text>
          </View>
        </SafeAreaView>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Invite',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
          }}
        />
        <SafeAreaView style={styles.container}>
          <EmptyState
            icon="😔"
            title="Invalid Invite"
            subtitle={error}
            actionLabel="Go Home"
            onAction={() => router.replace('/')}
          />
        </SafeAreaView>
      </>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Invite',
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎁</Text>
          </View>

          <Text style={styles.title}>You've been invited!</Text>
          <Text style={styles.subtitle}>
            {invite?.inviter_email} wants to share a gift list with you
          </Text>

          <Card style={styles.inviteCard}>
            <Text style={styles.listName}>{invite?.list_name}</Text>
            <Text style={styles.roleLabel}>
              You'll be added as: <Text style={styles.roleValue}>{invite?.role}</Text>
            </Text>
          </Card>

          <View style={styles.actions}>
            <Button
              variant="secondary"
              onPress={handleDecline}
              disabled={isAccepting}
              style={styles.button}
            >
              Decline
            </Button>
            <Button
              variant="primary"
              onPress={handleAccept}
              loading={isAccepting}
              style={{ ...styles.button, flex: 2 }}
            >
              Accept Invite
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  inviteCard: {
    width: '100%',
    marginBottom: 32,
    alignItems: 'center',
  },
  listName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  roleLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleValue: {
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
  },
})
