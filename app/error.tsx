'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      gap: '16px',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '16px',
        fontWeight: 700,
        color: 'var(--red)',
      }}>
        something went wrong
      </h2>
      <p style={{
        fontFamily: 'var(--font-outfit)',
        fontSize: '14px',
        color: 'var(--text-3)',
        textAlign: 'center',
      }}>
        {error.message ?? 'an unexpected error occurred'}
      </p>
      <button onClick={reset} style={{
        background: 'none',
        border: 'none',
        color: 'var(--accent)',
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '13px',
        cursor: 'pointer',
        padding: 0,
      }}>
        try again →
      </button>
    </div>
  )
}
