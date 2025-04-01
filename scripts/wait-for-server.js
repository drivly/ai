#!/usr/bin/env node

/**
 * Script to wait for the server to be ready by polling the health endpoint
 * Usage: node scripts/wait-for-server.js [url] [timeout] [interval]
 * - url: URL to poll (default: http://localhost:3000)
 * - timeout: Maximum time to wait in milliseconds (default: 60000)
 * - interval: Polling interval in milliseconds (default: 1000)
 */

const http = require('http');
const https = require('https');

const url = process.argv[2] || 'http://localhost:3000';
const timeout = parseInt(process.argv[3] || '60000', 10);
const interval = parseInt(process.argv[4] || '1000', 10);

console.log(`Waiting for server to be ready at ${url}`);
console.log(`Timeout: ${timeout}ms, Interval: ${interval}ms`);

const startTime = Date.now();

function isServerReady() {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      const statusCode = res.statusCode;
      console.log(`Server responded with status code: ${statusCode}`);
      resolve(statusCode >= 200 && statusCode < 500);
    });

    req.on('error', (err) => {
      console.log(`Request error: ${err.message}`);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('Request timed out');
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer() {
  while (Date.now() - startTime < timeout) {
    if (await isServerReady()) {
      console.log(`Server is ready after ${Date.now() - startTime}ms`);
      process.exit(0);
    }

    console.log(`Waiting ${interval}ms before next check...`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  console.error(`Server not ready after ${timeout}ms`);
  process.exit(1);
}

waitForServer();
