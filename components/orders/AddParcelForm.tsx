'use client'
import { useState } from 'react'

interface Props {
  onAdd: (params: { tracking_number: string; carrier_code: string; description: string }) => Promise<{ success: boolean; error_message?: string }>
  saving?: boolean
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

export default function AddParcelForm({ onAdd, saving }: Props) {
  const [description, setDescription] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrierCode, setCarrierCode] = useState('')
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null)

  const canSubmit = description.trim() !== '' && trackingNumber.trim() !== '' && carrierCode.trim() !== '' && !saving

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setMessage(null)
    const result = await onAdd({
      tracking_number: trackingNumber.trim(),
      carrier_code: carrierCode.trim().toLowerCase(),
      description: description.trim(),
    })
    if (result.success) {
      setMessage({ text: 'delivery added', success: true })
      setDescription('')
      setTrackingNumber('')
      setCarrierCode('')
    } else {
      setMessage({ text: result.error_message ?? 'failed to add delivery', success: false })
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      background: 'var(--card)',
      borderRadius: 'var(--radius)',
      padding: '14px',
      marginBottom: 8,
    }}>
      <div>
        <label style={labelStyle}># description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="AirPods from Amazon"
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}># tracking number</label>
        <input
          type="text"
          value={trackingNumber}
          onChange={e => setTrackingNumber(e.target.value)}
          placeholder="1Z999AA10123456784"
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}># carrier code</label>
        <input
          type="text"
          value={carrierCode}
          onChange={e => setCarrierCode(e.target.value)}
          placeholder="ups"
          required
          style={inputStyle}
        />
        <a
          href="https://web.parcelapp.net/#carriers"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-3)',
            marginTop: 4,
            display: 'inline-block',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
        >
          full list at parcelapp.net
        </a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 2 }}>
        {message && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: message.success ? 'var(--green)' : 'var(--red)',
          }}>
            {message.text}
          </span>
        )}
        <div style={{ flex: 1 }} />
        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            background: canSubmit ? 'var(--accent)' : 'var(--border)',
            border: 'none',
            borderRadius: 'var(--radius)',
            color: canSubmit ? 'var(--crust)' : 'var(--text-3)',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '12px',
            fontWeight: 600,
            padding: '8px 20px',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
          }}
        >
          {saving ? 'adding...' : 'add \u2192'}
        </button>
      </div>
    </form>
  )
}
