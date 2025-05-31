import type { AttachmentFile } from '@/components/ui/file-preview'
import { generateImageThumbnail, handleFileSelection } from '@/lib/file-handlers'
import type { UseChatHelpers } from '@ai-sdk/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface UseChatInputMethodsProps {
  error: UseChatHelpers['error']
  isDisabled: boolean
  isLoading: boolean
  input: UseChatHelpers['input']
  messages: UseChatHelpers['messages']
  handleSubmit: UseChatHelpers['handleSubmit']
  setMessages: UseChatHelpers['setMessages']
}

export const useChatInputMethods = ({ error, input, isDisabled, isLoading, messages, handleSubmit, setMessages }: UseChatInputMethodsProps) => {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isLoading && !isDisabled) {
      textareaRef.current?.focus()
    }
  }, [isLoading, isDisabled])

  const submitForm = useCallback(() => {
    if (!input.trim() && attachments.length === 0) return

    if (error) setMessages(messages.slice(0, -1))

    handleSubmit(undefined, { files })

    setAttachments([])
    setFiles(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [attachments.length, error, files, handleSubmit, input, messages, setMessages])

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

    setAttachments((prev) => [...prev, ...processedFiles])
  }, [])

  const removeAttachment = useCallback(
    (id: string) => {
      const newAttachments = attachments.filter((file) => file.id !== id)
      setAttachments(newAttachments)

      if (newAttachments.length === 0) {
        setFiles(undefined)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        const dt = new DataTransfer()
        newAttachments.forEach((attachment) => {
          dt.items.add(attachment.file)
        })
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
