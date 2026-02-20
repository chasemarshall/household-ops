'use client'
import { useState } from 'react'
import type { Bill } from '@/lib/types'

interface Props {
  initial?: Partial<Bill>
  onSave: (data: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => void
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

export default function BillForm({ initial, onSave, onDelete, saving }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [amount, setAmount] = useState(initial?.amount != null ? String(initial.amount) : '')
  const [dueDate, setDueDate] = useState(initial?.due_date ?? '')
  const [recurring, setRecurring] = useState(initial?.recurring ?? false)
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const canSubmit = name.trim() !== '' && dueDate !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSave({
      name: name.trim(),
      amount: amount !== '' ? parseFloat(amount) : null,
      due_date: dueDate,
      paid: initial?.paid ?? false,
      paid_date: initial?.paid_date ?? null,
      recurring,
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
          placeholder="Electric bill"
          required
          style={inputStyle}
        />
      </div>

      {/* Amount */}
      <div>
        <label style={labelStyle}># amount ($)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          style={inputStyle}
        />
      </div>

      {/* Due date */}
      <div>
        <label style={labelStyle}># due date</label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
          style={{ ...inputStyle, colorScheme: 'dark' }}
        />
      </div>

      {/* Recurring */}
      <label style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        cursor: 'pointer',
      }}>
        <input
          type="checkbox"
          checked={recurring}
          onChange={e => setRecurring(e.target.checked)}
          style={{ marginTop: 2, accentColor: 'var(--accent)' }}
        />
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-3)',
          }}>
            # recurring
          </span>
          <span style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: '12px',
            color: 'var(--text-2)',
          }}>
            auto-creates next month&apos;s bill when marked paid
          </span>
        </span>
      </label>

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
