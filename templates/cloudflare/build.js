#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Running Next.js build...');
execSync('next build', { stdio: 'inherit' });

console.log('Running open-next build...');
execSync('npx open-next build', { stdio: 'inherit' });

console.log('Build completed successfully!');
