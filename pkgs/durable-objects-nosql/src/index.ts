import {
  Collection,
  Cursor,
  DurableObjectStorage,
  DurableObjectTransaction,
  FindOptions,
  InsertManyResult,
  InsertOneResult,
  Query,
  Update,
  UpdateResult,
  DeleteResult,
  StoredDocument,
} from './types'

/**
 * Implementation of a MongoDB-style cursor for query results
 */
class CursorImpl<T = any> implements Cursor<T> {
  private documents: T[] = []
  private _limit?: number
  private _skip?: number
  private _sort?: { [key: string]: 1 | -1 }

  constructor(documents: T[]) {
    this.documents = documents
  }

  async toArray(): Promise<T[]> {
    let result = [...this.documents]

    if (this._sort) {
      result.sort((a, b) => {
        for (const [key, direction] of Object.entries(this._sort!)) {
          const valueA = getNestedProperty(a, key)
          const valueB = getNestedProperty(b, key)

          if (valueA < valueB) return -1 * direction
          if (valueA > valueB) return 1 * direction
        }
        return 0
      })
    }

    if (this._skip) {
      result = result.slice(this._skip)
    }

    if (this._limit) {
      result = result.slice(0, this._limit)
    }

    return result
  }

  async first(): Promise<T | null> {
    const results = await this.toArray()
    return results.length > 0 ? results[0] : null
  }

  async count(): Promise<number> {
    return this.documents.length
  }

  limit(n: number): Cursor<T> {
    this._limit = n
    return this
  }

  skip(n: number): Cursor<T> {
    this._skip = n
    return this
  }

  sort(sortSpec: { [key: string]: 1 | -1 }): Cursor<T> {
    this._sort = sortSpec
    return this
  }
}

/**
 * Implementation of a MongoDB-style collection
 */
class CollectionImpl<T = any> implements Collection<T> {
  private storage: DurableObjectStorage
  private collectionName: string

  constructor(storage: DurableObjectStorage, collectionName: string) {
    this.storage = storage
    this.collectionName = collectionName
  }

  /**
   * Find documents matching a query
   */
  find(query: Query = {}, options: FindOptions = {}): Cursor<T> {
    const cursor = new CursorImpl<T>([])

    ;(cursor as any)._execute = async () => {
      const documents = await this.getAllDocuments()
      return documents.filter((doc) => this.matchesQuery(doc, query))
    }

    const originalToArray = cursor.toArray
    cursor.toArray = async () => {
      if (!(cursor as any)._documents || (cursor as any)._documents.length === 0) {
        ;(cursor as any).documents = await (cursor as any)._execute()
      }
      return originalToArray.call(cursor)
    }

    return cursor
  }

  /**
   * Find a single document matching a query
   */
  async findOne(query: Query = {}): Promise<T | null> {
    const cursor = await this.find(query)
    return cursor.first()
  }

  /**
   * Insert a single document
   */
  async insertOne(document: T): Promise<InsertOneResult> {
    const id = crypto.randomUUID()
    const docWithId = { ...document, _id: id }

    await this.storage.sql.exec(`INSERT INTO documents (id, collection, data) VALUES (?, ?, ?)`, id, this.collectionName, JSON.stringify(docWithId))

    return { id }
  }

  /**
   * Insert multiple documents
   */
  async insertMany(documents: T[]): Promise<InsertManyResult> {
    const ids: string[] = []

    await this.storage.transaction(async (txn) => {
      for (const document of documents) {
        const id = crypto.randomUUID()
        const docWithId = { ...document, _id: id }

        await this.storage.sql.exec(`INSERT INTO documents (id, collection, data) VALUES (?, ?, ?)`, id, this.collectionName, JSON.stringify(docWithId))
        ids.push(id)
      }
    })

    return { ids }
  }

  /**
   * Update a single document matching a query
   */
  async updateOne(query: Query, update: Update): Promise<UpdateResult> {
    const document = await this.findOne(query)

    if (!document) {
      return { matchedCount: 0, modifiedCount: 0 }
    }

    const id = (document as any)._id
    const updatedDocument = this.applyUpdate(document, update)

    await this.storage.sql.exec(`UPDATE documents SET data = ? WHERE id = ? AND collection = ?`, JSON.stringify(updatedDocument), id, this.collectionName)

    return { matchedCount: 1, modifiedCount: 1 }
  }

