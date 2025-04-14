#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'docs', 'openrouter-llms-full.txt');
const outputPathCondensed = path.join(rootDir, 'docs', 'openrouter-llms.txt');

async function downloadFile() {
  try {
    console.log('Downloading OpenRouter LLMs listing...');
    const response = await fetch('https://openrouter.ai/docs/llms-full.txt');
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
    }
    
    const content = await response.text();
    
    fs.writeFileSync(outputPath, content);
    
    const condensedContent = content
      .split('\n')
      .filter(line => !line.startsWith('#') && line.trim() !== '')
      .join('\n');
    
    fs.writeFileSync(outputPathCondensed, condensedContent);
    
    console.log(`Successfully downloaded and saved to ${outputPath}`);
    console.log(`Successfully created condensed version at ${outputPathCondensed}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

downloadFile();
