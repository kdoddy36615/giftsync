'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

interface InviteToListParams {
  listId: string
  email: string
  role?: 'editor' | 'viewer'
}

interface InviteResult {
  success: boolean
  error?: string
  inviteToken?: string
  inviteUrl?: string
}

export async function inviteToList({
  listId,
  email,
  role = 'editor',
}: InviteToListParams): Promise<InviteResult> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify user owns the list
    const { data: list, error: listError } = await supabase
      .from('gift_lists')
      .select('id, name, user_id')
      .eq('id', listId)
      .single()

    if (listError || !list) {
      return { success: false, error: 'List not found' }
    }

    // Type assertion needed until Supabase types are regenerated
    const listData = list as { id: string; name: string; user_id: string }
    if (listData.user_id !== user.id) {
      return { success: false, error: 'Only the list owner can invite members' }
    }

    // Note: Using type assertions for new tables until migration is run and types regenerated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any

    // Check if email is already invited and pending
    const { data: existingInvite } = await supabaseAny
      .from('list_invites')
      .select('id, accepted_at')
      .eq('list_id', listId)
      .eq('email', email.toLowerCase())
      .is('accepted_at', null)
      .single()

    if (existingInvite) {
      return { success: false, error: 'This email has already been invited' }
    }

    // Generate unique invite token
    const inviteToken = crypto.randomBytes(16).toString('hex')

    // Create invite
    const { error: insertError } = await supabaseAny.from('list_invites').insert({
      list_id: listId,
      invite_token: inviteToken,
      email: email.toLowerCase(),
      role,
      invited_by: user.id,
    })

    if (insertError) {
      console.error('Failed to create invite:', insertError)
      return { success: false, error: 'Failed to create invitation' }
    }

    // Generate invite URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const inviteUrl = `${baseUrl}/invite/${inviteToken}`

    revalidatePath('/dashboard')

    return {
      success: true,
      inviteToken,
      inviteUrl,
    }
  } catch (error) {
    console.error('Invite error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
