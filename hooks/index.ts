import { useState, useRef, useCallback } from 'react'
import type { Attachment } from 'ai'
import type { AttachmentFile } from '../pkgs/payload-agent/src/components/ui/file-preview'

export const useAuthResult = ({ initialAuthResult, getAuthResult }: any) => {
  return initialAuthResult
}

export const useCommand = () => {
  return {}
}

export const useChatInputMethods = () => {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const [disabled, setDisabled] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const submitForm = useCallback(() => {
    console.log('Submit form')
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submitForm()
    }
  }, [submitForm])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    const newAttachments = files.map((file) => {
      const id = crypto.randomUUID()
      const fileType = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other'

      return {
        id,
        file,
        type: fileType,
        url: URL.createObjectURL(file),
        isUploading: false,
        uploadProgress: 0,
        metadata: {
          name: file.name,
          size: file.size,
        },
      } as AttachmentFile
    })

    setAttachments((prev) => [...prev, ...newAttachments])
  }, [])

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return {
    attachments,
    disabled,
    fileInputRef,
    textareaRef,
    handleKeyDown,
    handleFileChange,
    removeAttachment,
    submitForm,
    setAttachments,
    setDisabled,
  }
}

export * from '@/hooks/use-next-auth-client'
