'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link.js'

interface OAuthClient {
  id: string
  name: string
  clientId: string
  clientSecret: string
  redirectURLs: string
  disabled: boolean
}

export default function OAuthClientsPage() {
  const [clients, setClients] = useState<OAuthClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [redirectURLs, setRedirectURLs] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const response = await fetch('/oauth/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients)
      } else {
        setError('Failed to load clients')
      }
    } catch (err) {
      setError('An error occurred while fetching clients')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')
    setError('')

    if (!name.trim() || !redirectURLs.trim()) {
      setError('Name and Redirect URLs are required')
      return
    }

    try {
      const response = await fetch('/oauth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          redirectURLs: redirectURLs
            .split(',')
            .map((url) => url.trim())
            .filter(Boolean),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccessMessage(`Client "${data.name}" registered successfully!`)
        setName('')
        setRedirectURLs('')
        fetchClients()
      } else {
        const error = await response.json()
        setError(error.error_description || 'Failed to register client')
      }
    } catch (err) {
      setError('An error occurred while registering the client')
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-6 text-3xl font-bold'>OAuth Clients</h1>

      {successMessage && <div className='mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700'>{successMessage}</div>}

      {error && <div className='mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>{error}</div>}

      <div className='mb-8 rounded bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-semibold'>Register New OAuth Client</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='name'>
              Name
            </label>
            <input
              id='name'
              type='text'
              className='w-full appearance-none rounded border px-3 py-2 text-gray-700 shadow'
              placeholder='e.g., OpenAI Actions, Zapier'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='mb-6'>
            <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='redirectURLs'>
              Redirect URLs (comma separated)
            </label>
            <input
              id='redirectURLs'
              type='text'
              className='w-full appearance-none rounded border px-3 py-2 text-gray-700 shadow'
              placeholder='https://chat.openai.com/aip/oauth/callback,https://zapier.com/oauth/callback'
              value={redirectURLs}
              onChange={(e) => setRedirectURLs(e.target.value)}
            />
          </div>
          <button type='submit' className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'>
            Register Client
          </button>
        </form>
      </div>

      <h2 className='mb-4 text-xl font-semibold'>Existing OAuth Clients</h2>
      {loading ? (
        <p>Loading...</p>
      ) : clients.length === 0 ? (
        <p>No OAuth clients found.</p>
      ) : (
        <div className='overflow-x-auto rounded bg-white shadow-md'>
          <table className='min-w-full'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left'>Name</th>
                <th className='px-4 py-2 text-left'>Client ID</th>
                <th className='px-4 py-2 text-left'>Redirect URLs</th>
                <th className='px-4 py-2 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className='border px-4 py-2'>{client.name}</td>
                  <td className='border px-4 py-2'>{client.clientId}</td>
                  <td className='border px-4 py-2'>{client.redirectURLs}</td>
                  <td className='border px-4 py-2'>{client.disabled ? <span className='text-red-500'>Disabled</span> : <span className='text-green-500'>Active</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='mt-8'>
        <Link href='/admin' className='inline-block rounded bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300'>
          Back to Admin
        </Link>
      </div>
    </div>
  )
}
