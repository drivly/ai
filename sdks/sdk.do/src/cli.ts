import { API } from './client.js'
import { ConfigManager } from './config.js'
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
  private configManager: ConfigManager

  constructor(options: CliOptions = {}) {
    this.api = new API({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
    })
    this.configPath = options.configPath || '.ai/config.json'
    this.configManager = new ConfigManager(this.configPath)
  }

  /**
   * Initialize a new package
   */
  async init(options: { name?: string; force?: boolean } = {}): Promise<void> {
    console.log('Initializing new package...')

    try {
      const packageName = options.name || path.basename(process.cwd())
      const packageDir = '.'

      if (fs.existsSync(path.join(packageDir, 'package.json')) && !options.force) {
        throw new Error('Package already exists. Use --force to overwrite.')
      }

      const directories = ['src', 'dist', 'src/__tests__']

      for (const dir of directories) {
        await fs.promises.mkdir(path.join(packageDir, dir), { recursive: true })
      }

      const packageJson = {
        name: packageName,
        version: '0.0.1',
        description: `${packageName} package`,
        type: 'module',
        main: 'dist/index.js',
        module: 'dist/index.js',
        types: 'dist/index.d.ts',
        exports: {
          '.': {
            import: './dist/index.js',
            types: './dist/index.d.ts',
          },
        },
        files: ['dist', 'README.md'],
        scripts: {
          build: 'tsc',
          test: 'vitest run',
          'test:watch': 'vitest',
          dev: 'tsc --watch',
          typecheck: 'tsc --noEmit',
          lint: 'eslint .',
        },
        dependencies: {
          'apis.do': '0.0.1',
        },
        devDependencies: {
          typescript: '^5.0.0',
          vitest: '^0.34.0',
        },
        license: 'MIT',
      }

      await fs.promises.writeFile(path.join(packageDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8')

      const tsConfig = {
        extends: '../../tsconfig.base.json',
        compilerOptions: {
          outDir: './dist',
          rootDir: './src',
        },
        include: ['src/**/*'],
      }

      await fs.promises.writeFile(path.join(packageDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2), 'utf8')

      const indexContent = `export * from './client.js'
export * from './types.js'
`

      const typesContent = `export interface Config {
}
`

      const clientContent = `export class Client {
  constructor(options = {}) {
  }
  
}
`

      await fs.promises.writeFile(path.join(packageDir, 'src/index.ts'), indexContent, 'utf8')
      await fs.promises.writeFile(path.join(packageDir, 'src/types.ts'), typesContent, 'utf8')
      await fs.promises.writeFile(path.join(packageDir, 'src/client.ts'), clientContent, 'utf8')

      const readmeContent = `# ${packageName}

A package created with sdk.do.

## Installation

\`\`\`bash
npm install ${packageName}
\`\`\`

## Usage

\`\`\`typescript
import { Client } from '${packageName}'

const client = new Client()
\`\`\`
`

      await fs.promises.writeFile(path.join(packageDir, 'README.md'), readmeContent, 'utf8')

      console.log(`Package ${packageName} initialized successfully!`)
    } catch (error) {
      console.error('Error initializing package:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  /**
   * Login to sdk.do and store credentials
   */
  async login(options: { token?: string } = {}): Promise<void> {
    console.log('Logging in to sdk.do...')

    try {
      let token = options.token || process.env.SDK_DO_TOKEN

      if (!token) {
        throw new Error('No token provided. Please provide a token with --token or set the SDK_DO_TOKEN environment variable.')
      }

      const validation = await this.api.validateToken(token)

      if (!validation.valid) {
        throw new Error('Invalid token. Please check your token and try again.')
      }

      await this.configManager.update({ token })

      console.log('Successfully logged in to sdk.do')
    } catch (error) {
      console.error('Login failed:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  /**
   * Logout and remove stored credentials
   */
  async logout(): Promise<void> {
    console.log('Logging out from sdk.do...')

    try {
      await this.configManager.remove('token')

      console.log('Successfully logged out from sdk.do')
    } catch (error) {
      console.error('Logout failed:', error instanceof Error ? error.message : String(error))
      throw error
    }
  }

  /**
   * List all packages
   */
  async listPackages(): Promise<any> {
    console.log('Listing packages...')
    return this.api.listPackages()
  }

  /**
   * Create a new package
   */
  async createPackage(name: string, options: { collections?: string[] } = {}): Promise<any> {
    console.log(`Creating package ${name}...`)
    const packageData = {
      name,
      package: {
        name,
        version: '0.0.1',
        description: `${name} package`,
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        files: ['dist', 'README.md'],
        license: 'MIT',
      },
      collections: options.collections?.map((collection) => ({ collection })) || [],
    }
    return this.api.createPackage(packageData)
  }

  /**
   * Add a collection to a package
   */
  async addCollection(packageId: string, collection: string): Promise<any> {
    console.log(`Adding ${collection} to package ${packageId}...`)
    return this.api.addCollectionToPackage(packageId, collection)
  }

  /**
   * Remove a collection from a package
   */
  async removeCollection(packageId: string, collection: string): Promise<any> {
    console.log(`Removing ${collection} from package ${packageId}...`)
    return this.api.removeCollectionFromPackage(packageId, collection)
  }

  /**
   * Update package.json for a package
   */
  async updatePackageJson(packageId: string, packageJson: any): Promise<any> {
    console.log(`Updating package.json for package ${packageId}...`)
    return this.api.updatePackageJson(packageId, packageJson)
  }

  /**
   * Publish a package to NPM
   */
  async publish(packageId: string, options: { tag?: string; dryRun?: boolean } = {}): Promise<any> {
    const action = options.dryRun ? 'Dry run publishing' : 'Publishing'
    console.log(`${action} package ${packageId} to NPM...`)
    return this.api.publishPackage(packageId, options)
  }
}
