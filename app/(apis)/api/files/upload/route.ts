import { API } from '@/lib/api'
import { put } from '@vercel/blob'
import { z } from 'zod'

const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'File type should be JPEG or PNG',
    }),
})

export const POST = API(async (req, { user }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  if (req.body === null) {
    return { error: 'Request body is empty', status: 400 }
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as Blob

    if (!file) {
      return { error: 'No file uploaded', status: 400 }
    }

    const validatedFile = FileSchema.safeParse({ file })

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error: z.ZodIssue) => error.message)
        .join(', ')

      return { error: errorMessage, status: 400 }
    }

    const filename = (formData.get('file') as File).name
    const fileBuffer = await file.arrayBuffer()

    try {
      const data = await put(`${filename}`, fileBuffer, {
        access: 'public',
      })

      return data
    } catch (error) {
      return { error: 'Upload failed', status: 500 }
    }
  } catch (error) {
    return { error: 'Failed to process request', status: 500 }
  }
})
