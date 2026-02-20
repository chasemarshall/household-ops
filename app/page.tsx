'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'
import { useSession } from '@/contexts/SessionContext'

const inputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border)',
  color: 'var(--text-1)',
  fontFamily: 'var(--font-outfit)',
  fontSize: '15px',
  padding: '8px 0',
  outline: 'none',
  width: '100%',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()
  const { profile, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && profile) router.push('/home')
  }, [profile, loading, router])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      showToast(error.message, 'error')
      setSubmitting(false)
    } else {
      router.push('/home')
    }
  }

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/home' },
    })
    if (error) showToast(error.message, 'error')
  }

  if (loading) return null

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '320px' }}>
        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '48px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1,
            letterSpacing: '-2px',
            marginBottom: '48px',
            textAlign: 'center',
          }}
        >
          household
          <br />
          ops
        </h1>

        {/* Login form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '14px',
              fontWeight: 400,
              cursor: 'pointer',
              padding: '12px 0 0',
              textAlign: 'left',
              opacity: submitting ? 0.5 : 1,
            }}
          >
            {submitting ? 'signing in...' : 'sign in \u2192'}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            margin: '28px 0',
          }}
        />

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={{
            width: '100%',
            background: 'var(--card)',
            border: 'none',
            borderRadius: 'var(--radius)',
            color: 'var(--text-1)',
            fontFamily: 'var(--font-outfit)',
            fontSize: '14px',
            fontWeight: 400,
            padding: '12px 0',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          continue with google
        </button>

        {/* Create household link */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link
            href="/register"
            style={{
              color: 'var(--text-3)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            create a household
          </Link>
        </div>
      </div>
    </div>
  )
}
