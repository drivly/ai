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
          return undefined
        }

        // Determine the base pattern based on whether it's nested or not
        const fullPath = ['list', 'get', 'set', 'delete'].includes(nestedProp)
          ? prop
          : `${prop}.${nestedProp}`.replace(/\./g, '/')
        const basePattern = `./${fullPath}`

        if (nestedProp === 'list') {
          return async (options?: ListOptions) => {
            const dirExists = await exists(basePattern)
            if (!dirExists) {
              return []
            }
            let files = await fg(`${basePattern}/*.mdx`)
            
            // Apply skip and take pagination if options are provided
            if (options?.skip) {
              files = files.slice(options.skip)
            }
            if (options?.take) {
              files = files.slice(0, options.take)
            }

            // Map the files to their contents
            return Promise.all(
              files.map(async (file) => {
                const content = await fs.readFile(file, 'utf8')
                return load(content)
              })
            )
          }
        }

        if (nestedProp === 'get') {
          return async (id: string) => {
            const file = `${basePattern}/${id}.mdx`
            try {
              const content = await fs.readFile(file, 'utf8')
              return load(content)
            } catch (error) {
              return undefined
            }
          }
        }

        if (nestedProp === 'set') {
          return async (id: string, document: MDXDocument) => {
            await fs.mkdir(basePattern, { recursive: true })
            const content = await dump(document)
            await fs.writeFile(`${basePattern}/${id}.mdx`, content, 'utf8')
          }
        }

        if (nestedProp === 'delete') {
          return async (id: string) => {
            await fs.rm(`${basePattern}/${id}.mdx`)
          }
        }

        return new Proxy({} as any, {
          get: (__, finalProp) => {
            return db[fullPath][finalProp as string]
          }
        })
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
