console.log('Environment variable test:');
console.log(`BASE_URL: ${process.env.BASE_URL}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`BROWSER_TESTS: ${process.env.BROWSER_TESTS}`);
console.log(`VERCEL_AUTOMATION_BYPASS_SECRET: ${process.env.VERCEL_AUTOMATION_BYPASS_SECRET ? '[REDACTED]' : 'undefined'}`);
console.log('All env vars:');
Object.keys(process.env).sort().forEach(key => {
  const value = key.includes('SECRET') || key.includes('TOKEN') || key.includes('KEY') 
    ? '[REDACTED]' 
    : process.env[key];
  console.log(`  ${key}: ${value}`);
});
