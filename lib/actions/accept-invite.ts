'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface AcceptInviteResult {
  success: boolean
  error?: string
  listId?: string
  listName?: string
}

interface InviteData {
  id: string
  list_id: string
  invite_token: string
  email: string
  role: 'editor' | 'viewer'
  invited_by: string
  expires_at: string
  accepted_at: string | null
  gift_lists: { id: string; name: string } | null
}

export async function acceptInvite(inviteToken: string): Promise<AcceptInviteResult> {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Please log in to accept this invitation' }
    }

    // Note: Using type assertions for new tables until migration is run and types regenerated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any

    // Get invite details
    const { data: invite, error: inviteError } = await supabaseAny
      .from('list_invites')
      .select('*, gift_lists(id, name)')
      .eq('invite_token', inviteToken)
      .single() as { data: InviteData | null; error: unknown }

    if (inviteError || !invite) {
      return { success: false, error: 'Invalid or expired invitation' }
    }

    // Check if already accepted
    if (invite.accepted_at) {
      return { success: false, error: 'This invitation has already been used' }
    }

    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      return { success: false, error: 'This invitation has expired' }
    }

    // Check if user is already a member
    const { data: existingMember } = await supabaseAny
      .from('list_members')
      .select('id')
      .eq('list_id', invite.list_id)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      return { success: false, error: 'You are already a member of this list' }
    }

    // Add user as member
    const { error: memberError } = await supabaseAny.from('list_members').insert({
      list_id: invite.list_id,
      user_id: user.id,
      role: invite.role,
      invited_by: invite.invited_by,
      accepted_at: new Date().toISOString(),
    })

    if (memberError) {
      console.error('Failed to add member:', memberError)
      return { success: false, error: 'Failed to join the list' }
    }

    // Mark invite as accepted
    await supabaseAny
      .from('list_invites')
      .update({
        accepted_at: new Date().toISOString(),
        accepted_by: user.id,
      })
      .eq('id', invite.id)

    revalidatePath('/dashboard')

    return {
      success: true,
      listId: invite.list_id,
      listName: invite.gift_lists?.name || 'Gift List',
    }
  } catch (error) {
    console.error('Accept invite error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get invite details without accepting (for preview page)
 */
export async function getInviteDetails(inviteToken: string) {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any

    const { data: invite, error } = await supabaseAny
      .from('list_invites')
      .select('*, gift_lists(id, name)')
      .eq('invite_token', inviteToken)
      .single() as { data: InviteData | null; error: unknown }

    if (error || !invite) {
      return { valid: false as const, error: 'Invalid invitation' }
    }

    if (invite.accepted_at) {
      return { valid: false as const, error: 'This invitation has already been used' }
    }

    if (new Date(invite.expires_at) < new Date()) {
      return { valid: false as const, error: 'This invitation has expired' }
    }

    return {
      valid: true as const,
      listName: invite.gift_lists?.name || 'Gift List',
      role: invite.role,
      expiresAt: invite.expires_at,
    }
  } catch (error) {
    console.error('Get invite details error:', error)
    return { valid: false as const, error: 'An unexpected error occurred' }
  }
}
