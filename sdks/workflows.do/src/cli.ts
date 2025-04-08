import { API } from './client.js'
import fs from 'node:fs'
import path from 'node:path'

export interface CliOptions {
  apiKey?: string
  baseUrl?: string
  configPath?: string
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
    return Promise.resolve()
  }

  /**
   * Push local resources to remote
   */
  async push(options: { resources?: string[] } = {}): Promise<void> {
    console.log('Pushing resources to workflows.do...')
    return Promise.resolve()
  }

  /**
   * Sync local and remote resources
   */
  async sync(): Promise<void> {
    console.log('Syncing resources with workflows.do...')
    return Promise.resolve()
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
      skipped: 0,
      failed: 0,
      files: [] as Array<{ path: string; status: string; message?: string }>,
    }

    if (dryRun) {
      if (verbose) console.log('Dry run mode, not registering workflows')
      results.files = workflowFiles.map((file) => ({ path: file, status: 'would_register' }))
      return results
    }

    for (const file of workflowFiles) {
      try {
        if (verbose) console.log(`Processing ${file}...`)
        const workflowDefinition = await this.extractWorkflowFromFile(file)

        if (!workflowDefinition) {
          if (verbose) console.log(`No valid workflow definition found in ${file}, skipping`)
          results.skipped++
          results.files.push({ path: file, status: 'skipped', message: 'No valid workflow definition found' })
          continue
        }

        if (verbose) console.log(`Registering workflow from ${file}...`)
        if (!dryRun) {
          await this.api.registerWorkflow(workflowDefinition)
        }
        results.registered++
        results.files.push({ path: file, status: 'registered' })
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

            const hasWorkflowImport = /import.*\{.*AI.*\}.*from ['"](?:workflows\.do|ai-workflows)['"]/.test(fileContent)
            const hasAICall = /export\s+(?:default|const\s+\w+\s*=)\s*AI\s*\(/.test(fileContent)

            if (hasWorkflowImport && hasAICall) {
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
}
