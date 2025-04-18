import { z } from 'zod'
import React from 'react'

/**
 * Higher-order component for validating component props
 */
export function withValidation<T extends object>(Component: React.ComponentType<T>, validate: (props: T) => boolean, displayName: string): React.FC<T> {
  const WrappedComponent: React.FC<T> = (props: T) => {
    if (!validate(props)) {
      console.error(`Invalid props passed to ${displayName}:`, props)
    }
    return React.createElement(Component, props as React.ComponentProps<typeof Component>)
  }

  WrappedComponent.displayName = `Validated(${displayName})`
  return WrappedComponent
}

/**
 * Validation schema for layout components
 */
export const layoutSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  background: z.string().optional(),
  duration: z.number().positive().optional(),
  transition: z.string().optional(),
})

/**
 * Validation schema for media components
 */
export const mediaSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  duration: z.number().positive().optional(),
  transition: z.string().optional(),
})

/**
 * Validation schema for voiceover component
 */
export const voiceoverSchema = z.object({
  text: z.string(),
  voice: z.string().optional(),
})

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
