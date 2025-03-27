import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { getPayload } from 'payload'

/**
 * Payload API client for accessing collections and documents
 */
export class PayloadClient {
  private payload: any = null
  private connected: boolean = false

  constructor() {}

  /**
   * Initialize the client by loading config and connecting to Payload
   */
  async initialize(): Promise<void> {
    try {
      const workspaceFolders = vscode.workspace.workspaceFolders

      if (!workspaceFolders) {
        throw new Error('No workspace folder found')
      }

      const rootPath = workspaceFolders[0].uri.fsPath
      const configPath = path.join(rootPath, 'payload.config.ts')

      if (!fs.existsSync(configPath)) {
        throw new Error('payload.config.ts not found in workspace root')
      }

      // Check for .env file and load environment variables
      const envPath = path.join(rootPath, '.env')

      if (!fs.existsSync(envPath)) {
        throw new Error('.env file not found in workspace root. Please create it with DATABASE_URI=your_connection_string')
      }

      // Load .env file
      dotenv.config({ path: envPath })

      // Import the config dynamically
      // Note: In a real extension, we'd need to handle ESM/CJS differences
      try {
        // Try to dynamically import the config (this might need adjustments based on how the import works in extensions)
        const importedConfig = require(configPath).default

        // Initialize Payload with the config
        this.payload = await getPayload({
          config: importedConfig,
        })

        this.connected = true
        vscode.window.showInformationMessage('Connected to Payload CMS')
      } catch (importError) {
        console.error('Error importing config:', importError)
        throw new Error(`Failed to import payload.config.ts: ${importError instanceof Error ? importError.message : String(importError)}`)
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to initialize Payload client: ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }

  /**
   * Get all collections
   */
  async getCollections(): Promise<string[]> {
    if (!this.connected || !this.payload) {
      await this.initialize()
    }

    if (!this.payload) {
      throw new Error('Payload not initialized')
    }

    try {
      // Get collection names from the payload config
      const collections = Object.keys(this.payload.collections).filter((name) => !name.startsWith('payload-'))

      return collections.sort()
    } catch (error) {
      vscode.window.showErrorMessage(`Error fetching collections: ${error instanceof Error ? error.message : String(error)}`)
      return []
    }
  }

  /**
   * Get documents from a collection
   */
  async getDocuments(collectionName: string): Promise<any[]> {
    if (!this.connected || !this.payload) {
      await this.initialize()
    }

    if (!this.payload) {
      throw new Error('Payload not initialized')
    }

    try {
      // Use the Payload API to find documents
      const result = await this.payload.find({
        collection: collectionName,
        limit: 100,
      })

      return result.docs || []
    } catch (error) {
      vscode.window.showErrorMessage(`Error fetching documents: ${error instanceof Error ? error.message : String(error)}`)
      return []
    }
  }

  /**
   * Search documents in a collection
   */
  async searchDocuments(collectionName: string, searchTerm: string): Promise<any[]> {
    if (!this.connected || !this.payload) {
      await this.initialize()
    }

    if (!this.payload) {
      throw new Error('Payload not initialized')
    }

    try {
      // Create a simple search query
      // This could be improved with more specific field searches based on the collection
      const result = await this.payload.find({
        collection: collectionName,
        where: {
          // This is a simplified search, in reality you might want to search specific fields
          // based on the collection schema
          or: [{ name: { contains: searchTerm } }, { id: { contains: searchTerm } }],
        },
        limit: 50,
      })

      return result.docs || []
    } catch (error) {
      vscode.window.showErrorMessage(`Error searching documents: ${error instanceof Error ? error.message : String(error)}`)
      return []
    }
  }

  /**
   * Get a document by ID
   */
  async getDocument(collectionName: string, documentId: string): Promise<any> {
    if (!this.connected || !this.payload) {
      await this.initialize()
    }

    if (!this.payload) {
      throw new Error('Payload not initialized')
    }

    try {
      // Use the Payload API to find a document by ID
      const document = await this.payload.findByID({
        collection: collectionName,
        id: documentId,
      })

      if (!document) {
        throw new Error(`Document ${documentId} not found in collection ${collectionName}`)
      }

      return document
    } catch (error) {
      vscode.window.showErrorMessage(`Error fetching document: ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }

  /**
   * Update a document
   */
  async updateDocument(collectionName: string, documentId: string, data: any): Promise<void> {
    if (!this.connected || !this.payload) {
      await this.initialize()
    }

    if (!this.payload) {
      throw new Error('Payload not initialized')
    }

    try {
      // Use the Payload API to update a document
      await this.payload.update({
        collection: collectionName,
        id: documentId,
        data,
      })

      vscode.window.showInformationMessage(`Document ${documentId} updated successfully`)
    } catch (error) {
      vscode.window.showErrorMessage(`Error updating document: ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }

  /**
   * Close the connection
   */
  async disconnect(): Promise<void> {
    // Clean up resources if needed
    this.connected = false
    this.payload = null
  }
}
