/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes The file size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  // Don't go beyond available units
  const unit = units[Math.min(i, units.length - 1)]

  // For B and KB, don't show decimal places
  if (i === 0 || i === 1) {
    return `${Math.round(bytes / Math.pow(1024, i))} ${unit}`
  }

  // For MB and higher, show one decimal place
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${unit}`
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length of text
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Formats a date in a human-readable way
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isYesterday) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
