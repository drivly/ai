import fs from 'fs/promises'
import fg from 'fast-glob'
import chokidar from 'chokidar'
import { load, dump, MDXDocument } from './mdx'

export const db = new Proxy({} as Record<string, any>, {
  get: (target, prop) => {
    if (prop in target && typeof prop === 'string') {
      return target[prop]
    }
    return undefined
  }
})

export const read = async (path: string): Promise<string> => {
  return fs.readFile(path, 'utf8')
}

export const readAll = async (pattern: string): Promise<string[]> => {
  return fg(pattern)
}

export const write = async (path: string, content: string): Promise<void> => {
  return fs.writeFile(path, content)
}

export const exists = async (path: string): Promise<boolean> => {
  return fs.access(path).then(() => true).catch(() => false)
}

export const watch = async (
  path: string, 
  callback: (event: 'change' | 'add' | 'unlink', path: string) => void
): Promise<() => void> => {
  const watcher = chokidar.watch(path, {
    persistent: true,
    ignoreInitial: true
  })

  watcher.on('add', (path) => callback('add', path))
  watcher.on('change', (path) => callback('change', path))
  watcher.on('unlink', (path) => callback('unlink', path))

  // Return cleanup function
  return () => watcher.close()
}