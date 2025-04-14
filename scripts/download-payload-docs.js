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
    const response = await fetch(`${FIRECRAWL_API_URL}/crawl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: PAYLOAD_DOCS_URL,
        includePaths: ['/docs/*'],
        allowBackwardLinks: true,
        maxDepth: 5,
        limit: 1000,
        scrapeOptions: {
          formats: ["markdown"],
          onlyMainContent: true
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
  
  for (const page of results) {
    if (page.markdown) {
      const url = page.url || 'Unknown URL';
      combinedContent += `\n## ${url}\n\n${page.markdown}\n\n`;
    }
  }
  
  fs.writeFileSync(outputPath, combinedContent);
  console.log(`Saved PayloadCMS documentation to ${outputPath}`);
}

downloadPayloadDocs();
