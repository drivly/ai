'use client'

import { Loader2, LogOut } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

// This component follows the API expected by Payload CMS admin UI
const CustomLogoutButton: React.FC<{ redirectTo?: string }> = (props) => {
  const [loading, setLoading] = React.useState(false)

  return (
    <Link
      href='/logout'
      onClick={() => setLoading(true)}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
      {loading ? (
        <Loader2 style={{ height: '16px', width: '16px', animation: 'spin 1s linear infinite' }} />
      ) : (
        <LogOut style={{ height: '16px', width: '16px', transform: 'rotate(180deg)' }} />
      )}
    </Link>
  )
}

export default CustomLogoutButton
