#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'reference', 'better-auth');
const tempOutputDir = path.join(rootDir, 'temp-better-auth');

const BETTER_AUTH_BASE_URL = 'https://www.better-auth.com';
const BETTER_AUTH_DOCS_URL = `${BETTER_AUTH_BASE_URL}/docs`;
const MAX_URLS = 500; // Increased to capture all docs

const PATHS_TO_CRAWL = [
  '/docs',
  '/docs/introduction',
  '/docs/getting-started',
  '/docs/features',
  '/docs/api-reference',
  '/docs/guides',
  '/docs/examples',
  '/docs/plugins',
  '/docs/plugins/oauth-proxy',
  '/docs/plugins/passwordless',
  '/docs/plugins/social-login'
];

async function fetchBetterAuthDocs() {
  try {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY environment variable is not set');
    }

    console.log('Starting Better-Auth documentation crawl using Firecrawl CLI...');
    
    if (fs.existsSync(tempOutputDir)) {
      fs.rmSync(tempOutputDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(tempOutputDir, { recursive: true });
    
    for (let i = 0; i < PATHS_TO_CRAWL.length; i++) {
      const path = PATHS_TO_CRAWL[i];
      const pathDir = `${tempOutputDir}/path_${i}`;
      fs.mkdirSync(pathDir, { recursive: true });
      
      const url = `${BETTER_AUTH_BASE_URL}${path}`;
      console.log(`Crawling ${url}...`);
      
      try {
        execSync(
          `npx generate-llmstxt --api-key ${apiKey} --url ${url} --max-urls ${MAX_URLS} --output-dir ${pathDir}`,
          { stdio: 'inherit', timeout: 60000 } // 60 second timeout
        );
      } catch (error) {
        console.log(`Warning: Error crawling ${url}: ${error.message}`);
      }
    }
    
    const combinedContent = [];
    for (let i = 0; i < PATHS_TO_CRAWL.length; i++) {
      const pathDir = `${tempOutputDir}/path_${i}`;
      const llmsFullPath = path.join(pathDir, 'llms-full.txt');
      
      if (fs.existsSync(llmsFullPath)) {
        const content = fs.readFileSync(llmsFullPath, 'utf8');
        combinedContent.push(content);
      }
    }
    
    if (!fs.existsSync(path.join(rootDir, 'docs'))) {
      fs.mkdirSync(path.join(rootDir, 'docs'), { recursive: true });
    }
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const combinedContentText = combinedContent.join('\n\n');
    const betterAuthDocsPath = path.join(rootDir, 'docs', 'better-auth.md');
    const betterAuthLlmsFullPath = path.join(rootDir, 'docs', 'better-auth-llms-full.txt');
    const betterAuthLlmsPath = path.join(rootDir, 'docs', 'better-auth-llms.txt');
    
    fs.writeFileSync(betterAuthDocsPath, combinedContentText);
    fs.writeFileSync(betterAuthLlmsFullPath, combinedContentText);
    
    const simplifiedContent = combinedContentText
      .split('\n\n')
      .filter((para, index) => index % 3 === 0) // Take every third paragraph to reduce size
      .join('\n\n');
    
    fs.writeFileSync(betterAuthLlmsPath, simplifiedContent);
    
    console.log(`Saved documentation to ${betterAuthDocsPath}`);
    console.log(`Saved llms-full.txt to ${betterAuthLlmsFullPath}`);
    console.log(`Saved llms.txt to ${betterAuthLlmsPath}`);
    
    await processLlmsFullToMarkdown(combinedContentText);
    
    fs.rmSync(tempOutputDir, { recursive: true, force: true });
    
    console.log('Better-Auth documentation crawl completed successfully');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function processLlmsFullToMarkdown(content) {
  try {
    console.log('Processing content to markdown files...');
    
    const sections = content.split(/(?=^# |^## )/m).filter(section => section.trim());
    
    console.log(`Found ${sections.length} sections to process`);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      const titleMatch = section.match(/^#+ (.+?)(?:\n|$)/);
      const title = titleMatch ? titleMatch[1].trim() : `Section ${i + 1}`;
      
      const fileName = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '.md';
      
      const filePath = path.join(outputDir, fileName);
      
      const markdownContent = `---
title: ${title}
description: Documentation from Better-Auth
sourceUrl: ${BETTER_AUTH_DOCS_URL}
---

${section}`;
      
      fs.writeFileSync(filePath, markdownContent);
      console.log(`Saved section "${title}" to ${filePath}`);
    }
    
    console.log(`Processed ${sections.length} markdown files to ${outputDir}`);
  } catch (error) {
    console.error('Error processing markdown:', error.message);
    throw error;
  }
}

fetchBetterAuthDocs();
