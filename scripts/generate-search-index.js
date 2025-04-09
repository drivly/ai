#!/usr/bin/env node

/**
 * Script to create a minimal Pagefind setup for Nextra documentation
 * This creates a stub _pagefind directory with minimal files to prevent search errors
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
const pagefindDir = path.resolve(publicDir, '_pagefind');

console.log('Creating minimal Pagefind setup...');

try {
  if (!fs.existsSync(pagefindDir)) {
    fs.mkdirSync(pagefindDir, { recursive: true });
  }
  
  const pagefindJsContent = `
window.pagefind = {
  init: () => Promise.resolve(),
  search: (query) => Promise.resolve({ results: [] }),
  debouncedSearch: (query) => Promise.resolve({ results: [] }),
  options: (opts) => Promise.resolve()
};
`;
  
  fs.writeFileSync(path.resolve(pagefindDir, 'pagefind.js'), pagefindJsContent);
  
  fs.writeFileSync(
    path.resolve(pagefindDir, 'index.json'),
    JSON.stringify({ version: 1, index: {}, filters: {} })
  );
  
  console.log('Minimal Pagefind setup created in public/_pagefind directory');
  console.log('This will prevent search errors but search functionality will return no results');
} catch (error) {
  console.error('Error setting up minimal Pagefind:', error);
  process.exit(1);
}
