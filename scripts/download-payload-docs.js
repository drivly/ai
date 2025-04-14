#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'docs', 'Payload firecrawl llms.txt');

const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1';
const PAYLOAD_DOCS_URL = 'https://payloadcms.com/docs';
const MAX_POLLING_TIME = 15 * 60 * 1000; // 15 minutes
const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 3;

async function downloadPayloadDocs() {
  try {
    if (!process.env.FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY environment variable is required');
    }
    
    console.log('Crawling PayloadCMS documentation...');
    
    const crawlJob = await startCrawlJob(process.env.FIRECRAWL_API_KEY);
    console.log(`Crawl job started with ID: ${crawlJob.id}`);
    
    const crawlResults = await pollCrawlJob(process.env.FIRECRAWL_API_KEY, crawlJob.id);
    
    await processAndSaveResults(crawlResults);
    
    console.log('PayloadCMS documentation crawl completed successfully');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function startCrawlJob(apiKey) {
  try {
    const scrapeResponse = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: PAYLOAD_DOCS_URL,
        formats: ["markdown", "html"],
        onlyMainContent: true
      })
    });
    
    if (!scrapeResponse.ok) {
      throw new Error(`Failed to scrape main docs page: ${scrapeResponse.status} ${scrapeResponse.statusText}`);
    }
    
    const scrapeData = await scrapeResponse.json();
    console.log(`Initial scrape completed, found content at: ${scrapeData.url}`);
    
    const response = await fetch(`${FIRECRAWL_API_URL}/crawl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: scrapeData.url || PAYLOAD_DOCS_URL,
        includePaths: ['/docs/*'],
        excludePaths: ['/docs/search*'],
        allowBackwardLinks: true,
        maxDepth: 5,
        limit: 1000,
        scrapeOptions: {
          formats: ["markdown", "html"],
          onlyMainContent: true,
          waitForSelector: '.docs-content'
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to start crawl job: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Error starting crawl job: ${error.message}`);
  }
}

async function pollCrawlJob(apiKey, jobId, retryCount = 0) {
  const startTime = Date.now();
  let allResults = [];
  
  while (Date.now() - startTime < MAX_POLLING_TIME) {
    try {
      const response = await fetch(`${FIRECRAWL_API_URL}/crawl/${jobId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to check crawl job status: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'completed' || data.status === 'succeeded') {
        allResults = await getAllResults(apiKey, jobId, data);
        return allResults;
      } else if (data.status === 'failed') {
        throw new Error(`Crawl job failed: ${data.error || 'Unknown error'}`);
      }
      
      console.log(`Crawl job in progress... (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`);
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Error checking crawl job status, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
        return pollCrawlJob(apiKey, jobId, retryCount + 1);
      }
      throw new Error(`Error checking crawl job status: ${error.message}`);
    }
  }
  
  throw new Error(`Crawl job timed out after ${MAX_POLLING_TIME / 1000} seconds`);
}

async function getAllResults(apiKey, jobId, initialData) {
  let results = initialData.pages || [];
  let nextUrl = initialData.next;
  
  while (nextUrl) {
    try {
      const response = await fetch(nextUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get next page: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.pages && Array.isArray(data.pages)) {
        results = results.concat(data.pages);
      }
      
      nextUrl = data.next;
    } catch (error) {
      throw new Error(`Error fetching paginated results: ${error.message}`);
    }
  }
  
  return results;
}

async function processAndSaveResults(results) {
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }
  
  console.log(`Processing ${results.length} pages of documentation...`);
  
  let combinedContent = `# PayloadCMS Documentation\n\nSource: ${PAYLOAD_DOCS_URL}\n\n`;
  
  if (results.length === 0) {
    console.log('No results from crawl, attempting to scrape individual pages directly...');
    
    const pagesToScrape = [
      'https://payloadcms.com/docs/getting-started/what-is-payload',
      'https://payloadcms.com/docs/getting-started/installation',
      'https://payloadcms.com/docs/getting-started/quick-start',
      'https://payloadcms.com/docs/configuration/overview',
      'https://payloadcms.com/docs/fields/overview',
      'https://payloadcms.com/docs/admin/overview',
      'https://payloadcms.com/docs/rest-api/overview',
      'https://payloadcms.com/docs/graphql/overview',
      'https://payloadcms.com/docs/local-api/overview',
      'https://payloadcms.com/docs/authentication/overview',
      'https://payloadcms.com/docs/access-control/overview',
      'https://payloadcms.com/docs/hooks/overview',
      'https://payloadcms.com/docs/plugins/overview'
    ];
    
    for (const pageUrl of pagesToScrape) {
      try {
        console.log(`Scraping ${pageUrl}...`);
        const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
          },
          body: JSON.stringify({
            url: pageUrl,
            formats: ["markdown", "html"],
            onlyMainContent: true,
            waitForSelector: '.docs-content'
          })
        });
        
        if (!response.ok) {
          console.error(`Failed to scrape ${pageUrl}: ${response.status} ${response.statusText}`);
          continue;
        }
        
        const data = await response.json();
        
        if (data.markdown) {
          combinedContent += `\n## ${pageUrl}\n\n${data.markdown}\n\n`;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error scraping ${pageUrl}: ${error.message}`);
      }
    }
  } else {
    for (const page of results) {
      if (page.markdown) {
        const url = page.url || 'Unknown URL';
        combinedContent += `\n## ${url}\n\n${page.markdown}\n\n`;
      }
    }
  }
  
  fs.writeFileSync(outputPath, combinedContent);
  console.log(`Saved PayloadCMS documentation to ${outputPath}`);
}

downloadPayloadDocs();
