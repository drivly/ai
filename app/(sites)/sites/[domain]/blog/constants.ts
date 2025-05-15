export const BLOG_CATEGORIES = ['Workflows', 'Functions', 'Agents', 'Services', 'Business', 'Data', 'Experiments', 'Integrations'] as const
export type BlogCategory = (typeof BLOG_CATEGORIES)[number]
