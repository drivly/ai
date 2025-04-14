/**
 * Modifies a MongoDB connection string to use a different database name
 * @param baseUri The original database connection string
 * @param projectId The project ID to use as the database name
 * @returns Modified connection string with the project ID as the database name
 */
export function modifyDatabaseUri(baseUri: string, projectId: string): string {
  if (!baseUri) {
    throw new Error('Base database URI is required');
  }
  
  if (!projectId) {
    throw new Error('Project ID is required');
  }
  
  try {
    
    const hasDbName = baseUri.includes('/');
    
    if (!hasDbName) {
      return `${baseUri}/${projectId}`;
    }
    
    const lastSlashIndex = baseUri.lastIndexOf('/');
    const uriWithoutDb = baseUri.substring(0, lastSlashIndex + 1);
    
    const dbPart = baseUri.substring(lastSlashIndex + 1);
    const queryParamsIndex = dbPart.indexOf('?');
    
    if (queryParamsIndex >= 0) {
      const queryParams = dbPart.substring(queryParamsIndex);
      return `${uriWithoutDb}${projectId}${queryParams}`;
    }
    
    return `${uriWithoutDb}${projectId}`;
  } catch (error) {
    console.error('Error modifying database URI:', error);
    throw new Error('Failed to modify database connection string');
  }
}
