/**
 * Convert a title to a URL slug by replacing spaces with underscores
 * and removing special characters
 */
export function titleToSlug(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w_-]/g, '');
}

/**
 * Convert a URL slug back to a title by replacing underscores with spaces
 */
export function slugToTitle(slug: string): string {
  return slug.replace(/_/g, ' ');
}
