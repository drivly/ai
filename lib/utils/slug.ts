/**
 * Convert a title to a URL slug by replacing spaces with underscores
 */
export function titleToSlug(title: string): string {
  return title.replace(/\s+/g, '_');
}

/**
 * Convert a URL slug back to a title by replacing underscores with spaces
 */
export function slugToTitle(slug: string): string {
  return slug.replace(/_/g, ' ');
}
