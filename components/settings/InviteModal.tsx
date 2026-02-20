'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'

interface Props {
  householdId: string
  onClose: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text-1)',
  fontFamily: 'var(--font-jetbrains)',
  fontSize: '13px',
  padding: '10px 12px',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  fontWeight: 400,
  color: 'var(--text-3)',
  letterSpacing: '0.02em',
  marginBottom: 6,
  display: 'block',
}

export default function InviteModal({ householdId, onClose }: Props) {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    const { data, error } = await supabase
      .from('invites')
      .insert({
        household_id: householdId,
        email: email.trim() || null,
      })
      .select('token')
      .single()

    if (error || !data) {
      showToast('failed to generate invite', 'error')
      setGenerating(false)
      return
    }

    setInviteUrl(`${window.location.origin}/join/${data.token}`)
    setGenerating(false)
  }

  const handleCopy = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      showToast('link copied')
    } catch {
      showToast('failed to copy', 'error')
    }
  }

  return (
    <Modal title="invite member" onClose={onClose}>
      {!inviteUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="leave blank for general invite"
              style={inputStyle}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '10px 16px',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 13,
              fontWeight: 700,
              cursor: generating ? 'wait' : 'pointer',
              opacity: generating ? 0.6 : 1,
            }}
          >
            {generating ? 'generating...' : 'generate invite'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 12,
              color: 'var(--text-2)',
              margin: 0,
              wordBreak: 'break-all',
              background: 'var(--bg)',
              padding: '10px 12px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              lineHeight: 1.5,
            }}
          >
            {inviteUrl}
          </p>
          <button
            onClick={handleCopy}
            style={{
              background: 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '10px 16px',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            copy link
          </button>
        </div>
      )}
    </Modal>
  )
}
