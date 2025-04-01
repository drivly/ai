#!/usr/bin/env node

/**
 * Script to wait for the server to be ready by polling the health endpoint
 * Usage: node scripts/wait-for-server.js [baseUrl] [timeout] [interval]
 * - baseUrl: Base URL to poll (default: http://localhost)
 * - timeout: Maximum time to wait in milliseconds (default: 60000)
 * - interval: Polling interval in milliseconds (default: 1000)
 */

const baseUrl = process.argv[2] || 'http://localhost';
const timeout = parseInt(process.argv[3] || '60000', 10);
const interval = parseInt(process.argv[4] || '1000', 10);
const ports = [3000, 3001, 3002, 3003, 3004, 3005]; // Common Next.js ports

console.log(`Waiting for server to be ready at ${baseUrl}:PORT`);
console.log(`Will try ports: ${ports.join(', ')}`);
console.log(`Timeout: ${timeout}ms, Interval: ${interval}ms`);

const startTime = Date.now();

async function checkPort(port) {
  const url = `${baseUrl}:${port}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    const statusCode = response.status;
    console.log(`Server at ${url} responded with status code: ${statusCode}`);
    
    if (statusCode >= 200 && statusCode < 500) {
      console.log(`Found working server at ${url}`);
      process.env.SERVER_PORT = port.toString();
      process.env.BASE_URL = url;
      return true;
    }
    return false;
  } catch (error) {
    console.log(`Request error for ${url}: ${error.message}`);
    return false;
  }
}

async function waitForServer() {
  while (Date.now() - startTime < timeout) {
    for (const port of ports) {
      if (await checkPort(port)) {
        console.log(`Server is ready at ${baseUrl}:${port} after ${Date.now() - startTime}ms`);
        console.log(`Setting BASE_URL=${baseUrl}:${port} for tests`);
        process.exit(0);
      }
    }

    console.log(`No server found on any port. Waiting ${interval}ms before next check...`);
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  console.error(`Server not ready on any port after ${timeout}ms`);
  process.exit(1);
}

waitForServer();
