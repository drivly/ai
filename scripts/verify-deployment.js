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

// Get the URL to check from command line args or environment variables
const deploymentUrl = process.argv[2] || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

if (!deploymentUrl) {
  console.error('Error: No deployment URL provided. Please provide a URL as an argument or set the VERCEL_URL environment variable.');
  process.exit(1);
}

console.log(`Verifying deployment at: ${deploymentUrl}`);

// Use modern fetch API to make a request to the root path
async function verifyDeployment() {
  try {
    const response = await fetch(deploymentUrl);
    console.log(`Status code: ${response.status}`);
    
    if (response.status !== 200) {
      console.error(`Error: Deployment verification failed. Root path returned status code ${response.status}`);
      process.exit(1);
    }
    
    console.log('Deployment verification successful. Root path is accessible.');
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const jsonData = await response.json();
        console.log('Response data:', jsonData);
      } catch (error) {
        console.warn('Warning: Response claimed to be JSON but could not be parsed:', error.message);
      }
    } else {
      const text = await response.text();
      console.log(`Response content-type: ${contentType}`);
      console.log(`Response length: ${text.length} bytes`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error verifying deployment:', error.message);
    process.exit(1);
  }
}

verifyDeployment();
