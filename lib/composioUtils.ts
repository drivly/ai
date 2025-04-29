/**
 * Utilities for handling Composio integration actions
 */

/**
 * Converts a Composio action name from SCREAMING_SNAKE_CASE to dot notation
 * Example: "GITHUB_CREATE_ISSUE" => "github.createIssue"
 *
 * @param composioName - The Composio action name in SCREAMING_SNAKE_CASE
 * @returns The converted action name in dot notation format
 */
export function convertActionName(composioName: string): string {
  const parts = composioName.split('_')

  const integrationName = parts[0].toLowerCase()
  const actionNameParts = parts.slice(1)

  const actionName = actionNameParts
    .map((part, index) => {
      return index === 0 ? part.toLowerCase() : part.charAt(0) + part.slice(1).toLowerCase()
    })
    .join('')

  return `${integrationName}.${actionName}`
}

/**
 * Handle multi-word integration names (e.g., GOOGLE_SHEETS_UPDATE_CELL)
 * This function attempts to identify integration names with multiple parts
 *
 * @param composioName - The Composio action name in SCREAMING_SNAKE_CASE
 * @returns The converted action name in dot notation format
 */
export function convertActionNameWithMultiWordIntegrations(composioName: string): string {
  const multiWordIntegrations: Record<string, number> = {
    GOOGLE_SHEETS: 2,
    GOOGLE_DRIVE: 2,
    MICROSOFT_TEAMS: 2,
    MICROSOFT_OUTLOOK: 2,
  }

  const parts = composioName.split('_')

  for (const [prefix, wordCount] of Object.entries(multiWordIntegrations)) {
    if (composioName.startsWith(prefix)) {
      const integrationParts = parts.slice(0, wordCount)
      const integrationName = integrationParts
        .map((part, index) => {
          return index === 0 ? part.toLowerCase() : part.charAt(0) + part.slice(1).toLowerCase()
        })
        .join('')

      const actionParts = parts.slice(wordCount)
      const actionName = actionParts
        .map((part, index) => {
          return index === 0 ? part.toLowerCase() : part.charAt(0) + part.slice(1).toLowerCase()
        })
        .join('')

      return `${integrationName}.${actionName}`
    }
  }

  return convertActionName(composioName)
}
