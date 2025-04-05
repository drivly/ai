# sdk.do

SDK for publishing Functions, Workflows, and Databases to NPM.

## Installation

```bash
npm install sdk.do
# or
yarn add sdk.do
# or
pnpm add sdk.do
```

## Usage

### JavaScript/TypeScript SDK

```typescript
import { api } from 'sdk.do'

// List all packages
const packages = await api.listPackages()

// Create a new package
const newPackage = await api.createPackage({
  name: 'my-package',
  package: {
    name: 'my-package',
    version: '0.0.1',
    description: 'My package description',
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    files: ['dist', 'README.md'],
    license: 'MIT',
  },
  collections: [{ collection: 'functions' }, { collection: 'workflows' }],
})

// Add a collection to a package
await api.addCollectionToPackage('package-id', 'databases')

// Remove a collection from a package
await api.removeCollectionFromPackage('package-id', 'databases')

// Update package.json for a package
await api.updatePackageJson('package-id', {
  name: 'my-package',
  version: '0.0.2',
  description: 'Updated package description',
})

// Publish a package to NPM
await api.publishPackage('package-id', { tag: 'latest' })
```

### CLI

The SDK includes a CLI for managing packages from the command line.

```bash
# Initialize a new package
sdk init my-package

# Login to sdk.do
sdk login <token>

# List all packages
sdk list

# Create a new package with collections
sdk create my-package functions workflows

# Add a collection to a package
sdk add <package-id> databases

# Remove a collection from a package
sdk remove <package-id> databases

# Publish a package to NPM
sdk publish <package-id> --tag=latest
```

## API Reference

### API Class

#### `listPackages(params?: QueryParams): Promise<ListResponse<Package>>`

List all packages.

#### `getPackage(id: string): Promise<Package>`

Get a package by ID.

#### `createPackage(data: any): Promise<Package>`

Create a new package.

#### `updatePackage(id: string, data: any): Promise<Package>`

Update a package.

#### `deletePackage(id: string): Promise<Package>`

Delete a package.

#### `publishPackage(id: string, options: { tag?: string }): Promise<any>`

Publish a package to NPM.

#### `listFunctions(params?: QueryParams): Promise<ListResponse<any>>`

List all functions.

#### `listWorkflows(params?: QueryParams): Promise<ListResponse<any>>`

List all workflows.

#### `listDatabases(params?: QueryParams): Promise<ListResponse<any>>`

List all databases.

#### `addCollectionToPackage(packageId: string, collection: string): Promise<any>`

Add a collection to a package.

#### `removeCollectionFromPackage(packageId: string, collection: string): Promise<any>`

Remove a collection from a package.

#### `updatePackageJson(packageId: string, packageJson: any): Promise<any>`

Update package.json for a package.

### CLI Class

#### `init(options: { name?: string, force?: boolean }): Promise<void>`

Initialize a new package.

#### `login(options: { token?: string }): Promise<void>`

Login to sdk.do and store credentials.

#### `logout(): Promise<void>`

Logout and remove stored credentials.

#### `listPackages(): Promise<any>`

List all packages.

#### `createPackage(name: string, options: { collections?: string[] }): Promise<any>`

Create a new package.

#### `addCollection(packageId: string, collection: string): Promise<any>`

Add a collection to a package.

#### `removeCollection(packageId: string, collection: string): Promise<any>`

Remove a collection from a package.

#### `updatePackageJson(packageId: string, packageJson: any): Promise<any>`

Update package.json for a package.

#### `publish(packageId: string, options: { tag?: string, dryRun?: boolean }): Promise<any>`

Publish a package to NPM.

## Types

### Package

```typescript
interface Package {
  id: string
  name: string
  package: any
  collections: Array<{
    collection: string
  }>
}
```

### PublishOptions

```typescript
interface PublishOptions {
  tag?: string
  dryRun?: boolean
}
```

## License

MIT

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the `.do` ecosystem
