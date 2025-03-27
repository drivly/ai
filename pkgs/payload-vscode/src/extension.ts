import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import * as yaml from 'yaml'
import { PayloadClient } from './client'

// Extension activation context
let extensionContext: vscode.ExtensionContext
let payloadClient: PayloadClient

/**
 * Activate the extension
 */
export function activate(context: vscode.ExtensionContext) {
  extensionContext = context
  payloadClient = new PayloadClient()

  // Register the tree data provider
  const payloadProvider = new PayloadCollectionsProvider()
  vscode.window.registerTreeDataProvider('payloadCollections', payloadProvider)

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('payload-vscode.refreshCollections', () => {
      payloadProvider.refresh()
    }),

    vscode.commands.registerCommand('payload-vscode.viewDocument', async (item: DocumentItem) => {
      if (item) {
        await openDocumentInEditor(item)
      }
    }),

    vscode.commands.registerCommand('payload-vscode.searchCollection', async (item: CollectionItem) => {
      if (item) {
        const searchTerm = await vscode.window.showInputBox({
          prompt: `Search in ${item.label}`,
          placeHolder: 'Enter search term',
        })

        if (searchTerm) {
          try {
            const documents = await payloadClient.searchDocuments(item.collectionName, searchTerm)
            item.children = documents.map((doc) => new DocumentItem(doc.name || doc.id || 'Unknown', doc.id, item.collectionName, doc))
            payloadProvider.refresh()
          } catch (error) {
            vscode.window.showErrorMessage(`Error searching: ${error instanceof Error ? error.message : String(error)}`)
          }
        }
      }
    }),
  )
}

/**
 * Deactivate the extension
 */
export function deactivate() {
  // Clean up resources
  if (payloadClient) {
    payloadClient.disconnect().catch((err) => {
      console.error('Error disconnecting from Payload:', err)
    })
  }
}

/**
 * Tree item representing a Payload collection
 */
class CollectionItem extends vscode.TreeItem {
  children: DocumentItem[] = []

  constructor(
    public readonly label: string,
    public readonly collectionName: string,
  ) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed)
    this.contextValue = 'collection'
    this.tooltip = `Collection: ${label}`
    this.iconPath = new vscode.ThemeIcon('database')
  }
}

/**
 * Tree item representing a document in a collection
 */
class DocumentItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly id: string,
    public readonly collectionName: string,
    public readonly document: any,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None)
    this.contextValue = 'document'
    this.tooltip = `Document ID: ${id}`
    this.iconPath = new vscode.ThemeIcon('file-text')
    this.command = {
      command: 'payload-vscode.viewDocument',
      title: 'View Document',
      arguments: [this],
    }
  }
}

/**
 * Tree data provider for Payload collections
 */
class PayloadCollectionsProvider implements vscode.TreeDataProvider<CollectionItem | DocumentItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<CollectionItem | DocumentItem | undefined> = new vscode.EventEmitter<CollectionItem | DocumentItem | undefined>()
  readonly onDidChangeTreeData: vscode.Event<CollectionItem | DocumentItem | undefined> = this._onDidChangeTreeData.event

  private collections: CollectionItem[] = []

  constructor() {
    this.loadCollections()
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined)
  }

  getTreeItem(element: CollectionItem | DocumentItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: CollectionItem | DocumentItem): Thenable<(CollectionItem | DocumentItem)[]> {
    if (!element) {
      return Promise.resolve(this.collections)
    }

    if (element instanceof CollectionItem) {
      // Lazy load the documents when a collection is expanded
      return this.getDocumentsForCollection(element)
    }

    return Promise.resolve([])
  }

  async getDocumentsForCollection(collection: CollectionItem): Promise<DocumentItem[]> {
    try {
      if (collection.children.length === 0) {
        const documents = await payloadClient.getDocuments(collection.collectionName)
        collection.children = documents.map((doc) => new DocumentItem(doc.name || doc.id || 'Unknown', doc.id, collection.collectionName, doc))
      }
      return collection.children
    } catch (error) {
      vscode.window.showErrorMessage(`Error loading documents: ${error instanceof Error ? error.message : String(error)}`)
      return []
    }
  }

  async loadCollections() {
    try {
      // Get all collection names from the Payload API
      const collections = await payloadClient.getCollections()

      this.collections = collections.map((collection) => new CollectionItem(collection, collection))

      this.refresh()
    } catch (error) {
      vscode.window.showErrorMessage(`Error loading collections: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

/**
 * Open a document in the editor using YAML format
 */
async function openDocumentInEditor(item: DocumentItem): Promise<void> {
  try {
    // Convert the document to YAML
    const yamlContent = yaml.stringify(item.document, {
      indent: 2,
      lineWidth: -1, // Don't limit line width
    })

    // Create a temp file with .yaml extension
    const tempDir = path.join(extensionContext.storageUri.fsPath, 'temp')
    fs.mkdirSync(tempDir, { recursive: true })
    const tempFile = path.join(tempDir, `${item.collectionName}-${item.id}.yaml`)

    // Write content to the file
    fs.writeFileSync(tempFile, yamlContent)

    // Open the file in the editor
    const document = await vscode.workspace.openTextDocument(tempFile)
    await vscode.window.showTextDocument(document)

    // Set up file system watcher to detect changes
    const watcher = vscode.workspace.createFileSystemWatcher(tempFile)

    // Handle file save
    watcher.onDidChange(async (uri) => {
      try {
        // Read the updated YAML content
        const updatedContent = fs.readFileSync(uri.fsPath, 'utf8')

        // Parse YAML back to object
        const updatedDoc = yaml.parse(updatedContent)

        // Save back to the Payload CMS
        await payloadClient.updateDocument(item.collectionName, item.id, updatedDoc)

        vscode.window.showInformationMessage(`Document ${item.id} updated successfully`)
      } catch (error) {
        vscode.window.showErrorMessage(`Error updating document: ${error instanceof Error ? error.message : String(error)}`)
      }
    })

    // Dispose the watcher when the document is closed
    vscode.workspace.onDidCloseTextDocument((doc) => {
      if (doc.uri.fsPath === tempFile) {
        watcher.dispose()
      }
    })
  } catch (error) {
    vscode.window.showErrorMessage(`Error opening document: ${error instanceof Error ? error.message : String(error)}`)
  }
}
