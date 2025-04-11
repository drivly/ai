/**
 * Convert a title to a URL slug by replacing spaces with hyphens
 * and removing special characters
 */
export function titleToSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

/**
 * Convert a URL slug back to a title by replacing hyphens with spaces
 * and properly capitalizing words
 */
export function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
