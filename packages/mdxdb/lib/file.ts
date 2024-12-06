import fs from 'fs/promises'
import fg from 'fast-glob'
import chokidar from 'chokidar'
import { load, dump, MDXDocument } from './mdx'
import { DB, ListOptions } from './db'


export const db = new Proxy<DB>({} as DB, {
  get: (target, prop: string | symbol): DB[string] => {
    if (typeof prop !== 'string') {
      return undefined as unknown as DB[string]
    }

    return new Proxy({} as DB[string], {
      get: (_, nestedProp: string | symbol) => {
        if (typeof nestedProp !== 'string') {
          return undefined as unknown as DB[string]
        }

        // Combine the path parts
        const fullPath = `${prop}.${nestedProp}`.replace(/\./g, '/')
        const basePattern = `./${fullPath}`

        return {
          list: async (options?: ListOptions) => {
            let files = await fg(`${basePattern}/*.mdx`)

            // Apply pagination to files array before reading contents
            if (options?.skip || options?.take) {
              const start = options.skip || 0
              const end = options.take ? start + options.take : undefined
              files = files.slice(start, end)
            }

            const results: MDXDocument[] = []
            for (const file of files) {
              const content = await fs.readFile(file, 'utf8')
              const data = await load(content)
              results.push(data)
            }
            return results
          },

          get: async (id: string) => {
            const file = `${basePattern}/${id}.mdx`
            const content = await fs.readFile(file, 'utf8')
            return load(content)
          },

          set: async (id: string, document: MDXDocument) => {
            await fs.mkdir(basePattern, { recursive: true })
            const content = await dump(document)
            await fs.writeFile(`${basePattern}/${id}.mdx`, content, 'utf8')
          },

          delete: async (id: string) => {
            await fs.rm(`${basePattern}/${id}.mdx`)
          },
        }
      },
    })
  },
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
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

export const watch = async (path: string, callback: (event: 'change' | 'add' | 'unlink', path: string) => void): Promise<() => void> => {
  const watcher = chokidar.watch(path, {
    persistent: true,
    ignoreInitial: true,
  })

  watcher.on('add', (path) => callback('add', path))
  watcher.on('change', (path) => callback('change', path))
  watcher.on('unlink', (path) => callback('unlink', path))

  return () => watcher.close()
}
