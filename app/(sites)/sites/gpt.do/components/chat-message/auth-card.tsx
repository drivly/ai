'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { capitalizeFirstLetter } from '@/lib/utils'
import { ExternalLink, KeyRound } from 'lucide-react'
import Image from 'next/image'
import { type FormEvent, useCallback, useState } from 'react'
import { toast } from 'sonner'

type ConnectionRequest = {
  app: string
  type: 'API_KEY' | 'OAUTH' | 'OAUTH2'
  redirectUrl?: string
  fields?: Record<
    string,
    {
      type: 'string' | 'number' | 'boolean'
      required: boolean
      name: string
      displayName?: string
      description?: string
      is_secret?: boolean
      [key: string]: any
    }
  >
}

type ApiError = {
  success: false
  type: string
  error: string
  connectionRequests: ConnectionRequest[]
}

interface AuthCardProps {
  error: ApiError
  onSubmit?: (app: string, values: Record<string, string>) => void
  onRedirect?: (app: string, url: string) => void
  onCancel?: () => void
  integrationLogo?: string
  integrationName?: string
}

export function AuthCard({ error, onSubmit, onRedirect, onCancel, integrationLogo, integrationName }: AuthCardProps) {
  const initialValues: Record<string, Record<string, string>> = {}
  error.connectionRequests.forEach((request) => {
    if (request.fields) {
      initialValues[request.app] = {}
      Object.entries(request.fields).forEach(([fieldName, field]) => {
        initialValues[request.app][fieldName] = ''
      })
    }
  })

  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({})

  const handleInputChange = useCallback((app: string, name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [app]: {
        ...prev[app],
        [name]: value,
      },
    }))
  }, [])

  const handleSubmit = useCallback(
    async (app: string, e?: FormEvent) => {
      e?.preventDefault()
      let isValid = true
      const request = error.connectionRequests.find((r) => r.app === app)
      console.log('🚀 ~ request:', request)
      if (request?.fields) {
        Object.entries(request.fields).forEach(([fieldName, field]) => {
          if (field.required && !formValues[app][fieldName].trim()) isValid = false
        })
      }
      if (!isValid) return
      setIsSubmitting((prev) => ({ ...prev, [app]: true }))

      try {
        const res = await fetch(`/api/llm/tools/${app ?? integrationName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues[app]),
        })
        if (!res.ok) throw new Error('Failed to authenticate')

        onSubmit?.(app, formValues[app])
        toast.success('Authenticated successfully')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        toast.error(errorMessage)
      } finally {
        setIsSubmitting((prev) => ({ ...prev, [app]: false }))
      }
    },
    [error.connectionRequests, formValues, integrationName, onSubmit],
  )

  const handleRedirect = useCallback((app: string, url: string) => (onRedirect ? onRedirect(app, url) : window.open(url, '_blank')), [onRedirect])

  return (
    <Card className='bg-card border-input w-full max-w-md shadow-lg dark:bg-gray-950'>
      <CardHeader className='pb-2'>
        <div className='flex items-center space-x-3'>
          {integrationLogo ? (
            <Image src={integrationLogo || '/placeholder.svg'} alt='Integration logo' className='h-8 w-8 rounded-full' width={32} height={32} />
          ) : (
            <KeyRound className='h-5 w-5 text-blue-400' />
          )}
          <h3 className='text-primary text-lg font-medium'>Authentication Required</h3>
        </div>
        <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
          {integrationName ? error.error.replace(integrationName, capitalizeFirstLetter(integrationName)) : error.error}
        </p>
      </CardHeader>

      <CardContent>
        <div className='space-y-4'>
          {error.connectionRequests.map((request) => (
            <div key={request.app} className='space-y-3'>
              {error.connectionRequests.length > 1 && <div className='text-muted-foreground text-sm font-medium capitalize'>{request.app}</div>}

              {request.type === 'API_KEY' && request.fields && (
                <form onSubmit={(e) => handleSubmit(request.app, e)} className='space-y-3'>
                  {Object.entries(request.fields).map(([fieldName, field]) => (
                    <div key={fieldName}>
                      <label htmlFor={`${request.app}_${fieldName}`} className='mb-1 block text-sm text-zinc-600 dark:text-zinc-400'>
                        {field.displayName || field.name}
                        {field.required && <span className='ml-1 text-zinc-500 dark:text-zinc-400'>*</span>}
                      </label>
                      <Input
                        id={`${request.app}_${fieldName}`}
                        name={fieldName}
                        type={field.is_secret ? 'password' : field.type === 'number' ? 'number' : 'text'}
                        value={formValues[request.app]?.[fieldName] || ''}
                        onChange={(e) => handleInputChange(request.app, fieldName, e.target.value)}
                        placeholder={field.displayName || field.name}
                        required={field.required}
                      />
                      {field.description && <p className='mt-1 text-xs text-gray-500'>{field.description}</p>}
                    </div>
                  ))}
                  <Button type='submit' disabled={isSubmitting[request.app]} className='mt-2 w-full cursor-pointer bg-blue-600 text-white hover:bg-blue-700'>
                    {isSubmitting[request.app] ? 'Authenticating...' : 'Continue'}
                  </Button>
                </form>
              )}

              {(request.type === 'OAUTH' || request.type === 'OAUTH2') && request.redirectUrl && (
                <div className='py-1'>
                  <Button onClick={() => handleRedirect(request.app, request.redirectUrl!)} className='w-full flex-1 cursor-pointer'>
                    <div className='flex w-full items-center justify-center'>
                      <span>Connect with {request.app}</span>
                      <ExternalLink className='ml-2 h-4 w-4' />
                    </div>
                  </Button>
                  <p className='text-muted-foreground mt-1.5 text-xs'>You'll be redirected to {request.app} to authorize access</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className='flex justify-end space-x-2 pt-2'>
        {onCancel && (
          <Button variant='ghost' onClick={onCancel} className='cursor-pointer text-gray-400 hover:bg-gray-900 hover:text-white'>
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
