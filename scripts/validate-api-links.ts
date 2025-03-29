#!/usr/bin/env node
import { crawlApi } from '../tests/utils/apiCrawler';

const args = process.argv.slice(2);
const baseUrl = args[0] || 'http://localhost:3000';
const maxDepth = parseInt(args[1] || '3', 10);

console.log(`Validating API links starting from ${baseUrl} with max depth ${maxDepth}`);

(async () => {
  try {
    const results = await crawlApi({
      baseUrl,
      maxDepth,
      excludePaths: ['/admin'],
      excludeParams: ['next', 'prev'],
    });
    
    const validResults = results.filter(r => r.isValid);
    const invalidResults = results.filter(r => !r.isValid);
    
    console.log(`\nAPI Link Validation Summary:`);
    console.log(`- Total links checked: ${results.length}`);
    console.log(`- Valid links: ${validResults.length}`);
    console.log(`- Invalid links: ${invalidResults.length}`);
    
    if (invalidResults.length > 0) {
      console.error('\nInvalid Links:');
      invalidResults.forEach(result => {
        console.error(`- ${result.url} (Status: ${result.status}, Error: ${result.error || 'None'})`);
      });
      process.exit(1);
    } else {
      console.log('\nAll API links are valid!');
    }
  } catch (error) {
    console.error('Error validating API links:', error);
    process.exit(1);
  }
})();
