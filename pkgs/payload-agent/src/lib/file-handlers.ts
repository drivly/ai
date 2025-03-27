'use client'

import { nanoid } from 'nanoid'
import type { AttachmentFile } from '../components/ui/file-preview'

type FileUploadOptions = {
  maxSizeMB?: number
  allowedTypes?: string[]
}

const defaultOptions = {
  maxSizeMB: 10,
  allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
} satisfies FileUploadOptions

/**
 * Process files selected by the user, validating and creating AttachmentFile objects
 */
export function handleFileSelection(files: FileList, options: FileUploadOptions = {}) {
  const opts = { ...defaultOptions, ...options }
  const maxSize = opts.maxSizeMB! * 1024 * 1024 // Convert MB to bytes

  const validFiles: AttachmentFile[] = []
  const invalidFiles: Array<{ file: File; error: string }> = []

  Array.from(files).forEach((file) => {
    // Check file size
    if (file.size > maxSize) {
      invalidFiles.push({
        file,
        error: `File exceeds the ${opts.maxSizeMB}MB limit`,
      })
      return
    }

    // Check file type
    const isAllowedType = opts.allowedTypes!.some((type) => {
      if (type.endsWith('/*')) {
        const mainType = type.split('/')[0]
        return file.type.startsWith(`${mainType}/`)
      }
      return file.type === type
    })

    if (!isAllowedType) {
      invalidFiles.push({
        file,
        error: 'File type not supported',
      })
      return
    }

    // Determine file type category
    let fileType: 'image' | 'pdf' | 'other' = 'other'
    if (file.type.startsWith('image/')) {
      fileType = 'image'
    } else if (file.type === 'application/pdf') {
      fileType = 'pdf'
    }

    // Create valid attachment object
    validFiles.push({
      id: nanoid(),
      file,
      type: fileType,
      isUploading: false,
      uploadProgress: 0,
      metadata: {
        name: file.name,
        size: file.size,
      },
    })
  })

  return { valid: validFiles, invalid: invalidFiles }
}

/**
 * Generate a thumbnail for an image file
 */
export function generateImageThumbnail(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Target dimensions (maintain aspect ratio)
        const maxDim = 200
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxDim) {
            height = (height * maxDim) / width
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = (width * maxDim) / height
            height = maxDim
          }
        }

        // Set canvas dimensions and draw resized image
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to data URL (thumbnail)
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7)
        resolve(thumbnail)
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = event.target?.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
