import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getInviteDetails } from '@/lib/actions/accept-invite'
import { AcceptInviteForm } from './accept-invite-form'

interface InvitePageProps {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params

  // Check if user is logged in
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get invite details
  const inviteDetails = await getInviteDetails(token)

  if (!inviteDetails.valid) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <div className="bg-[#141414] border border-[#2d2d2d] rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-[#e4e4e7] mb-2">
            Invalid Invitation
          </h1>
          <p className="text-[#a1a1aa] mb-6">{inviteDetails.error}</p>
          <a
            href="/dashboard"
            className="inline-block bg-[#6366f1] hover:bg-[#5558e3] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // If not logged in, redirect to login with return URL
  if (!user) {
    const returnUrl = encodeURIComponent(`/invite/${token}`)
    redirect(`/login?redirect=${returnUrl}`)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-lg p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h1 className="text-2xl font-bold text-[#e4e4e7] mb-2">
          You&apos;ve Been Invited!
        </h1>
        <p className="text-[#a1a1aa] mb-6">
          You&apos;ve been invited to collaborate on{' '}
          <span className="text-[#e4e4e7] font-semibold">
            {inviteDetails.listName}
          </span>{' '}
          as {inviteDetails.role === 'editor' ? 'an editor' : 'a viewer'}.
        </p>

        <AcceptInviteForm token={token} />
      </div>
    </div>
  )
}
