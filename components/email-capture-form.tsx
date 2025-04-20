'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import React from 'react'

interface EmailCaptureFormProps {
  domain: string
  className?: string
}

export function EmailCaptureForm({ domain, className }: EmailCaptureFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, domain }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to submit email')
      }

      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={cn('rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-900/20', className)}>
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-400">Thanks for joining our waitlist!</h3>
        <p className="mt-2 text-green-700 dark:text-green-300">
          We'll notify you when {domain} launches. In the meantime, check out our other projects.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border p-6 shadow-sm', className)}>
      <h3 className="text-xl font-semibold">Join the Waitlist</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Be the first to know when {domain} launches.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isSubmitting}
            aria-label="Email address"
          />
          <Button type="submit" disabled={isSubmitting} className="whitespace-nowrap">
            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
          </Button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>
    </div>
  )
}
