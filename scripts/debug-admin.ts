import fetch from 'node-fetch';

const checkAdminRoute = async () => {
  try {
    console.log('Checking admin route...');
    const response = await fetch('http://localhost:3000/admin');
    console.log(`Status: ${response.status}`);
    console.log(`Headers: ${JSON.stringify(response.headers.raw(), null, 2)}`);
    
    if (response.redirected) {
      console.log(`Redirected to: ${response.url}`);
      const authResponse = await fetch(response.url);
      console.log(`Auth Status: ${authResponse.status}`);
      
      try {
        const text = await authResponse.text();
        console.log(`Auth Response Body (first 500 chars): ${text.substring(0, 500)}${text.length > 500 ? '...' : ''}`);
      } catch (e) {
        console.log(`Could not get auth response body: ${e}`);
      }
    }
    
    try {
      const text = await response.text();
      console.log(`Response Body (first 500 chars): ${text.substring(0, 500)}${text.length > 500 ? '...' : ''}`);
    } catch (e) {
      console.log(`Could not get response body: ${e}`);
    }
  } catch (error) {
    console.error('Error checking admin route:', error);
  }
};

checkAdminRoute();
