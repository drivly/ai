import { API } from './client'
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
    console.log('Initializing .ai project...')
    
    const projectDir = process.cwd()
    const aiDir = path.join(projectDir, '.ai')
    
    if (!fs.existsSync(aiDir)) {
      await fs.promises.mkdir(aiDir, { recursive: true })
      console.log('Created .ai directory')
    } else if (!options.force) {
      console.log('.ai directory already exists, use --force to overwrite')
    }
    
    const configPath = path.join(aiDir, 'config.json')
    if (!fs.existsSync(configPath) || options.force) {
      const defaultConfig = {
        sync: {
          syncMode: 'database',
          trackFiles: ['*.json', '*.ts']
        }
      }
      
      await fs.promises.writeFile(
        configPath, 
        JSON.stringify(defaultConfig, null, 2),
        'utf8'
      )
      console.log('Created default config file at .ai/config.json')
    }
    
    return Promise.resolve()
  }

  /**
   * Login to apis.do and store credentials
   */
  async login(options: { token?: string } = {}): Promise<void> {
    console.log('Logging in to apis.do...')
    return Promise.resolve()
  }

  /**
   * Logout and remove stored credentials
   */
  async logout(): Promise<void> {
    console.log('Logging out from apis.do...')
    return Promise.resolve()
  }

  /**
   * Pull remote resources to local project
   */
  async pull(options: { resources?: string[] } = {}): Promise<void> {
    console.log('Pulling resources from apis.do...')
    
    try {
      const config = await this.loadConfig()
      const syncConfig = config.sync as SyncConfig || { syncMode: 'database', trackFiles: ['*.json', '*.ts'] }
      
      if (syncConfig.syncMode === 'local') {
        console.log('Skipping pull: local is configured as source of truth')
        return
      }
      
      console.log('Fetching remote file list...')
      const remoteFiles = await this.api.post('/v1/ai/files/list', { resources: options.resources })
      const files = Array.isArray(remoteFiles) ? remoteFiles : []
      
      await fs.promises.mkdir('.ai', { recursive: true })
      
      console.log(`Pulling ${files.length} files from remote...`)
      for (const file of files) {
        const fileContent = await this.api.post('/v1/ai/files/get', { path: file.path }) as { content: string }
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
    console.log('Pushing resources to apis.do...')
    
    try {
      const config = await this.loadConfig()
      const syncConfig = config.sync as SyncConfig || { syncMode: 'database', trackFiles: ['*.json', '*.ts'] }
      
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
          content: fileContent
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
    console.log('Syncing resources with apis.do...')
    
    try {
      const config = await this.loadConfig()
      const syncConfig = config.sync as SyncConfig || { syncMode: 'database', trackFiles: ['*.json', '*.ts'] }
      
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
   * Execute a function
   */
  async executeFunction(functionId: string, inputs: any): Promise<any> {
    console.log(`Executing function ${functionId}...`)
    return this.api.post(`/v1/functions/${functionId}/execute`, inputs)
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
        } else if (entry.isFile() && filePatterns.some(pattern => 
          pattern.startsWith('*') ? entry.name.endsWith(pattern.slice(1)) : relativePath === pattern
        )) {
          files.push({
            path: fullPath,
            relativePath
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
        lastModified: stats.mtime.toISOString()
      }
    }
    
    return fileData
  }
  
  private async getRemoteFileData(): Promise<Record<string, any>> {
    try {
      const response = await this.api.post('/v1/ai/files/list-with-metadata', {}) as any[]
      
      const fileData: Record<string, any> = {}
      if (Array.isArray(response)) {
        for (const file of response) {
          if (file && file.path) {
            fileData[file.path] = file
          }
        }
      }
      
      return fileData
    } catch (error) {
      console.error('Error getting remote file data:', error instanceof Error ? error.message : String(error))
      return {}
    }
  }
  
  private async getGithubFileData(repository: string, branch = 'main'): Promise<Record<string, any>> {
    try {
      const response = await this.api.post('/v1/tasks/githubFileOperations', {
        repository,
        branch,
        path: '.ai',
        operation: 'list'
      }) as any
      
      if (!response) {
        throw new Error('Failed to list GitHub files: Invalid response')
      }
      
      if (!response.success) {
        const errorMsg = response.error ? String(response.error) : 'Failed to list GitHub files'
        throw new Error(errorMsg)
      }
      
      const fileData: Record<string, any> = {}
      
      if (Array.isArray(response.data)) {
        for (const item of response.data) {
          if (item && item.type === 'file' && item.path) {
            const fileResponse = await this.api.post('/v1/tasks/githubFileOperations', {
              repository,
              branch,
              path: item.path,
              operation: 'read'
            }) as any
            
            if (fileResponse && fileResponse.success && fileResponse.data) {
              fileData[item.path.replace(/^.ai\//, '')] = fileResponse.data
            }
          }
        }
      }
      
      return fileData
    } catch (error) {
      console.error('Error getting GitHub file data:', error instanceof Error ? error.message : String(error))
      return {}
    }
  }
  
  private async syncFromDatabase(
    source: Record<string, any>,
    local: Record<string, any>,
    github: Record<string, any>,
    config: SyncConfig
  ): Promise<void> {
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
            prBody: `This PR contains changes from .ai folder sync operation.\n\nUpdated file: .ai/${filePath}`
          })
        }
      }
    }
  }
  
  private async syncFromLocal(
    source: Record<string, any>,
    remote: Record<string, any>,
    github: Record<string, any>,
    config: SyncConfig
  ): Promise<void> {
    console.log('Syncing from local files as source of truth...')
    
    for (const [filePath, file] of Object.entries(source)) {
      const remoteFile = remote[filePath]
      
      if (!remoteFile || remoteFile.contentHash !== file.hash) {
        console.log(`Updating remote file: ${filePath}`)
        await this.api.post('/v1/ai/files/update', {
          path: filePath,
          content: file.content
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
            prBody: `This PR contains changes from .ai folder sync operation.\n\nUpdated file: .ai/${filePath}`
          })
        }
      }
    }
  }
  
  private async syncFromGithub(
    source: Record<string, any>,
    local: Record<string, any>,
    remote: Record<string, any>,
    config: SyncConfig
  ): Promise<void> {
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
          content: file.content
        })
      }
    }
  }

  /**
   * Helper function to copy template files to a project
   */
  protected async copyTemplateFiles(templateType: 'cli.do' | 'workflows.do' | 'business-as-code', options: { force?: boolean } = {}): Promise<void> {
    const projectDir = process.cwd()
    const templateDir = path.join(__dirname, `../../templates/sdks/${templateType}`)
    
    if (!fs.existsSync(templateDir)) {
      console.error(`Template directory not found: ${templateDir}`)
      return
    }
    
    const copyDir = async (source: string, destination: string) => {
      const entries = await fs.promises.readdir(source, { withFileTypes: true })
      
      await fs.promises.mkdir(destination, { recursive: true })
      
      for (const entry of entries) {
        const srcPath = path.join(source, entry.name)
        const destPath = path.join(destination, entry.name)
        
        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath)
        } else {
          if (!fs.existsSync(destPath) || options.force) {
            await fs.promises.copyFile(srcPath, destPath)
            console.log(`Created ${destPath}`)
          }
        }
      }
    }
    
    await copyDir(templateDir, projectDir)
    
    console.log(`${templateType} project initialization completed successfully`)
    console.log('Run "npm install" or "pnpm install" to install dependencies')
  }
}
