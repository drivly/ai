/**
 * Modifies a MongoDB connection string to use a different database name
 * @param baseUri The original database connection string
 * @param projectId The project ID to use as the database name
 * @returns Modified connection string with the project ID as the database name
 */
export function modifyDatabaseUri(baseUri: string, projectId: string): string {
  if (!baseUri) {
    throw new Error('Base database URI is required')
  }

  if (!projectId) {
    throw new Error('Project ID is required')
  }

  try {
    if (typeof baseUri !== 'string') {
      throw new Error('Base database URI must be a string')
    }

    if (baseUri.startsWith('mongodb://') || baseUri.startsWith('mongodb+srv://')) {
      const queryParamIndex = baseUri.indexOf('?')
      const effectiveUri = queryParamIndex >= 0 ? baseUri.substring(0, queryParamIndex) : baseUri

      const slashCount = (effectiveUri.match(/\//g) || []).length

      if (slashCount < 3) {
        const separator = baseUri.endsWith('/') ? '' : '/'
        const queryPart = queryParamIndex >= 0 ? baseUri.substring(queryParamIndex) : ''
        return `${effectiveUri}${separator}${projectId}${queryPart}`
      } else {
        const lastSlashIndex = effectiveUri.lastIndexOf('/')
        const uriWithoutDb = effectiveUri.substring(0, lastSlashIndex + 1)
        const queryPart = queryParamIndex >= 0 ? baseUri.substring(queryParamIndex) : ''
        return `${uriWithoutDb}${projectId}${queryPart}`
      }
    }

    const separator = baseUri.endsWith('/') ? '' : '/'
    return `${baseUri}${separator}${projectId}`
  } catch (error) {
    console.error('Error modifying database URI:', error)
    throw new Error('Failed to modify database connection string')
  }
}
