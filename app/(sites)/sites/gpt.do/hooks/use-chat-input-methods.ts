import type { AttachmentFile } from '@/components/ui/file-preview'
import { generateImageThumbnail, handleFileSelection } from '@/lib/file-handlers'
import type { ChatRequestOptions } from 'ai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const useChatInputMethods = ({
  input,
  isDisabled,
  isLoading,
  handleSubmit,
}: {
  isDisabled: boolean
  isLoading: boolean
  input: string
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void
}) => {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus textarea when input is cleared after submission
  useEffect(() => {
    if (!isLoading && !isDisabled) {
      textareaRef.current?.focus()
    }
  }, [isLoading, isDisabled])

  const submitForm = useCallback(() => {
    if (!input.trim() && attachments.length === 0) {
      console.log('Nothing to submit - empty input and no attachments')
      return
    }

    console.log('Submitting chat message:', {
      input,
      attachmentsCount: attachments.length,
    })

    try {
      // Pass files to the AI SDK
      handleSubmit(undefined, {
        experimental_attachments: files,
      })
      console.log('Message submitted successfully')

      // Clear attachments, files, and input after sending
      setAttachments([])
      setFiles(undefined)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error submitting chat message:', error)
    }
  }, [handleSubmit, input, attachments, files])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        submitForm()
      }
    },
    [submitForm],
  )

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    // Process selected files
    const { valid, invalid } = handleFileSelection(selectedFiles)

    if (invalid.length > 0) {
      console.warn('Some files were not valid and were skipped:', invalid)
    }

    setFiles(selectedFiles)

    const processedFiles = await Promise.all(
      valid.map(async (file) => {
        if (file.type === 'image') {
          try {
            const thumbnailUrl = await generateImageThumbnail(file.file)
            return {
              ...file,
              thumbnailUrl,
              url: thumbnailUrl,
            } as AttachmentFile
          } catch (error) {
            console.error('Failed to generate thumbnail', error)
          }
        }
        return file
      }),
    )

    // Update attachments state with our processed files
    setAttachments((prev) => [...prev, ...processedFiles])
  }, [])

  const removeAttachment = useCallback(
    (id: string) => {
      // Remove from UI attachments
      const newAttachments = attachments.filter((file) => file.id !== id)
      setAttachments(newAttachments)

      // Create new FileList from remaining files
      if (newAttachments.length === 0) {
        setFiles(undefined)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        // Create a new DataTransfer object
        const dt = new DataTransfer()
        // Add remaining files
        newAttachments.forEach((attachment) => {
          dt.items.add(attachment.file)
        })
        // Set new FileList
        setFiles(dt.files)
      }
    },
    [attachments],
  )

  return useMemo(
    () => ({
      attachments,
      disabled: isDisabled,
      fileInputRef,
      textareaRef,
      submitForm,
      handleKeyDown,
      handleFileChange,
      removeAttachment,
    }),
    [attachments, isDisabled, fileInputRef, textareaRef, submitForm, handleKeyDown, handleFileChange, removeAttachment],
  )
}
