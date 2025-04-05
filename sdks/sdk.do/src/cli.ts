import { API } from './client.js'

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
   * Initialize a new package
   */
  async init(options: { name?: string; force?: boolean } = {}): Promise<void> {
    console.log('Initializing new package...')
    return Promise.resolve()
  }

  /**
   * Login to sdk.do and store credentials
   */
  async login(options: { token?: string } = {}): Promise<void> {
    console.log('Logging in to sdk.do...')
    return Promise.resolve()
  }

  /**
   * Logout and remove stored credentials
   */
  async logout(): Promise<void> {
    console.log('Logging out from sdk.do...')
    return Promise.resolve()
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
