import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'crypto'

/**
 * Calculate SHA-256 hash of file content
 */
export const calculateFileHash = (content: string): string => {
  return createHash('sha256').update(content).digest('hex')
}

/**
 * Read a file and return its content and hash
 */
export const readFile = async (filePath: string): Promise<{ content: string; hash: string } | null> => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8')
    const hash = calculateFileHash(content)
    return { content, hash }
  } catch (error) {
    return null
  }
}

/**
 * Write content to a file, creating directories as needed
 */
export const writeFile = async (filePath: string, content: string): Promise<boolean> => {
  try {
    const dirPath = path.dirname(filePath)
    await fs.promises.mkdir(dirPath, { recursive: true })
    await fs.promises.writeFile(filePath, content, 'utf8')
    return true
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error)
    return false
  }
}

/**
 * Get list of files in a directory (recursively)
 */
export const getFilesInDirectory = async (
  dirPath: string,
  relativeTo: string = dirPath,
  filePattern: string | RegExp = /.*\.json|.*\.ts|.*\.js/,
): Promise<Array<{ path: string; relativePath: string }>> => {
  const files: Array<{ path: string; relativePath: string }> = []

  const readDir = async (currentPath: string) => {
    const entries = await fs.promises.readdir(currentPath, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name)
      const relativePath = path.relative(relativeTo, entryPath)

      if (entry.isDirectory()) {
        await readDir(entryPath)
      } else if (entry.isFile() && (typeof filePattern === 'string' ? entry.name.match(filePattern) : filePattern.test(entry.name))) {
        files.push({
          path: entryPath,
          relativePath,
        })
      }
    }
  }

  await readDir(dirPath)
  return files
}
