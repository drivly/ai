#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Running unified LLM fetcher for Payload Firecrawl source only...');

try {
  execSync(`node ${path.join(__dirname, 'unified-llm-fetcher.js')} --source=payload-firecrawl`, {
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
