'use client'
import { useState } from 'react'
import type { Order, OrderType, OrderFrequency, OrderStatus } from '@/lib/types'

interface Props {
  initial?: Partial<Order>
  onSave: (data: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => void
  onDelete?: () => void
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

export default function OrderForm({ initial, onSave, onDelete, saving }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<OrderType>(initial?.type ?? 'one_time')
  const [nextDeliveryDate, setNextDeliveryDate] = useState(initial?.next_delivery_date ?? '')
  const [frequency, setFrequency] = useState<OrderFrequency | ''>(initial?.frequency ?? '')
  const [status, setStatus] = useState<OrderStatus>(initial?.status ?? 'upcoming')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const canSubmit = name.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSave({
      name: name.trim(),
      type,
      next_delivery_date: nextDeliveryDate || null,
      frequency: type === 'recurring' && frequency ? frequency as OrderFrequency : null,
      status,
      notes: notes.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Name */}
      <div>
        <label style={labelStyle}># name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Amazon order"
          required
          style={inputStyle}
        />
      </div>

      {/* Type */}
      <div>
        <label style={labelStyle}># type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value as OrderType)}
          style={{ ...inputStyle, appearance: 'auto' }}
        >
          <option value="recurring">recurring</option>
          <option value="one_time">one-time</option>
        </select>
      </div>

      {/* Next delivery date */}
      <div>
        <label style={labelStyle}># next delivery date</label>
        <input
          type="date"
          value={nextDeliveryDate}
          onChange={e => setNextDeliveryDate(e.target.value)}
          style={{ ...inputStyle, colorScheme: 'dark' }}
        />
      </div>

      {/* Frequency (only for recurring) */}
      {type === 'recurring' && (
        <div>
          <label style={labelStyle}># frequency</label>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value as OrderFrequency | '')}
            style={{ ...inputStyle, appearance: 'auto' }}
          >
            <option value="">select...</option>
            <option value="weekly">weekly</option>
            <option value="biweekly">biweekly</option>
            <option value="monthly">monthly</option>
          </select>
        </div>
      )}

      {/* Status */}
      <div>
        <label style={labelStyle}># status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as OrderStatus)}
          style={{ ...inputStyle, appearance: 'auto' }}
        >
          <option value="upcoming">upcoming</option>
          <option value="ordered">ordered</option>
          <option value="shipped">shipped</option>
          <option value="delivered">delivered</option>
          <option value="recurring">recurring</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label style={labelStyle}># notes</label>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="optional"
          style={inputStyle}
        />
      </div>

      {/* Bottom row */}
      <div style={{
        display: 'flex',
        justifyContent: onDelete ? 'space-between' : 'flex-end',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
      }}>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            style={{
              background: 'none',
              border: '1px solid var(--red)',
              borderRadius: 'var(--radius)',
              color: 'var(--red)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '12px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            delete
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit || saving}
          style={{
            background: canSubmit && !saving ? 'var(--accent)' : 'var(--border)',
            border: 'none',
            borderRadius: 'var(--radius)',
            color: canSubmit && !saving ? 'var(--crust)' : 'var(--text-3)',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '12px',
            fontWeight: 600,
            padding: '8px 20px',
            cursor: canSubmit && !saving ? 'pointer' : 'not-allowed',
          }}
        >
          {saving ? 'saving...' : 'save \u2192'}
        </button>
      </div>
    </form>
  )
}
