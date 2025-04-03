'use client'

import Link from 'next/link'

export default function OAuthDocs() {
  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-6'>OAuth Integration</h1>
      
      <p className='mb-4'>
        The APIs.do platform provides OAuth 2.0 integration for external systems like OpenAI Actions, Zapier, and other third-party services. This allows users to authenticate with APIs.do and grant access to their data to external applications.
      </p>
      
      <h2 className='text-2xl font-semibold mt-8 mb-4'>Integration Overview</h2>
      
      <p className='mb-4'>
        Our OAuth implementation follows the standard OAuth 2.0 Authorization Code flow, which is suitable for server-side applications that can securely store client secrets.
      </p>
      
      <h2 className='text-2xl font-semibold mt-8 mb-4'>Integration Steps</h2>
      
      <ol className='list-decimal pl-6 mb-6 space-y-2'>
        <li>Register your application in the <Link href='/admin/oauth-clients' className='text-blue-500 hover:underline'>OAuth Clients Admin</Link> page</li>
        <li>Obtain your Client ID and Client Secret</li>
        <li>Implement the OAuth flow in your application</li>
        <li>Test the integration</li>
      </ol>
      
      <h2 className='text-2xl font-semibold mt-8 mb-4'>OAuth Endpoints</h2>
      
      <div className='bg-gray-100 p-4 rounded mb-6'>
        <h3 className='font-semibold mb-2'>Authorization Endpoint</h3>
        <code className='block bg-gray-200 p-2 rounded'>
          https://apis.do/oauth?provider=YOUR_CLIENT_ID&amp;redirect_uri=YOUR_REDIRECT_URI&amp;state=OPTIONAL_STATE
        </code>
        <p className='mt-2 text-sm'>
          This endpoint initiates the OAuth flow. The user will be redirected to the login page if not already authenticated.
        </p>
      </div>
      
      <div className='bg-gray-100 p-4 rounded mb-6'>
        <h3 className='font-semibold mb-2'>Token Endpoint</h3>
        <code className='block bg-gray-200 p-2 rounded'>
          https://apis.do/oauth/token
        </code>
        <p className='mt-2 text-sm'>
          This endpoint exchanges an authorization code for an access token. Send a POST request with the following parameters:
        </p>
        <ul className='list-disc pl-6 mt-2 text-sm'>
          <li>grant_type: &quot;authorization_code&quot;</li>
          <li>code: The authorization code received from the authorization endpoint</li>
          <li>redirect_uri: The same redirect URI used in the authorization request</li>
          <li>client_id: Your client ID</li>
          <li>client_secret: Your client secret</li>
        </ul>
      </div>
      
      <h2 className='text-2xl font-semibold mt-8 mb-4'>Integration Examples</h2>
      
      <h3 className='text-xl font-semibold mt-6 mb-3'>OpenAI Actions</h3>
      
      <p className='mb-4'>
        To integrate with OpenAI Actions for Custom GPTs:
      </p>
      
      <ol className='list-decimal pl-6 mb-6 space-y-2'>
        <li>Register your application with a redirect URI of <code className='bg-gray-200 px-1 rounded'>https://chat.openai.com/aip/oauth/callback</code></li>
        <li>In your OpenAI Actions configuration, set the OAuth URL to <code className='bg-gray-200 px-1 rounded'>https://apis.do/oauth?provider=YOUR_CLIENT_ID&amp;redirect_uri=https://chat.openai.com/aip/oauth/callback</code></li>
        <li>Set the token exchange URL to <code className='bg-gray-200 px-1 rounded'>https://apis.do/oauth/token</code></li>
        <li>Configure your OpenAI Action to include the access token in API requests to your service</li>
      </ol>
      
      <h3 className='text-xl font-semibold mt-6 mb-3'>Zapier</h3>
      
      <p className='mb-4'>
        To integrate with Zapier:
      </p>
      
      <ol className='list-decimal pl-6 mb-6 space-y-2'>
        <li>Register your application with a redirect URI of <code className='bg-gray-200 px-1 rounded'>https://zapier.com/dashboard/auth/oauth/return/App-ID/</code> (replace App-ID with your Zapier app ID)</li>
        <li>In your Zapier OAuth configuration, set the Authorization URL to <code className='bg-gray-200 px-1 rounded'>https://apis.do/oauth?provider=YOUR_CLIENT_ID&amp;redirect_uri=YOUR_REDIRECT_URI</code></li>
        <li>Set the Token Exchange URL to <code className='bg-gray-200 px-1 rounded'>https://apis.do/oauth/token</code></li>
        <li>Configure your Zapier integration to include the access token in API requests to your service</li>
      </ol>
      
      <h2 className='text-2xl font-semibold mt-8 mb-4'>Security Considerations</h2>
      
      <ul className='list-disc pl-6 mb-6 space-y-2'>
        <li>Always use HTTPS for all OAuth endpoints</li>
        <li>Keep your client secret secure and never expose it in client-side code</li>
        <li>Validate the redirect URI in your server-side code to prevent open redirector vulnerabilities</li>
        <li>Use the state parameter to prevent CSRF attacks</li>
      </ul>
      
      <div className='mt-8'>
        <Link
          href='/docs'
          className='inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded'
        >
          Back to Documentation
        </Link>
      </div>
    </div>
  )
}
