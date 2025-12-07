'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createList } from '@/lib/actions/create-list'
import { updateList } from '@/lib/actions/update-list'
import { deleteList } from '@/lib/actions/delete-list'
import type { GiftList } from '@/types/database'

interface ListFormModalProps {
  open: boolean
  onClose: () => void
  list?: GiftList
  onListCreated?: (listId: string) => void
}

export function ListFormModal({ open, onClose, list, onListCreated }: ListFormModalProps) {
  const router = useRouter()
  const isEditing = !!list

  const [name, setName] = useState(list?.name || '')
  const [nameError, setNameError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Reset form when list prop changes
  useEffect(() => {
    if (open && list) {
      setName(list.name)
      setNameError('')
      setSubmitError('')
      setShowDeleteConfirm(false)
    } else if (open && !list) {
      setName('')
      setNameError('')
      setSubmitError('')
      setShowDeleteConfirm(false)
    }
  }, [open, list])

  const handleClose = () => {
    if (!isSubmitting) {
      setName('')
      setNameError('')
      setSubmitError('')
      setShowDeleteConfirm(false)
      onClose()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setNameError('')
    setSubmitError('')

    // Validate
    if (!name.trim()) {
      setNameError('List name is required')
      return
    }

    if (name.trim().length > 100) {
      setNameError('List name must be less than 100 characters')
      return
    }

    setIsSubmitting(true)

    try {
      let result

      if (isEditing && list) {
        result = await updateList({
          listId: list.id,
          name,
        })
      } else {
        result = await createList({
          name,
        })
      }

      if (result.success) {
        router.refresh()

        // If creating a new list, notify parent so it can switch to it
        if (!isEditing && onListCreated) {
          onListCreated(result.list.id)
        }

        handleClose()
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
    if (!list) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const result = await deleteList(list.id)

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

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="bg-[#141414] rounded-lg p-6 w-full max-w-md border border-[#2d2d2d]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#e4e4e7]">
            {isEditing ? 'Edit Gift List' : 'Create Gift List'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
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

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <div className="bg-[#dc2626] bg-opacity-10 border border-[#dc2626] rounded-lg p-4">
              <p className="text-[#e4e4e7] font-semibold mb-2">Delete this gift list?</p>
              <p className="text-[#a1a1aa] text-sm">
                This will permanently delete &quot;{list?.name}&quot; and all its gift items and retailer links. This action cannot be undone.
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
                {isSubmitting ? 'Deleting...' : 'Delete List'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="bg-[#dc2626] bg-opacity-10 border border-[#dc2626] rounded-lg p-3">
                <p className="text-[#dc2626] text-sm">{submitError}</p>
              </div>
            )}

            <div>
              <label htmlFor="list-name" className="block text-sm font-medium text-[#e4e4e7] mb-2">
                Who are you shopping for? <span className="text-[#dc2626]">*</span>
              </label>
              <Input
                id="list-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mom, Emily, Jake"
                disabled={isSubmitting}
                autoFocus
                className={nameError ? 'border-[#dc2626] focus:ring-[#dc2626]' : ''}
              />
              {nameError && (
                <p className="text-[#dc2626] text-sm mt-1">{nameError}</p>
              )}
              {!isEditing && (
                <p className="text-[#71717a] text-xs mt-1.5">
                  💡 Tip: Create separate lists for each person to stay organized
                </p>
              )}
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
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#6366f1] hover:bg-[#5558e3] text-white disabled:bg-[#4c4f9f]"
                  >
                    {isSubmitting ? 'Creating...' : 'Create List'}
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
