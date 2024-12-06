import fs from 'fs/promises'
import fg from 'fast-glob'

export const read = async (path: string): Promise<string> => {
  return fs.readFile(path, 'utf8')
}

export const readAll = async (pattern: string): Promise<string[]> => {
  return fg(pattern)
}
