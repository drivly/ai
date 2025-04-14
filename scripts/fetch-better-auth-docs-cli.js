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

const BETTER_AUTH_DOCS_URL = 'https://www.better-auth.com/docs';
const MAX_URLS = 100; // Adjust as needed to capture all docs

async function fetchBetterAuthDocs() {
  try {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY environment variable is not set');
    }

    console.log('Starting Better-Auth documentation crawl using Firecrawl CLI...');
    
    if (!fs.existsSync(tempOutputDir)) {
      fs.mkdirSync(tempOutputDir, { recursive: true });
    }
    
    console.log(`Running npx generate-llmstxt for ${BETTER_AUTH_DOCS_URL}...`);
    execSync(
      `npx generate-llmstxt --api-key ${apiKey} --url ${BETTER_AUTH_DOCS_URL} --max-urls ${MAX_URLS} --output-dir ${tempOutputDir}`,
      { stdio: 'inherit' }
    );
    
    const llmsPath = path.join(tempOutputDir, 'llms.txt');
    const llmsFullPath = path.join(tempOutputDir, 'llms-full.txt');
    
    if (!fs.existsSync(llmsPath) || !fs.existsSync(llmsFullPath)) {
      throw new Error('Failed to generate llms.txt or llms-full.txt files');
    }
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const betterAuthLlmsPath = path.join(rootDir, 'docs', 'better-auth-llms.txt');
    const betterAuthLlmsFullPath = path.join(rootDir, 'docs', 'better-auth-llms-full.txt');
    const betterAuthDocsPath = path.join(rootDir, 'docs', 'better-auth.md');
    
    fs.copyFileSync(llmsPath, betterAuthLlmsPath);
    fs.copyFileSync(llmsFullPath, betterAuthLlmsFullPath);
    fs.copyFileSync(llmsFullPath, betterAuthDocsPath);
    
    console.log(`Saved llms.txt to ${betterAuthLlmsPath}`);
    console.log(`Saved llms-full.txt to ${betterAuthLlmsFullPath}`);
    console.log(`Saved documentation to ${betterAuthDocsPath}`);
    
    await processLlmsFullToMarkdown(llmsFullPath);
    
    fs.rmSync(tempOutputDir, { recursive: true, force: true });
    
    console.log('Better-Auth documentation crawl completed successfully');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function processLlmsFullToMarkdown(llmsFullPath) {
  try {
    console.log('Processing llms-full.txt to markdown files...');
    
    const content = fs.readFileSync(llmsFullPath, 'utf8');
    
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
