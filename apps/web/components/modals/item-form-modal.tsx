'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AIPreviewCard } from './ai-preview-card'
import { useQuickAdd } from '@/hooks/use-quick-add'
import { createItem } from '@/lib/actions/create-item'
import { updateItem } from '@/lib/actions/update-item'
import { deleteItem } from '@/lib/actions/delete-item'
import { createItemWithAIData } from '@/lib/actions/create-item-with-ai-data'
import type { GiftItem } from '@/types/database'

interface ItemFormModalProps {
  open: boolean
  onClose: () => void
  listId: string
  item?: GiftItem
}

type ModalMode = 'ai' | 'manual'

export function ItemFormModal({ open, onClose, listId, item }: ItemFormModalProps) {
  const router = useRouter()
  const isEditing = !!item

  // Mode state
  const [mode, setMode] = useState<ModalMode>('ai')

  // AI Quick Add state
  const { fetchAIData, isLoading: aiLoading, error: aiError, data: aiData, reset: resetAI, budget } = useQuickAdd()
  const [aiItemName, setAiItemName] = useState('')

  // Manual form state
  const [name, setName] = useState(item?.name || '')
  const [status, setStatus] = useState<'required' | 'optional'>(item?.status || 'required')
  const [notes, setNotes] = useState(item?.notes || '')
  const [isHighValue, setIsHighValue] = useState(item?.value_tag === 'HIGH')
  const [nameError, setNameError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const resetForm = () => {
    if (!isEditing) {
      setName('')
      setNotes('')
      setIsHighValue(false)
      setAiItemName('')
      resetAI()
    }
    setNameError('')
    setSubmitError('')
  }

  const handleClose = () => {
    if (!isSubmitting && !aiLoading) {
      setName('')
      setStatus('required')
      setNotes('')
      setIsHighValue(false)
      setNameError('')
      setSubmitError('')
      setShowDeleteConfirm(false)
      setAiItemName('')
      resetAI()
      setMode('ai')
      onClose()
    }
  }

  // AI Quick Add handlers
  const handleAIFetch = async () => {
    if (aiItemName.trim().length < 3) {
      setSubmitError('Item name must be at least 3 characters')
      return
    }

    setSubmitError('')
    await fetchAIData(aiItemName)
  }

  const handleAISave = async () => {
    if (!aiData) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const result = await createItemWithAIData({
        listId,
        itemName: aiItemName,
        aiData,
      })

      if (result.success) {
        router.refresh()
        resetForm()
        handleClose()
      } else {
        setSubmitError(result.error || 'Failed to create item')
      }
    } catch (error) {
      console.error('AI save error:', error)
      setSubmitError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditManually = () => {
    if (aiData) {
      // Pre-fill manual form with AI data
      setName(aiItemName)
      setStatus(aiData.suggestedStatus)
      setNotes(aiData.description)
      setIsHighValue(aiData.priceRange.high > 100)
    }
    setMode('manual')
  }

  const handleRetryAI = () => {
    resetAI()
    setSubmitError('')
  }

  // Manual form handlers
  const handleManualSubmit = async (e: React.FormEvent, addAnother = false) => {
    e.preventDefault()

    setNameError('')
    setSubmitError('')

    if (!name.trim()) {
      setNameError('Item name is required')
      return
    }

    if (name.trim().length > 200) {
      setNameError('Item name must be less than 200 characters')
      return
    }

    setIsSubmitting(true)

    try {
      let result

      if (isEditing && item) {
        result = await updateItem({
          itemId: item.id,
          name,
          status,
          notes,
          valueTag: isHighValue ? 'HIGH' : null,
        })
      } else {
        result = await createItem({
          listId,
          name,
          status,
          notes,
          valueTag: isHighValue ? 'HIGH' : null,
        })
      }

      if (result.success) {
        router.refresh()

        if (addAnother && !isEditing) {
          resetForm()
          setTimeout(() => {
            document.getElementById('item-name')?.focus()
          }, 0)
        } else {
          handleClose()
        }
      } else {
        setSubmitError(result.error)
      }
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!item) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const result = await deleteItem(item.id)

      if (result.success) {
        router.refresh()
        handleClose()
      } else {
        setSubmitError(result.error)
        setShowDeleteConfirm(false)
      }
    } catch (error) {
      console.error('Delete error:', error)
      setSubmitError('An unexpected error occurred')
      setShowDeleteConfirm(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when item prop changes
  if (open && item && name !== item.name) {
    setName(item.name)
    setStatus(item.status)
    setNotes(item.notes || '')
    setIsHighValue(item.value_tag === 'HIGH')
    setNameError('')
    setSubmitError('')
    setShowDeleteConfirm(false)
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="bg-[#141414] rounded-lg p-6 w-full max-w-md border border-[#2d2d2d]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#e4e4e7]">
            {isEditing ? 'Edit Gift Item' : 'Add Gift Item'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting || aiLoading}
            className="text-[#71717a] hover:text-[#e4e4e7] transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mode Toggle (only for new items) */}
        {!isEditing && (
          <div className="mb-6 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('ai')}
                disabled={aiLoading || isSubmitting}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  mode === 'ai'
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-[#2d2d2d] text-[#a1a1aa] hover:bg-[#3d3d3d]'
                } disabled:opacity-50`}
              >
                ⚡ AI Quick Add
              </button>
              <button
                onClick={() => setMode('manual')}
                disabled={aiLoading || isSubmitting}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  mode === 'manual'
                    ? 'bg-[#6366f1] text-white'
                    : 'bg-[#2d2d2d] text-[#a1a1aa] hover:bg-[#3d3d3d]'
                } disabled:opacity-50`}
              >
                📝 Manual Entry
              </button>
            </div>

            {/* Budget Indicator (AI mode only) */}
            {mode === 'ai' && budget && (
              <div className={`flex items-center justify-between px-3 py-2 rounded-md text-xs ${
                budget.percentUsed >= 90
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                  : budget.percentUsed >= 70
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    : 'bg-[#1a1a1a] border border-[#2d2d2d] text-[#71717a]'
              }`}>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {budget.percentUsed >= 90 ? (
                    <span>Only ~{budget.estimatedRequestsRemaining.toLocaleString()} AI requests remaining</span>
                  ) : (
                    <span>~{budget.estimatedRequestsRemaining.toLocaleString()} AI requests this month</span>
                  )}
                </span>
                <span className="font-medium">{budget.percentUsed}% used</span>
              </div>
            )}
          </div>
        )}

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <div className="bg-[#dc2626] bg-opacity-10 border border-[#dc2626] rounded-lg p-4">
              <p className="text-[#e4e4e7] font-semibold mb-2">Delete this item?</p>
              <p className="text-[#a1a1aa] text-sm">
                This will permanently delete &quot;{item?.name}&quot; and all its retailer links. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#e4e4e7]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Item'}
              </Button>
            </div>
          </div>
        ) : mode === 'ai' && !isEditing ? (
          /* AI Quick Add Mode */
          <div className="space-y-4">
            {submitError && (
              <div className="bg-[#dc2626] bg-opacity-10 border border-[#dc2626] rounded-lg p-3">
                <p className="text-[#dc2626] text-sm">{submitError}</p>
              </div>
            )}

            {aiError && (
              <div className="bg-amber-500/10 border border-amber-500 rounded-lg p-3">
                <p className="text-amber-400 text-sm">{aiError}</p>
                <button
                  onClick={() => setMode('manual')}
                  className="text-amber-300 hover:text-amber-200 text-sm font-medium mt-2 underline"
                >
                  Switch to Manual Entry
                </button>
              </div>
            )}

            {aiLoading ? (
              <LoadingSpinner message="Finding details..." />
            ) : aiData ? (
              <>
                <AIPreviewCard
                  data={aiData}
                  itemName={aiItemName}
                  onRetry={handleRetryAI}
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#e4e4e7]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleEditManually}
                    disabled={isSubmitting}
                    className="bg-[#3d3d3d] hover:bg-[#4d4d4d] text-[#e4e4e7]"
                  >
                    Edit Manually
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAISave}
                    disabled={isSubmitting}
                    className="bg-[#6366f1] hover:bg-[#5558e3] text-white disabled:bg-[#4c4f9f] flex-1"
                  >
                    {isSubmitting ? 'Adding...' : 'Add to List'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="ai-item-name" className="block text-sm font-medium text-[#e4e4e7] mb-2">
                    What do you want to get?
                  </label>
                  <Input
                    id="ai-item-name"
                    type="text"
                    value={aiItemName}
                    onChange={(e) => setAiItemName(e.target.value)}
                    placeholder="e.g., wireless headphones, cozy blanket..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAIFetch()
                      }
                    }}
                  />
                  <p className="text-xs text-[#71717a] mt-2">
                    💡 Examples: &quot;LEGO Star Wars set&quot;, &quot;espresso machine under $300&quot;, &quot;noise cancelling headphones&quot;
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={handleClose}
                    className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#e4e4e7]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAIFetch}
                    disabled={aiItemName.trim().length < 3}
                    className="bg-[#6366f1] hover:bg-[#5558e3] text-white disabled:bg-[#4c4f9f] flex-1"
                  >
                    Generate Details
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Manual Entry Mode */
          <form onSubmit={(e) => handleManualSubmit(e, false)} className="space-y-4">
            {submitError && (
              <div className="bg-[#dc2626] bg-opacity-10 border border-[#dc2626] rounded-lg p-3">
                <p className="text-[#dc2626] text-sm">{submitError}</p>
              </div>
            )}

            <div>
              <label htmlFor="item-name" className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Item Name <span className="text-[#dc2626]">*</span>
              </label>
              <Input
                id="item-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Wireless Headphones"
                disabled={isSubmitting}
                autoFocus
                className={nameError ? 'border-[#dc2626] focus:ring-[#dc2626]' : ''}
              />
              {nameError && (
                <p className="text-[#dc2626] text-sm mt-1">{nameError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Status <span className="text-[#dc2626]">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('required')}
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                    status === 'required'
                      ? 'bg-[#6366f1] text-white'
                      : 'bg-[#2d2d2d] text-[#a1a1aa] hover:bg-[#3d3d3d]'
                  } disabled:opacity-50`}
                >
                  Required
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('optional')}
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                    status === 'optional'
                      ? 'bg-[#6366f1] text-white'
                      : 'bg-[#2d2d2d] text-[#a1a1aa] hover:bg-[#3d3d3d]'
                  } disabled:opacity-50`}
                >
                  Optional
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHighValue}
                  onChange={(e) => setIsHighValue(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded border-[#2d2d2d] bg-[#0f0f0f] text-[#6366f1] focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-0 disabled:opacity-50"
                />
                <span className="text-sm font-medium text-[#e4e4e7]">
                  High Value
                </span>
                <span className="text-xs text-[#71717a]">(outsized happiness per dollar)</span>
              </label>
            </div>

            <div>
              <label htmlFor="item-notes" className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Notes
              </label>
              <Textarea
                id="item-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or preferences..."
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting}
                    className="bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                  >
                    Delete
                  </Button>
                  <div className="flex-1" />
                  <Button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#e4e4e7]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#6366f1] hover:bg-[#5558e3] text-white disabled:bg-[#4c4f9f]"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#e4e4e7]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => handleManualSubmit(e, true)}
                    disabled={isSubmitting}
                    className="bg-[#3d3d3d] hover:bg-[#4d4d4d] text-[#e4e4e7] disabled:bg-[#2d2d2d]"
                  >
                    Save & Add Another
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#6366f1] hover:bg-[#5558e3] text-white disabled:bg-[#4c4f9f]"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Item'}
                  </Button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