  /**
   * Update multiple documents matching a query
   */
  async updateMany(query: Query, update: Update): Promise<UpdateResult> {
    const cursor = this.find(query)
    const documents = await cursor.toArray()

    if (documents.length === 0) {
      return { matchedCount: 0, modifiedCount: 0 }
    }

    let modifiedCount = 0

    await this.storage.transaction(async (txn: DurableObjectTransaction) => {
      for (const document of documents) {
        const id = (document as any)._id
        const updatedDocument = this.applyUpdate(document, update)

        await this.storage.sql.exec(`UPDATE documents SET data = ? WHERE id = ? AND collection = ?`, JSON.stringify(updatedDocument), id, this.collectionName)
        modifiedCount++
      }
    })

    return { matchedCount: documents.length, modifiedCount }
  }

  /**
   * Delete a single document matching a query
   */
  async deleteOne(query: Query): Promise<DeleteResult> {
    const document = await this.findOne(query)

    if (!document) {
      return { deletedCount: 0 }
    }

    const id = (document as any)._id

    await this.storage.sql.exec(`DELETE FROM documents WHERE id = ? AND collection = ?`, id, this.collectionName)

    return { deletedCount: 1 }
  }

  /**
   * Delete multiple documents matching a query
   */
  async deleteMany(query: Query): Promise<DeleteResult> {
    const cursor = this.find(query)
    const documents = await cursor.toArray()

    if (documents.length === 0) {
      return { deletedCount: 0 }
    }

    let deletedCount = 0

    await this.storage.transaction(async (txn: DurableObjectTransaction) => {
      for (const document of documents) {
        const id = (document as any)._id
        await this.storage.sql.exec(`DELETE FROM documents WHERE id = ? AND collection = ?`, id, this.collectionName)
        deletedCount++
      }
    })

    return { deletedCount }
  }

  /**
   * Get all documents in the collection
   */
  private async getAllDocuments(): Promise<T[]> {
    const cursor = this.storage.sql.exec<StoredDocument>(`SELECT * FROM documents WHERE collection = ?`, this.collectionName)

    const documents: T[] = []
    let result = cursor.next()

    while (!result.done && result.value) {
      documents.push(JSON.parse(result.value.data) as T)
      result = cursor.next()
    }

    return documents
  }

