'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'
import { AVATAR_COLORS } from '@/lib/constants'

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

export default function RegisterPage() {
  const [householdName, setHouseholdName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) {
      showToast(authError.message, 'error')
      setSubmitting(false)
      return
    }

    const userId = authData.user?.id
    if (!userId) {
      showToast('Sign up failed — no user returned', 'error')
      setSubmitting(false)
      return
    }

    // Create household
    const { data: household, error: householdError } = await supabase
      .from('households')
      .insert({ name: householdName })
      .select('id')
      .single()

    if (householdError || !household) {
      showToast(householdError?.message ?? 'Failed to create household', 'error')
      setSubmitting(false)
      return
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      household_id: household.id,
      display_name: displayName,
      role: 'admin',
      avatar_color: AVATAR_COLORS[0],
    })

    if (profileError) {
      showToast(profileError.message, 'error')
      setSubmitting(false)
      return
    }

    router.push('/home')
  }

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
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--text-1)',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            marginBottom: '8px',
          }}
        >
          join keep
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '12px',
            fontWeight: 400,
            color: 'var(--text-3)',
            marginBottom: '40px',
          }}
        >
          you&apos;ll be the admin
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="household name"
            value={householdName}
            onChange={e => setHouseholdName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="your name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
            style={inputStyle}
          />
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
            {submitting ? 'creating...' : 'create household \u2192'}
          </button>
        </form>

        {/* Back link */}
        <div style={{ marginTop: '32px' }}>
          <Link
            href="/"
            style={{
              color: 'var(--text-3)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            &larr; back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
