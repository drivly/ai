#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'docs', 'Payload firecrawl llms.txt');

const PAYLOAD_DOCS_URL = 'https://payloadcms.com/docs';

async function downloadPayloadDocs() {
  try {
    console.log('Downloading PayloadCMS documentation...');
    
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
      'https://payloadcms.com/docs/plugins/overview',
      'https://payloadcms.com/docs/cloud/overview',
      'https://payloadcms.com/docs/production/deployment',
      'https://payloadcms.com/docs/production/security',
      'https://payloadcms.com/docs/production/caching',
      'https://payloadcms.com/docs/production/monitoring',
      'https://payloadcms.com/docs/production/scaling',
      'https://payloadcms.com/docs/production/backups',
      'https://payloadcms.com/docs/production/logging',
      'https://payloadcms.com/docs/production/error-handling',
      'https://payloadcms.com/docs/production/performance',
      'https://payloadcms.com/docs/production/seo',
      'https://payloadcms.com/docs/production/analytics',
      'https://payloadcms.com/docs/production/accessibility',
      'https://payloadcms.com/docs/production/internationalization',
      'https://payloadcms.com/docs/production/localization',
      'https://payloadcms.com/docs/production/testing',
      'https://payloadcms.com/docs/production/ci-cd'
    ];
    
    let combinedContent = `# PayloadCMS Documentation\n\nSource: ${PAYLOAD_DOCS_URL}\n\n`;
    let successCount = 0;
    
    for (const pageUrl of pagesToScrape) {
      try {
        console.log(`Scraping ${pageUrl}...`);
        
        const response = await fetch(pageUrl);
        
        if (!response.ok) {
          console.error(`Failed to fetch ${pageUrl}: ${response.status} ${response.statusText}`);
          continue;
        }
        
        const html = await response.text();
        
        const mainContent = extractMainContent(html);
        
        if (mainContent) {
          const title = extractTitle(html) || pageUrl.split('/').pop();
          combinedContent += `\n## ${title}\n\nURL: ${pageUrl}\n\n${mainContent}\n\n`;
          successCount++;
        } else {
          console.error(`Failed to extract content from ${pageUrl}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error scraping ${pageUrl}: ${error.message}`);
      }
    }
    
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }
    
    fs.writeFileSync(outputPath, combinedContent);
    console.log(`Successfully scraped ${successCount} pages and saved to ${outputPath}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

function extractMainContent(html) {
  try {
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    
    if (mainMatch && mainMatch[1]) {
      const contentMatch = mainMatch[1].match(/<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/i);
      let content = contentMatch && contentMatch[1] ? contentMatch[1] : mainMatch[1];
      
      content = content
        .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
        .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
        .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
        .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
        .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '##### $1\n\n')
        .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '###### $1\n\n')
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
        .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
        .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
        .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
        .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '```\n$1\n```\n\n')
        .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, '$1\n')
        .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, '$1\n')
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
        .replace(/<br[^>]*>/gi, '\n')
        .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove extra newlines
        .trim();
      
      return content;
    }
  } catch (error) {
    console.error('Error extracting content:', error.message);
  }
  
  return null;
}

function extractTitle(html) {
  try {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].replace(' | Payload CMS', '').trim();
    }
    
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      return h1Match[1].replace(/<[^>]*>/g, '').trim();
    }
  } catch (error) {
    console.error('Error extracting title:', error.message);
  }
  
  return null;
}

downloadPayloadDocs();