  /**
   * Check if a document matches a query
   */
  private matchesQuery(document: any, query: Query): boolean {
    for (const [key, value] of Object.entries(query)) {
      if (key.startsWith('$')) {
        switch (key) {
          case '$and':
            if (!Array.isArray(value)) return false
            if (!value.every((subQuery) => this.matchesQuery(document, subQuery))) return false
            break
          case '$or':
            if (!Array.isArray(value)) return false
            if (!value.some((subQuery) => this.matchesQuery(document, subQuery))) return false
            break
          case '$nor':
            if (!Array.isArray(value)) return false
            if (value.some((subQuery) => this.matchesQuery(document, subQuery))) return false
            break
          default:
            return false
        }
      } else {
        const docValue = getNestedProperty(document, key)

        if (value !== null && typeof value === 'object') {
          for (const [op, opValue] of Object.entries(value)) {
            if (!this.matchesOperator(docValue, op as any, opValue)) return false
          }
        } else if (!this.matchesOperator(docValue, '$eq', value)) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Check if a value matches an operator condition
   */
  private matchesOperator(value: any, operator: string, operatorValue: any): boolean {
    switch (operator) {
      case '$eq':
        return value === operatorValue
      case '$gt':
        return value > operatorValue
      case '$gte':
        return value >= operatorValue
      case '$lt':
        return value < operatorValue
      case '$lte':
        return value <= operatorValue
      case '$ne':
        return value !== operatorValue
      case '$in':
        return Array.isArray(operatorValue) && operatorValue.includes(value)
      case '$nin':
        return Array.isArray(operatorValue) && !operatorValue.includes(value)
      case '$not':
        return !this.matchesQuery({ value }, { value: operatorValue })
      case '$exists':
        return operatorValue ? value !== undefined : value === undefined
      case '$type':
        return typeof value === operatorValue
      case '$regex':
        return new RegExp(operatorValue).test(value)
      default:
        return false
    }
  }

  /**
   * Apply an update to a document
   */
  private applyUpdate(document: T, update: Update): T {
    const result = { ...document }

    for (const [operator, fields] of Object.entries(update)) {
      switch (operator) {
        case '$set':
          for (const [field, value] of Object.entries(fields)) {
            setNestedProperty(result, field, value)
          }
          break
        case '$unset':
          for (const field of Object.keys(fields)) {
            deleteNestedProperty(result, field)
          }
          break
        case '$inc':
          for (const [field, value] of Object.entries(fields)) {
            const currentValue = getNestedProperty(result, field) || 0
            setNestedProperty(result, field, currentValue + value)
          }
          break
        case '$push':
          for (const [field, value] of Object.entries(fields)) {
            const currentValue = getNestedProperty(result, field) || []
            if (!Array.isArray(currentValue)) {
              throw new Error(`Cannot apply $push to non-array field: ${field}`)
            }
            setNestedProperty(result, field, [...currentValue, value])
          }
          break
        case '$pull':
          for (const [field, value] of Object.entries(fields)) {
            const currentValue = getNestedProperty(result, field)
            if (!Array.isArray(currentValue)) {
              throw new Error(`Cannot apply $pull to non-array field: ${field}`)
            }
            setNestedProperty(
              result,
              field,
              currentValue.filter((item) => !this.matchesQuery({ item }, { item: value })),
            )
          }
          break
        case '$addToSet':
          for (const [field, value] of Object.entries(fields)) {
            const currentValue = getNestedProperty(result, field) || []
            if (!Array.isArray(currentValue)) {
              throw new Error(`Cannot apply $addToSet to non-array field: ${field}`)
            }
            if (!currentValue.includes(value)) {
              setNestedProperty(result, field, [...currentValue, value])
            }
          }
          break
        case '$pop':
          for (const [field, value] of Object.entries(fields)) {
            const currentValue = getNestedProperty(result, field)
            if (!Array.isArray(currentValue)) {
              throw new Error(`Cannot apply $pop to non-array field: ${field}`)
            }
            if (value === 1) {
              setNestedProperty(result, field, currentValue.slice(0, -1))
            } else if (value === -1) {
              setNestedProperty(result, field, currentValue.slice(1))
            }
          }
          break
      }
    }

    return result
  }
}

/**
 * Main class for MongoDB-style NoSQL interface for Durable Objects
 */
export class DurableObjectsNoSQL {
  private storage: DurableObjectStorage
  private collections: Map<string, Collection<any>> = new Map()

  constructor(storage: DurableObjectStorage) {
    this.storage = storage

    this.initializeDatabase()
  }

  /**
   * Get a collection by name
   */
  collection<T = any>(name: string): Collection<T> {
    if (!this.collections.has(name)) {
      this.collections.set(name, new CollectionImpl<T>(this.storage, name))
    }

    return this.collections.get(name) as Collection<T>
  }

  /**
   * Initialize the database schema
   */
  private async initializeDatabase() {
    this.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        collection TEXT NOT NULL,
        data TEXT NOT NULL
      )
    `)

    this.storage.sql.exec(`
      CREATE INDEX IF NOT EXISTS idx_collection ON documents (collection)
    `)
  }
}

/**
 * Proxy handler for collection access
 */
export const handler = {
  get(target: DurableObjectsNoSQL, prop: string) {
    if (prop in target) {
      return (target as any)[prop]
    }

    return target.collection(prop)
  },
}

/**
 * Create a new DurableObjectsNoSQL instance with collection proxy
 */
export function createNoSQLClient(storage: DurableObjectStorage): DurableObjectsNoSQL {
  const client = new DurableObjectsNoSQL(storage)
  return new Proxy(client, handler)
}

/**
 * Helper function to get a nested property from an object
 */
function getNestedProperty(obj: any, path: string): any {
  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined
    }
    current = current[part]
  }

  return current
}

/**
 * Helper function to set a nested property in an object
 */
function setNestedProperty(obj: any, path: string, value: any): void {
  const parts = path.split('.')
  let current = obj

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!(part in current)) {
      current[part] = {}
    }
    current = current[part]
  }

  current[parts[parts.length - 1]] = value
}

/**
 * Helper function to delete a nested property from an object
 */
function deleteNestedProperty(obj: any, path: string): void {
  const parts = path.split('.')
  let current = obj

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!(part in current)) {
      return
    }
    current = current[part]
  }

  delete current[parts[parts.length - 1]]
}

export default createNoSQLClient
