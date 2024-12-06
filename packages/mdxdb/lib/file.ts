import fs from 'fs/promises'
import fg from 'fast-glob'
import chokidar from 'chokidar'
import { load, dump, MDXDocument } from './mdx'

// The db type: keys are collection names (e.g. 'blog'), values are always Promise<MDXDocument[]>
type DB = {
  [collection: string]: Promise<MDXDocument[]>;
};

export const db = new Proxy<DB>({} as DB, {
  get: (target, prop: string | symbol): Promise<MDXDocument[]> => {
    // If prop isn't a string, return an empty array promise.
    if (typeof prop !== 'string') {
      return Promise.resolve([])
    }
    
    const pattern = `./${prop}/*.mdx`
    return (async () => {
      const files = await fg(pattern)
      const results: MDXDocument[] = []
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8')
        const data = await load(content)
        results.push(data)
      }
      return results
    })()
  },

  set: (target, prop: string | symbol, value: MDXDocument[], receiver: any): boolean => {
    if (typeof prop !== 'string') {
      return false
    }
    if (!Array.isArray(value)) {
      throw new Error(`db.${String(prop)} must be set to an array of MDXDocument.`)
    }

    const dir = `./${prop}`
    // Start async operations but don't await them
    ;(async () => {
      await fs.mkdir(dir, { recursive: true })
      
      for (let i = 0; i < value.length; i++) {
        const content = await dump(value[i])
        const filename = `${dir}/entry-${i}.mdx`
        await fs.writeFile(filename, content, 'utf8')
      }

      const existingFiles = await fg(`${dir}/*.mdx`)
      if (existingFiles.length > value.length) {
        const filesToRemove = existingFiles.slice(value.length)
        for (const file of filesToRemove) {
          await fs.rm(file)
        }
      }
    })()

    return true
  }
})

export const read = async (path: string): Promise<string> => {
  return fs.readFile(path, 'utf8')
}

export const readAll = async (pattern: string): Promise<string[]> => {
  return fg(pattern)
}

export const write = async (path: string, content: string): Promise<void> => {
  return fs.writeFile(path, content, 'utf8')
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

  return () => watcher.close()
}