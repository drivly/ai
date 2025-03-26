import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function objectKeys<TObj extends object>(obj: TObj) {
  return Object.keys(obj) as (keyof TObj)[]
}
