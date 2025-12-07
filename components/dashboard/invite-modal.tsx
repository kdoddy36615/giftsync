'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { inviteToList } from '@/lib/actions/invite-to-list'
import type { GiftList } from '@/types/database'

interface InviteModalProps {
  open: boolean
  onClose: () => void
  list: GiftList
}

export function InviteModal({ open, onClose, list }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInviteUrl(null)

    if (!email.trim()) {
      setError('Please enter an email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    const result = await inviteToList({
      listId: list.id,
      email: email.trim(),
      role: 'editor',
    })

    setIsSubmitting(false)

    if (result.success && result.inviteUrl) {
      setInviteUrl(result.inviteUrl)
      setEmail('')
    } else {
      setError(result.error || 'Failed to send invitation')
    }
  }

  const handleCopy = async () => {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError(null)
    setInviteUrl(null)
    setCopied(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Share "${list.name}"`}>
      <div className="space-y-6">
        <p className="text-[#a1a1aa] text-sm">
          Invite someone to collaborate on this gift list. They&apos;ll be able
          to view and edit items.
        </p>

        {!inviteUrl ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@example.com"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Create Invite Link
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4">
              <p className="text-emerald-400 text-sm font-medium mb-2">
                Invitation created!
              </p>
              <p className="text-[#a1a1aa] text-sm mb-3">
                Share this link with your partner. It expires in 7 days.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 bg-[#1e1e1e] border border-[#2d2d2d] rounded px-3 py-2 text-sm text-[#e4e4e7] font-mono"
                />
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={handleClose}>
                Done
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setInviteUrl(null)
                  setEmail('')
                }}
              >
                Invite Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
