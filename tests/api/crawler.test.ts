import { describe, it, expect, beforeAll } from 'vitest';
import { crawlApi } from '../utils/apiCrawler';

const API_URL = process.env.API_URL || 'http://localhost:3000';

describe('API Link Validation', () => {
  if (process.env.CI && !process.env.API_URL) {
    it.skip('Skipping API crawler tests in CI without API_URL', () => {
      console.log('Set API_URL to run these tests in CI');
    });
    return;
  }

  it('should validate all links in the API', async () => {
    const results = await crawlApi({
      baseUrl: API_URL,
      maxDepth: 3, // Limit depth to prevent too much crawling
      excludePaths: ['/admin'], // Exclude admin paths that require authentication
      excludeParams: ['next', 'prev'], // Exclude pagination to prevent loops
      timeout: 5000, // 5 second timeout per request
    });

    const invalidResults = results.filter(result => !result.isValid);

    console.log(`Crawled ${results.length} API endpoints`);
    
    if (invalidResults.length > 0) {
      console.error('Invalid API links found:');
      invalidResults.forEach(result => {
        console.error(`- ${result.url} (Status: ${result.status}, Error: ${result.error || 'None'})`);
      });
    }

    expect(invalidResults).toEqual([]);
  });

  it('should validate specific critical paths', async () => {
    const criticalPaths = [
      `${API_URL}/functions`,
      `${API_URL}/workflows`,
      `${API_URL}/agents`,
      `${API_URL}/models`,
    ];

    for (const path of criticalPaths) {
      const results = await crawlApi({
        baseUrl: path,
        maxDepth: 2,
        excludeParams: ['next', 'prev'],
      });

      const invalidResults = results.filter(result => !result.isValid);
      
      expect(invalidResults).toEqual([]);
    }
  });
});
