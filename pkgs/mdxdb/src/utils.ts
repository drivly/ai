import { MDXDocument } from './types.js'

/**
 * Generates an ID for a document
 * @param data Document data
 * @returns Generated ID
 */
export function generateId(data: any): string {
  const timestamp = Date.now()

  let slug = ''
  if (data.title) {
    slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single one
  }

  return slug ? `${timestamp}-${slug}` : `${timestamp}`
}

/**
 * Filters documents based on query criteria
 * @param documents Documents to filter
 * @param where Filter criteria
 * @returns Filtered documents
 */
export function filterDocuments<T>(documents: MDXDocument<T>[], where?: Record<string, any>): MDXDocument<T>[] {
  if (!where) {
    return documents
  }

  return documents.filter((doc) => {
    for (const [key, value] of Object.entries(where)) {
      if (key === '$or' && Array.isArray(value)) {
        const orMatch = value.some((condition) => {
          return filterDocuments([doc], condition).length > 0
        })

        if (!orMatch) {
          return false
        }

        continue
      }

      if (key === '$and' && Array.isArray(value)) {
        const andMatch = value.every((condition) => {
          return filterDocuments([doc], condition).length > 0
        })

        if (!andMatch) {
          return false
        }

        continue
      }

      const parts = key.split('.')
      let docValue: any = { ...doc.data, id: doc.id, content: doc.content }

      for (const part of parts) {
        if (docValue === undefined || docValue === null) {
          return false
        }

        docValue = docValue[part]
      }

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        for (const [op, opValue] of Object.entries(value)) {
          const typedOpValue: any = opValue
          switch (op) {
            case 'eq':
              if (docValue !== typedOpValue) return false
              break
            case 'ne':
              if (docValue === typedOpValue) return false
              break
            case 'gt':
              if (docValue <= typedOpValue) return false
              break
            case 'gte':
              if (docValue < typedOpValue) return false
              break
            case 'lt':
              if (docValue >= typedOpValue) return false
              break
            case 'lte':
              if (docValue > typedOpValue) return false
              break
            case 'in':
              if (!Array.isArray(typedOpValue) || !typedOpValue.includes(docValue)) return false
              break
            case 'nin':
              if (!Array.isArray(typedOpValue) || typedOpValue.includes(docValue)) return false
              break
            case 'contains':
              if (Array.isArray(docValue)) {
                if (!docValue.includes(typedOpValue)) return false
              } else if (typeof docValue === 'string') {
                if (!docValue.includes(String(typedOpValue))) return false
              } else {
                return false
              }
              break
            default:
              return false
          }
        }
      } else {
        if (docValue !== value) {
          return false
        }
      }
    }

    return true
  })
}

/**
 * Sorts documents based on sort criteria
 * @param documents Documents to sort
 * @param sort Sort criteria
 * @returns Sorted documents
 */
export function sortDocuments<T>(documents: MDXDocument<T>[], sort?: string | string[]): MDXDocument<T>[] {
  if (!sort) {
    return documents
  }

  const sortArray = Array.isArray(sort) ? sort : [sort]

  const sortedDocs = [...documents]

  return sortedDocs.sort((a, b) => {
    for (const sortItem of sortArray) {
      const [field, direction] = sortItem.split(':')
      const isDesc = direction === 'desc'

      if (field === 'relevance') {
        const aRelevance = (a as any).relevance || 0
        const bRelevance = (b as any).relevance || 0

        if (aRelevance !== bRelevance) {
          return isDesc ? bRelevance - aRelevance : aRelevance - bRelevance
        }

        continue
      }

      const parts = field.split('.')

      let aValue: any = { ...a.data, id: a.id, content: a.content }
      let bValue: any = { ...b.data, id: b.id, content: b.content }

      for (const part of parts) {
        aValue = aValue?.[part]
        bValue = bValue?.[part]
      }

      if (aValue === undefined && bValue === undefined) {
        continue
      }

      if (aValue === undefined) {
        return isDesc ? 1 : -1
      }

      if (bValue === undefined) {
        return isDesc ? -1 : 1
      }

      if (aValue < bValue) {
        return isDesc ? 1 : -1
      }

      if (aValue > bValue) {
        return isDesc ? -1 : 1
      }
    }

    return 0
  })
}

/**
 * Paginates documents
 * @param documents Documents to paginate
 * @param limit Number of documents per page
 * @param page Page number
 * @returns Paginated documents
 */
export function paginateDocuments<T>(
  documents: MDXDocument<T>[],
  limit = 10,
  page = 1,
): {
  paginatedDocs: MDXDocument<T>[]
  totalDocs: number
  totalPages: number
} {
  const totalDocs = documents.length
  const totalPages = Math.ceil(totalDocs / limit)

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedDocs = documents.slice(startIndex, endIndex)

  return {
    paginatedDocs,
    totalDocs,
    totalPages,
  }
}

/**
 * Searches documents for a query string
 * @param documents Documents to search
 * @param query Search query
 * @returns Documents with relevance scores
 */
export function searchDocuments<T>(documents: MDXDocument<T>[], query: string): MDXDocument<T>[] {
  if (!query) {
    return documents
  }

  const normalizedQuery = query.toLowerCase()

  return documents
    .map((doc) => {
      let relevance = 0

      if (doc.content.toLowerCase().includes(normalizedQuery)) {
        relevance += 1
      }

      for (const [key, value] of Object.entries(doc.data)) {
        if (typeof value === 'string' && value.toLowerCase().includes(normalizedQuery)) {
          if (key === 'title') {
            relevance += 3
          } else {
            relevance += 2
          }
        }
      }

      return {
        ...doc,
        relevance,
      }
    })
    .filter((doc) => doc.relevance > 0) // Only include documents with matches
    .sort((a, b) => b.relevance - a.relevance) // Sort by relevance
}
