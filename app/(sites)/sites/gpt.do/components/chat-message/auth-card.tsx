'use client'

import { ChipTabs } from '@/components/shared/chip-tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { capitalizeFirstLetter } from '@/lib/utils'
import type { ToolAuthorizationError } from '@/sdks/llm.do/src'
import { KeyRound } from 'lucide-react'
import Image from 'next/image'
import { type FormEvent, Fragment, useCallback, useState } from 'react'
import { toast } from 'sonner'
import { OAuthCard } from './oauth-card'

interface AuthCardProps {
  connection: ToolAuthorizationError['connectionRequests'][number]
  onSubmit?: (app: string, values: Record<string, string>) => void
  onRedirect?: (app: string, url: string) => void
  onCancel?: () => void
  integrationLogo?: string
  integrationName?: string
}

export function AuthCard({ connection, onSubmit, onRedirect, onCancel, integrationLogo, integrationName }: AuthCardProps) {
  const initialValues: Record<string, Record<string, string>> = {}
  connection.methods.forEach((method) => {
    if (method?.fields) {
      initialValues[connection.app] = {}
      Object.entries(method.fields).forEach(([fieldName, field]) => {
        initialValues[connection.app][fieldName] = ''
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
      const apiKeyMethod = connection.methods.find((method) => method.type === 'API_KEY')

      if (apiKeyMethod?.fields) {
        Object.entries(apiKeyMethod.fields).forEach(([fieldName, field]) => {
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
    [connection.methods, formValues, integrationName, onSubmit],
  )

  const handleRedirect = useCallback((app: string, url: string) => (onRedirect ? onRedirect(app, url) : window.open(url, '_blank')), [onRedirect])

  // Extract all available authorization methods from all connection requests
  const availableAuthMethods = connection.methods.map((method) => method.type).filter((value, index, self) => self.indexOf(value) === index)

  return (
    <Card className='bg-card border-input w-full max-w-md shadow-sm dark:border-zinc-700/60 dark:bg-zinc-800/40'>
      <CardHeader>
        <div className='flex items-center space-x-3'>
          {integrationLogo ? (
            <Image src={integrationLogo} alt='Integration logo' className='h-8 w-8 rounded-full' width={32} height={32} />
          ) : (
            <KeyRound className='h-5 w-5 text-blue-400' />
          )}
          <CardTitle className='text-primary text-lg font-medium'>Authentication Required</CardTitle>
        </div>
        <CardDescription className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
          {integrationName ? connection.description.replace(integrationName, capitalizeFirstLetter(integrationName)) : connection.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChipTabs
          tabs={availableAuthMethods}
          options={connection.methods}
          renderOption={(method, selected) => (
            <Fragment>
              {!method.type.includes('OAUTH') && method.fields && selected === method.type && (
                <form onSubmit={(e) => handleSubmit(connection.app, e)} className='flex w-full flex-col'>
                  {Object.entries(method.fields).map(([fieldName, field]) => (
                    <div key={fieldName} className='pb-6'>
                      <label htmlFor={`${connection.app}_${fieldName}`} className='mb-1 block text-sm text-zinc-600 dark:text-zinc-400'>
                        {field.displayName || field.name}
                        {field.required && <span className='text-zinc-500 dark:text-zinc-400'>*</span>}
                      </label>
                      <Input
                        id={`${connection.app}_${fieldName}`}
                        name={fieldName}
                        type={field.is_secret ? 'password' : field.type === 'number' ? 'number' : 'text'}
                        value={formValues[connection.app]?.[fieldName] || ''}
                        onChange={(e) => handleInputChange(connection.app, fieldName, e.target.value)}
                        placeholder={`Enter your ` + field.displayName || field.name}
                        required={field.required}
                      />
                      {field.description && <p className='mt-1.5 text-xs text-gray-500'>{field.description}</p>}
                    </div>
                  ))}
                  <div className='flex w-full items-center justify-center gap-2'>
                    {onCancel && (
                      <Button variant='ghost' onClick={onCancel} className='w-full flex-1 cursor-pointer text-gray-400 hover:bg-gray-900 hover:text-white'>
                        Cancel
                      </Button>
                    )}
                    <Button type='submit' disabled={isSubmitting[connection.app]} className='flex-1 cursor-pointer'>
                      {isSubmitting[connection.app] ? 'Authenticating...' : 'Continue'}
                    </Button>
                  </div>
                </form>
              )}

              {method.type.includes('OAUTH') && method.redirectUrl && selected === method.type && (
                <OAuthCard integrationName={connection.app} redirectUrl={method.redirectUrl} onCancel={onCancel} onConnect={handleRedirect} />
              )}
            </Fragment>
          )}
        />
      </CardContent>
    </Card>
  )
}

{
  /* {request.methods.map((method) => {
    if (method.type === 'API_KEY' && method.fields && selected === 'API_KEY') {
      return (
        <form key={`${request.app}_api_key`} onSubmit={(e) => handleSubmit(request.app, e)} className='flex w-full flex-col'>
          {Object.entries(method.fields).map(([fieldName, field]) => (
            <div key={fieldName} className='pb-6'>
              <label htmlFor={`${request.app}_${fieldName}`} className='mb-1 block text-sm text-zinc-600 dark:text-zinc-400'>
                {field.displayName || field.name}
                {field.required && <span className='text-zinc-500 dark:text-zinc-400'>*</span>}
              </label>
              <Input
                id={`${request.app}_${fieldName}`}
                name={fieldName}
                type={field.is_secret ? 'password' : field.type === 'number' ? 'number' : 'text'}
                value={formValues[request.app]?.[fieldName] || ''}
                onChange={(e) => handleInputChange(request.app, fieldName, e.target.value)}
                placeholder={`Enter your ` + field.displayName || field.name}
                required={field.required}
              />
              {field.description && <p className='mt-1.5 text-xs text-gray-500'>{field.description}</p>}
            </div>
          ))}
          <div className='flex w-full items-center justify-center gap-2'>
            {onCancel && (
              <Button variant='ghost' onClick={onCancel} className='w-full flex-1 cursor-pointer text-gray-400 hover:bg-gray-900 hover:text-white'>
                Cancel
              </Button>
            )}
            <Button type='submit' disabled={isSubmitting[request.app]} className='flex-1 cursor-pointer'>
              {isSubmitting[request.app] ? 'Authenticating...' : 'Continue'}
            </Button>
          </div>
        </form>
      )
    }

    if ((method.type === 'OAUTH' || method.type === 'OAUTH2') && method.redirectUrl && selected === method.type) {
      return (
        <OAuthCard
          key={`${request.app}_oauth`}
          integrationName={request.app}
          redirectUrl={method.redirectUrl}
          onCancel={onCancel}
          onConnect={handleRedirect}
          icon={request.icon}
          description={request.description}
        />
      )
    }

    return null
  })} */
}
