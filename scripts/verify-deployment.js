#!/usr/bin/env node

/**
 * This script verifies that a Vercel deployment is working correctly
 * by checking if the root path is accessible.
 * 
 * Usage:
 *   node scripts/verify-deployment.js [url]
 * 
 * If no URL is provided, it will use the VERCEL_URL environment variable.
 */

const https = require('https');

const deploymentUrl = process.argv[2] || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

if (!deploymentUrl) {
  console.error('Error: No deployment URL provided. Please provide a URL as an argument or set the VERCEL_URL environment variable.');
  process.exit(1);
}

console.log(`Verifying deployment at: ${deploymentUrl}`);

https.get(deploymentUrl, (res) => {
  console.log(`Status code: ${res.statusCode}`);
  
  if (res.statusCode !== 200) {
    console.error(`Error: Deployment verification failed. Root path returned status code ${res.statusCode}`);
    process.exit(1);
  }
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Deployment verification successful. Root path is accessible.');
    
    const contentType = res.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      try {
        const jsonData = JSON.parse(data);
        console.log('Response data:', jsonData);
      } catch (error) {
        console.warn('Warning: Response claimed to be JSON but could not be parsed:', error.message);
      }
    } else {
      console.log(`Response content-type: ${contentType}`);
      console.log(`Response length: ${data.length} bytes`);
    }
    
    process.exit(0);
  });
}).on('error', (error) => {
  console.error('Error verifying deployment:', error.message);
  process.exit(1);
});
