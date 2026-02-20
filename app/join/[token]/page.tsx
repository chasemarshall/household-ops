'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'
import { AVATAR_COLORS } from '@/lib/constants'
import type { Invite } from '@/lib/types'

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

export default function JoinPage() {
  const params = useParams<{ token: string }>()
  const token = params.token
  const [invite, setInvite] = useState<Invite | null>(null)
  const [status, setStatus] = useState<'loading' | 'invalid' | 'ready'>('loading')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkInvite = async () => {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .single()

      if (error || !data) {
        setStatus('invalid')
      } else {
        setInvite(data)
        if (data.email) setEmail(data.email)
        setStatus('ready')
      }
    }
    checkInvite()
  }, [token])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!invite) return
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

    // Pick a random avatar color
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

    // Create profile + mark invite used via security definer function
    const { error: rpcError } = await supabase.rpc('join_household', {
      p_household_id: invite.household_id,
      p_display_name: displayName,
      p_avatar_color: avatarColor,
      p_invite_id: invite.id,
    })

    if (rpcError) {
      showToast(rpcError.message, 'error')
      setSubmitting(false)
      return
    }

    router.push('/home')
  }

  if (status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '14px',
            color: 'var(--text-3)',
          }}
        >
          checking invite...
        </p>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '24px',
          background: 'var(--bg)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '14px',
            color: 'var(--red)',
          }}
        >
          invite invalid or already used
        </p>
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
    )
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
          join household
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
          you&apos;ve been invited
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            {submitting ? 'joining...' : 'join household \u2192'}
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
