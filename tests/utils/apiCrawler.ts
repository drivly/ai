import { describe, it, expect } from 'vitest'

interface ApiCrawlerOptions {
  baseUrl: string;
  maxDepth?: number;
  excludePaths?: string[];
  excludeParams?: string[];
  headers?: Record<string, string>;
  timeout?: number;
}

interface CrawlResult {
  url: string;
  status: number;
  isValid: boolean;
  contentType?: string;
  links: string[];
  error?: string;
}

/**
 * Crawls API endpoints to verify that all links are valid
 * @param options Configuration options for the crawler
 * @returns Promise that resolves to an array of crawl results
 */
export async function crawlApi(options: ApiCrawlerOptions): Promise<CrawlResult[]> {
  const {
    baseUrl,
    maxDepth = 5,
    excludePaths = [],
    excludeParams = ['next', 'prev'], // By default, exclude next/prev to prevent pagination loops
    headers = {},
    timeout = 10000,
  } = options;

  const visitedUrls = new Set<string>();
  const results: CrawlResult[] = [];
  const queue: { url: string; depth: number }[] = [{ url: baseUrl, depth: 0 }];

  while (queue.length > 0) {
    const { url, depth } = queue.shift()!;
    
    if (visitedUrls.has(url) || depth > maxDepth) {
      continue;
    }
    
    if (excludePaths.some(path => url.includes(path))) {
      continue;
    }
    
    visitedUrls.add(url);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, { 
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const contentType = response.headers.get('content-type') || undefined;
      let links: string[] = [];
      
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        links = extractLinks(data, excludeParams);
      }
      
      results.push({
        url,
        status: response.status,
        isValid: response.ok,
        contentType,
        links,
      });
      
      links.forEach(link => {
        if (!visitedUrls.has(link)) {
          queue.push({ url: link, depth: depth + 1 });
        }
      });
    } catch (error) {
      results.push({
        url,
        status: 0,
        isValid: false,
        links: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  return results;
}

/**
 * Recursively extracts links from an API response
 * @param data The API response data
 * @param excludeParams Parameters to exclude from link extraction
 * @returns Array of extracted links
 */
function extractLinks(data: any, excludeParams: string[] = []): string[] {
  const links: string[] = [];
  
  if (data == null) {
    return links;
  }
  
  if (Array.isArray(data)) {
    data.forEach(item => {
      links.push(...extractLinks(item, excludeParams));
    });
    return links;
  }
  
  if (typeof data === 'object') {
    if (data.links && typeof data.links === 'object') {
      Object.entries(data.links).forEach(([key, value]) => {
        if (excludeParams.includes(key)) {
          return;
        }
        
        if (typeof value === 'string' && isValidUrl(value)) {
          links.push(value);
        } else if (typeof value === 'object') {
          links.push(...extractLinks(value, excludeParams));
        }
      });
    }
    
    if (data.api && typeof data.api === 'object') {
      Object.entries(data.api).forEach(([key, value]) => {
        if (typeof value === 'string' && isValidUrl(value)) {
          links.push(value);
        }
      });
    }
    
    Object.values(data).forEach(value => {
      if (typeof value === 'object' && value !== null) {
        links.push(...extractLinks(value, excludeParams));
      }
    });
  }
  
  return links;
}

/**
 * Checks if a string is a valid URL
 * @param url The string to check
 * @returns Whether the string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
