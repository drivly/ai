import { API } from './client.js'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'crypto'

export interface CliOptions {
  apiKey?: string
  baseUrl?: string
  configPath?: string
}

export interface SyncConfig {
  syncMode: 'database' | 'local' | 'github'
  github?: {
    repository: string
    branch?: string
    createPRs?: boolean
    prTemplate?: string
  }
  trackFiles?: string[]
}

export class CLI {
  private api: API
  private configPath: string

  constructor(options: CliOptions = {}) {
    this.api = new API({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
    })
    this.configPath = options.configPath || '.ai/config.json'
  }

  /**
   * Initialize a new project with .ai configuration
   */
  async init(options: { force?: boolean } = {}): Promise<void> {
    console.log('Initializing workflows.do project...')
    return Promise.resolve()
  }

  /**
   * Login to workflows.do and store credentials
   */
  async login(options: { token?: string } = {}): Promise<void> {
    console.log('Logging in to workflows.do...')
    return Promise.resolve()
  }

  /**
   * Logout and remove stored credentials
   */
  async logout(): Promise<void> {
    console.log('Logging out from workflows.do...')
    return Promise.resolve()
  }

  /**
   * Pull remote resources to local project
   */
  async pull(options: { resources?: string[] } = {}): Promise<void> {
    console.log('Pulling resources from workflows.do...')

    try {
      const config = await this.loadConfig()
      const syncConfig = (config.sync as SyncConfig) || { syncMode: 'database', trackFiles: ['*.json', '*.ts'] }

      if (syncConfig.syncMode === 'local') {
        console.log('Skipping pull: local is configured as source of truth')
        return
      }

      console.log('Fetching remote file list...')
      const remoteFiles = (await this.api.post('/v1/ai/files/list', { resources: options.resources })) as any[]

      await fs.promises.mkdir('.ai', { recursive: true })

      console.log(`Pulling ${remoteFiles.length} files from remote...`)
      for (const file of remoteFiles) {
        const fileContent = (await this.api.post('/v1/ai/files/get', { path: file.path })) as { content: string }
        const localPath = path.join('.ai', file.path)

        await fs.promises.mkdir(path.dirname(localPath), { recursive: true })
        await fs.promises.writeFile(localPath, fileContent.content, 'utf8')

        console.log(`Pulled: ${file.path}`)
      }

      console.log('Pull completed successfully')
    } catch (error) {
      console.error('Error pulling resources:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  /**
   * Push local resources to remote
   */
  async push(options: { resources?: string[] } = {}): Promise<void> {
    console.log('Pushing resources to workflows.do...')

    try {
      const config = await this.loadConfig()
      const syncConfig = (config.sync as SyncConfig) || { syncMode: 'database', trackFiles: ['*.json', '*.ts'] }

      if (syncConfig.syncMode === 'database' || syncConfig.syncMode === 'github') {
        console.log(`Skipping push: ${syncConfig.syncMode} is configured as source of truth`)
        return
      }

      console.log('Scanning local files...')
      const localFiles = await this.getLocalFiles(options.resources)

      console.log(`Pushing ${localFiles.length} files to remote...`)
      for (const file of localFiles) {
        const fileContent = await fs.promises.readFile(file.path, 'utf8')

        await this.api.post('/v1/ai/files/update', {
          path: file.relativePath,
          content: fileContent,
        })

        console.log(`Pushed: ${file.relativePath}`)
      }

      console.log('Push completed successfully')
    } catch (error) {
      console.error('Error pushing resources:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  /**
   * Sync local and remote resources
   */
  async sync(options: { mode?: 'database' | 'local' | 'github' } = {}): Promise<void> {
    console.log('Syncing resources with workflows.do...')

    try {
      const config = await this.loadConfig()
      const syncConfig = (config.sync as SyncConfig) || { syncMode: 'database', trackFiles: ['*.json', '*.ts'] }

      const syncMode = options.mode || syncConfig.syncMode || 'database'
      console.log(`Sync mode: ${syncMode}`)

      console.log('Gathering file information...')
      const localFiles = await this.getLocalFileData()
      const remoteFiles = await this.getRemoteFileData()
      let githubFiles: Record<string, any> = {}

      if (syncConfig.github?.repository) {
        githubFiles = await this.getGithubFileData(syncConfig.github.repository, syncConfig.github.branch)
      }

      switch (syncMode) {
        case 'database':
          await this.syncFromDatabase(remoteFiles, localFiles, githubFiles, syncConfig)
          break
        case 'local':
          await this.syncFromLocal(localFiles, remoteFiles, githubFiles, syncConfig)
          break
        case 'github':
          if (!syncConfig.github?.repository) {
            throw new Error('GitHub repository not configured in .ai/config.json')
          }
          await this.syncFromGithub(githubFiles, localFiles, remoteFiles, syncConfig)
          break
      }

      console.log('Sync completed successfully')
    } catch (error) {
      console.error('Error syncing resources:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  /**
   * List resources of a specific collection
   */
  async list(collection: string, query: any = {}): Promise<any> {
    console.log(`Listing ${collection}...`)
    return this.api.list(collection, query)
  }

  /**
   * Get a specific resource by ID
   */
  async get(collection: string, id: string): Promise<any> {
    console.log(`Getting ${collection} ${id}...`)
    return this.api.getById(collection, id)
  }

  /**
   * Create a new resource
   */
  async create(collection: string, data: any): Promise<any> {
    console.log(`Creating new ${collection}...`)
    return this.api.create(collection, data)
  }

  /**
   * Update an existing resource
   */
  async update(collection: string, id: string, data: any): Promise<any> {
    console.log(`Updating ${collection} ${id}...`)
    return this.api.update(collection, id, data)
  }

  /**
   * Delete a resource
   */
  async delete(collection: string, id: string): Promise<any> {
    console.log(`Deleting ${collection} ${id}...`)
    return this.api.remove(collection, id)
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, input: Record<string, any>, options: any = {}): Promise<any> {
    console.log(`Executing workflow ${workflowId}...`)
    return this.api.executeWorkflow(workflowId, input, options)
  }

  /**
   * Register a workflow
   */
  async registerWorkflow(workflowDefinition: any): Promise<any> {
    console.log('Registering workflow...')
    return this.api.registerWorkflow(workflowDefinition)
  }

  /**
   * Scan a directory for workflow files and register them
   */
  async scanAndRegisterWorkflows(directoryPath: string, options: { recursive?: boolean; dryRun?: boolean; verbose?: boolean } = {}): Promise<any> {
    const { recursive = false, dryRun = false, verbose = false } = options

    if (verbose) console.log(`Scanning ${directoryPath} for workflow files${recursive ? ' recursively' : ''}...`)

    const workflowFiles = await this.findWorkflowFiles(directoryPath, { recursive, verbose })

    if (verbose) console.log(`Found ${workflowFiles.length} potential workflow files`)

    const results = {
      scanned: workflowFiles.length,
      registered: 0,
      eventHandlersRegistered: 0,
      skipped: 0,
      failed: 0,
      files: [] as Array<{ path: string; status: string; message?: string }>,
    }

    if (dryRun) {
      if (verbose) console.log('Dry run mode, not registering workflows or event handlers')
      results.files = workflowFiles.map((file) => ({ path: file, status: 'would_register' }))
      return results
    }

    for (const file of workflowFiles) {
      try {
        if (verbose) console.log(`Processing ${file}...`)
        const workflowDefinition = await this.extractWorkflowFromFile(file)
        const eventHandlers = await this.extractEventHandlersFromFile(file)

        let fileRegistered = false

        if (workflowDefinition) {
          if (verbose) console.log(`Registering workflow from ${file}...`)
          if (!dryRun) {
            await this.api.registerWorkflow(workflowDefinition)
          }
          results.registered++
          fileRegistered = true
        }

        if (eventHandlers.length > 0) {
          if (verbose) console.log(`Registering ${eventHandlers.length} event handlers from ${file}...`)
          if (!dryRun) {
            for (const handler of eventHandlers) {
              if (handler.type === 'event') {
                if (verbose) console.log(`Registering event handler for '${handler.event}'`)
                await this.api.post('/triggers/create', handler)
              } else if (handler.type === 'cron') {
                if (verbose) console.log(`Registering cron handler for '${handler.cron}'`)
                await this.api.post('/cron/schedule', handler)
              }
            }
          }
          results.eventHandlersRegistered += eventHandlers.length
          fileRegistered = true
        }

        if (fileRegistered) {
          results.files.push({ path: file, status: 'registered' })
        } else {
          if (verbose) console.log(`No valid workflow or event handlers found in ${file}, skipping`)
          results.skipped++
          results.files.push({ path: file, status: 'skipped', message: 'No valid workflow or event handlers found' })
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (verbose) console.error(`Error processing ${file}: ${errorMessage}`)
        results.failed++
        results.files.push({ path: file, status: 'failed', message: errorMessage })
      }
    }

    return results
  }

  /**
   * Find workflow files in a directory
   */
  private async findWorkflowFiles(directoryPath: string, options: { recursive?: boolean; verbose?: boolean } = {}): Promise<string[]> {
    const { recursive = false, verbose = false } = options
    const workflowFiles: string[] = []

    const readDirectory = async (dirPath: string) => {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)

        if (entry.isDirectory() && recursive) {
          await readDirectory(fullPath)
        } else if (entry.isFile() && /\.(js|ts|mjs|cjs)$/.test(entry.name)) {
          try {
            const fileContent = await fs.promises.readFile(fullPath, 'utf8')

            const hasWorkflowImport = /import.*\{.*(?:AI|on|every).*\}.*from ['"](?:workflows\.do|ai-workflows)['"]/.test(fileContent)
            const hasAICall = /export\s+(?:default|const\s+\w+\s*=)\s*AI\s*\(/.test(fileContent)
            const hasEventHandlers = /on\s*\(\s*['"][\w\.]+['"]\s*,\s*(?:async\s+)?\(/.test(fileContent) || /every\s*\(\s*['"][\w\s\*]+['"]\s*,\s*(?:async\s+)?\(/.test(fileContent)

            if (hasWorkflowImport && (hasAICall || hasEventHandlers)) {
              if (verbose) console.log(`Found workflow file: ${fullPath}`)
              workflowFiles.push(fullPath)
            }
          } catch (error) {
            if (verbose) {
              const errorMessage = error instanceof Error ? error.message : String(error)
              console.error(`Error reading file ${fullPath}: ${errorMessage}`)
            }
          }
        }
      }
    }

    await readDirectory(directoryPath)
    return workflowFiles
  }

  /**
   * Extract workflow definition from a file
   */
  private async extractWorkflowFromFile(filePath: string): Promise<any | null> {
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const fileExt = path.extname(filePath)

    try {
      const exportMatch = fileContent.match(/export\s+(?:default|const\s+(\w+)\s*=)\s*AI\s*\(\s*({[\s\S]*?})\s*\)/s)

      if (!exportMatch) return null

      const workflowName = exportMatch[1] || path.basename(filePath, fileExt)
      const workflowContentStr = exportMatch[2]

      const workflowDefinition: any = {
        name: workflowName,
        source: filePath,
        content: fileContent,
        functions: {},
      }

      const functionMatches = workflowContentStr.matchAll(/(\w+)\s*:\s*(?:async\s+)?\(?/g)

      for (const match of functionMatches) {
        const functionName = match[1]
        if (functionName && !['name', 'description'].includes(functionName)) {
          workflowDefinition.functions[functionName] = true
        }
      }

      return workflowDefinition
    } catch (error) {
      return null
    }
  }

  /**
   * Extract event handlers from a file
   * @param filePath Path to the file to extract event handlers from
   * @returns Array of event handler objects
   */
  private async extractEventHandlersFromFile(filePath: string): Promise<any[]> {
    const fileContent = await fs.promises.readFile(filePath, 'utf8')
    const handlers: any[] = []

    try {
      const onMatches = Array.from(fileContent.matchAll(/on\s*\(\s*['"]([^'"]+)['"]\s*,\s*((?:async\s+)?(?:\([^)]*\)|[^,]+)\s*=>?\s*\{[\s\S]*?(?:\}(?:\s*\)|\s*$)|\}\)|\}))/g))

      for (const match of onMatches) {
        handlers.push({
          type: 'event',
          event: match[1],
          handler: match[2].toString(),
          source: filePath,
        })
      }

      const everyMatches = Array.from(
        fileContent.matchAll(
          /every\s*\(\s*['"]([^'"]+)['"]\s*,\s*((?:async\s+)?(?:\([^)]*\)|[^,]+)\s*=>?\s*\{[\s\S]*?(?:\}(?:\s*\)|\s*,|\s*$)|\}\)|\}))\s*(?:,\s*(\{[\s\S]*?\}))?/g,
        ),
      )

      for (const match of everyMatches) {
        let options = {}
        if (match[3]) {
          try {
            const optionsStr = match[3].trim()
            const jsonStr = optionsStr
              .replace(/(\w+):/g, '"$1":') // Convert property names to quoted strings
              .replace(/'/g, '"') // Replace single quotes with double quotes
            options = JSON.parse(jsonStr)
          } catch (e) {
            options = { _raw: match[3] }
          }
        }

        handlers.push({
          type: 'cron',
          cron: match[1],
          handler: match[2].toString(),
          options,
          source: filePath,
        })
      }

      return handlers
    } catch (error) {
      console.error(`Error extracting event handlers from ${filePath}:`, error instanceof Error ? error.message : String(error))
      return []
    }
  }

  private async loadConfig(): Promise<any> {
    try {
      if (fs.existsSync(this.configPath)) {
        const configContent = await fs.promises.readFile(this.configPath, 'utf8')
        return JSON.parse(configContent)
      }
      return {}
    } catch (error) {
      console.error('Error loading config:', error instanceof Error ? error.message : String(error))
      return {}
    }
  }

  private async getLocalFiles(patterns?: string[]): Promise<Array<{ path: string; relativePath: string }>> {
    const aiDir = '.ai'

    if (!fs.existsSync(aiDir)) {
      return []
    }

    const defaultPatterns = ['.json', '.ts']
    const filePatterns = patterns || defaultPatterns

    const files: Array<{ path: string; relativePath: string }> = []

    const readDir = async (dir: string) => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relativePath = path.relative(aiDir, fullPath)

        if (entry.isDirectory()) {
          await readDir(fullPath)
        } else if (entry.isFile() && filePatterns.some((pattern) => (pattern.startsWith('*') ? entry.name.endsWith(pattern.slice(1)) : relativePath === pattern))) {
          files.push({
            path: fullPath,
            relativePath,
          })
        }
      }
    }

    await readDir(aiDir)
    return files
  }

  private async getLocalFileData(): Promise<Record<string, any>> {
    const files = await this.getLocalFiles()
    const fileData: Record<string, any> = {}

    for (const file of files) {
      const content = await fs.promises.readFile(file.path, 'utf8')
      const hash = createHash('sha256').update(content).digest('hex')
      const stats = await fs.promises.stat(file.path)

      fileData[file.relativePath] = {
        content,
        hash,
        lastModified: stats.mtime.toISOString(),
      }
    }

    return fileData
  }

  private async getRemoteFileData(): Promise<Record<string, any>> {
    try {
      const response = (await this.api.post('/v1/ai/files/list-with-metadata', {})) as any[]

      const fileData: Record<string, any> = {}
      for (const file of response || []) {
        fileData[file.path] = file
      }

      return fileData
    } catch (error) {
      console.error('Error getting remote file data:', error instanceof Error ? error.message : String(error))
      return {}
    }
  }

  private async getGithubFileData(repository: string, branch = 'main'): Promise<Record<string, any>> {
    try {
      const response = (await this.api.post('/v1/tasks/githubFileOperations', {
        repository,
        branch,
        path: '.ai',
        operation: 'list',
      })) as { success: boolean; error?: string; data?: any[] }

      if (!response.success) {
        throw new Error(response.error || 'Failed to list GitHub files')
      }

      const fileData: Record<string, any> = {}

      for (const item of response.data || []) {
        if (item.type === 'file') {
          const fileResponse = (await this.api.post('/v1/tasks/githubFileOperations', {
            repository,
            branch,
            path: item.path,
            operation: 'read',
          })) as { success: boolean; data?: any }

          if (fileResponse.success) {
            fileData[item.path.replace(/^.ai\//, '')] = fileResponse.data
          }
        }
      }

      return fileData
    } catch (error) {
      console.error('Error getting GitHub file data:', error instanceof Error ? error.message : String(error))
      return {}
    }
  }

  private async syncFromDatabase(source: Record<string, any>, local: Record<string, any>, github: Record<string, any>, config: SyncConfig): Promise<void> {
    console.log('Syncing from database as source of truth...')

    for (const [filePath, file] of Object.entries(source)) {
      const localFile = local[filePath]

      if (!localFile || localFile.hash !== file.contentHash) {
        console.log(`Updating local file: ${filePath}`)
        const localPath = `.ai/${filePath}`
        const dirPath = path.dirname(localPath)
        await fs.promises.mkdir(dirPath, { recursive: true })
        await fs.promises.writeFile(localPath, file.content, 'utf8')
      }

      if (config.github?.repository) {
        const githubFile = github[filePath]

        if (!githubFile || githubFile.contentHash !== file.contentHash) {
          console.log(`Updating GitHub file: ${filePath}`)
          await this.api.post('/v1/tasks/githubFileOperations', {
            repository: config.github.repository,
            branch: config.github.branch || 'main',
            path: `.ai/${filePath}`,
            content: file.content,
            operation: 'write',
            createPR: config.github.createPRs || false,
            prTitle: `Update .ai/${filePath} [.ai sync]`,
            prBody: `This PR contains changes from .ai folder sync operation.\n\nUpdated file: .ai/${filePath}`,
          })
        }
      }
    }
  }

  private async syncFromLocal(source: Record<string, any>, remote: Record<string, any>, github: Record<string, any>, config: SyncConfig): Promise<void> {
    console.log('Syncing from local files as source of truth...')

    for (const [filePath, file] of Object.entries(source)) {
      const remoteFile = remote[filePath]

      if (!remoteFile || remoteFile.contentHash !== file.hash) {
        console.log(`Updating remote file: ${filePath}`)
        await this.api.post('/v1/ai/files/update', {
          path: filePath,
          content: file.content,
        })
      }

      if (config.github?.repository) {
        const githubFile = github[filePath]

        if (!githubFile || githubFile.contentHash !== file.hash) {
          console.log(`Updating GitHub file: ${filePath}`)
          await this.api.post('/v1/tasks/githubFileOperations', {
            repository: config.github.repository,
            branch: config.github.branch || 'main',
            path: `.ai/${filePath}`,
            content: file.content,
            operation: 'write',
            createPR: config.github.createPRs || false,
            prTitle: `Update .ai/${filePath} [.ai sync]`,
            prBody: `This PR contains changes from .ai folder sync operation.\n\nUpdated file: .ai/${filePath}`,
          })
        }
      }
    }
  }

  private async syncFromGithub(source: Record<string, any>, local: Record<string, any>, remote: Record<string, any>, config: SyncConfig): Promise<void> {
    console.log('Syncing from GitHub as source of truth...')

    if (!config.github?.repository) {
      throw new Error('GitHub repository not configured')
    }

    for (const [filePath, file] of Object.entries(source)) {
      const localFile = local[filePath]
      const remoteFile = remote[filePath]

      if (!localFile || localFile.hash !== file.contentHash) {
        console.log(`Updating local file: ${filePath}`)
        const localPath = `.ai/${filePath}`
        const dirPath = path.dirname(localPath)
        await fs.promises.mkdir(dirPath, { recursive: true })
        await fs.promises.writeFile(localPath, file.content, 'utf8')
      }

      if (!remoteFile || remoteFile.contentHash !== file.contentHash) {
        console.log(`Updating remote file: ${filePath}`)
        await this.api.post('/v1/ai/files/update', {
          path: filePath,
          content: file.content,
        })
      }
    }
  }
}
