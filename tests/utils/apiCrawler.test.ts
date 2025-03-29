import { describe, it, expect, vi, beforeEach } from 'vitest';
import { crawlApi } from './apiCrawler';

global.fetch = vi.fn() as unknown as typeof fetch;

describe('API Crawler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should crawl a simple API with valid links', async () => {
    const mockBaseResponse = {
      json: vi.fn().mockResolvedValue({
        api: {
          name: 'test-api',
          home: 'http://example.com',
          docs: 'http://example.com/docs',
        },
        links: {
          self: 'http://example.com',
          endpoint1: 'http://example.com/endpoint1',
        },
      }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
      status: 200,
      ok: true,
    };

    const mockEndpoint1Response = {
      json: vi.fn().mockResolvedValue({
        data: 'test data',
        links: {
          self: 'http://example.com/endpoint1',
          back: 'http://example.com',
        },
      }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
      status: 200,
      ok: true,
    };

    (global.fetch as any).mockImplementation((url: string) => {
      if (url === 'http://example.com') {
        return Promise.resolve(mockBaseResponse);
      } else if (url === 'http://example.com/endpoint1') {
        return Promise.resolve(mockEndpoint1Response);
      } else if (url === 'http://example.com/docs') {
        return Promise.resolve({
          ...mockBaseResponse,
          json: vi.fn().mockResolvedValue({ title: 'API Docs' }),
        });
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const results = await crawlApi({
      baseUrl: 'http://example.com',
      maxDepth: 3,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every(result => result.isValid)).toBe(true);
    
    const visitedUrls = results.map(r => r.url);
    expect(visitedUrls).toContain('http://example.com');
    expect(visitedUrls).toContain('http://example.com/endpoint1');
    expect(visitedUrls).toContain('http://example.com/docs');
    
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should handle invalid links', async () => {
    const mockResponse = {
      json: vi.fn().mockResolvedValue({
        api: {
          name: 'test-api',
          home: 'http://example.com',
        },
        links: {
          self: 'http://example.com',
          broken: 'http://example.com/broken',
        },
      }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
      status: 200,
      ok: true,
    };

    const mockBrokenResponse = {
      headers: new Headers({
        'content-type': 'application/json',
      }),
      status: 404,
      ok: false,
      json: vi.fn().mockRejectedValue(new Error('Not found')),
    };

    (global.fetch as any).mockImplementation((url: string) => {
      if (url === 'http://example.com') {
        return Promise.resolve(mockResponse);
      } else if (url === 'http://example.com/broken') {
        return Promise.resolve(mockBrokenResponse);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const results = await crawlApi({
      baseUrl: 'http://example.com',
    });

    const brokenResult = results.find(r => r.url === 'http://example.com/broken');
    
    expect(brokenResult).toBeDefined();
    expect(brokenResult?.isValid).toBe(false);
    expect(brokenResult?.status).toBe(0);
  });

  it('should prevent infinite loops', async () => {
    const mockResponse = {
      json: vi.fn().mockResolvedValue({
        api: {
          name: 'test-api',
        },
        links: {
          self: 'http://example.com',
          circular: 'http://example.com/circular',
        },
      }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
      status: 200,
      ok: true,
    };

    const mockCircularResponse = {
      json: vi.fn().mockResolvedValue({
        data: 'circular data',
        links: {
          back: 'http://example.com', // Goes back to the first URL
        },
      }),
      headers: new Headers({
        'content-type': 'application/json',
      }),
      status: 200,
      ok: true,
    };

    (global.fetch as any).mockImplementation((url: string) => {
      if (url === 'http://example.com') {
        return Promise.resolve(mockResponse);
      } else if (url === 'http://example.com/circular') {
        return Promise.resolve(mockCircularResponse);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const results = await crawlApi({
      baseUrl: 'http://example.com',
    });

    const urlCounts = results.reduce((counts, result) => {
      counts[result.url] = (counts[result.url] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    Object.values(urlCounts).forEach(count => {
      expect(count).toBe(1);
    });

    expect(results.length).toBe(2);
  });
});
