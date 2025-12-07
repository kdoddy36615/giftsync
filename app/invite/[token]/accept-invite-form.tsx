'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { acceptInvite } from '@/lib/actions/accept-invite'

interface AcceptInviteFormProps {
  token: string
}

export function AcceptInviteForm({ token }: AcceptInviteFormProps) {
  const router = useRouter()
  const [isAccepting, setIsAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAccept = async () => {
    setIsAccepting(true)
    setError(null)

    const result = await acceptInvite(token)

    if (result.success) {
      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      setError(result.error || 'Failed to accept invitation')
      setIsAccepting(false)
    }
  }

  const handleDecline = () => {
    router.push('/dashboard')
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Button
          variant="primary"
          onClick={handleAccept}
          loading={isAccepting}
          className="px-6"
        >
          Accept Invitation
        </Button>
        <Button
          variant="secondary"
          onClick={handleDecline}
          disabled={isAccepting}
        >
          Decline
        </Button>
      </div>

      <p className="text-[#71717a] text-xs mt-4">
        By accepting, you&apos;ll be able to view and edit items in this gift
        list.
      </p>
    </div>
  )
}
