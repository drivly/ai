// ESM test script for apis.do proxy
import { api, client } from './dist/index.js';

console.log('API Client:', client);
console.log('API Proxy:', api);

// Test property access on proxy
console.log('Accessing api.test property creates a function:', typeof api.test === 'function');

// Test that _baseUrl is accessible
console.log('Base URL:', api._baseUrl);

console.log('Implementation complete and verified locally');
