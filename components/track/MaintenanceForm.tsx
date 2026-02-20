'use client'
import { useState } from 'react'
import { MAINTENANCE_CATEGORY_LABELS } from '@/lib/constants'
import type { MaintenanceItem, MaintenanceCategory } from '@/lib/types'

interface Props {
  initial?: Partial<MaintenanceItem>
  onSave: (data: Omit<MaintenanceItem, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => void
  onDelete?: () => void
  saving?: boolean
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains)',
  fontSize: '11px',
  color: 'var(--text-3)',
  letterSpacing: '0.03em',
  marginBottom: 6,
  display: 'block',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border)',
  borderRadius: 0,
  padding: '8px 0',
  fontFamily: 'var(--font-outfit)',
  fontSize: '14px',
  color: 'var(--text-1)',
  outline: 'none',
}

export default function MaintenanceForm({ initial, onSave, onDelete, saving }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState<MaintenanceCategory>(initial?.category ?? 'home')
  const [intervalDays, setIntervalDays] = useState(String(initial?.interval_days ?? ''))
  const [lastCompleted, setLastCompleted] = useState(initial?.last_completed ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const canSave = name.trim() !== '' && Number(intervalDays) >= 1

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSave) return
    onSave({
      name: name.trim(),
      category,
      interval_days: Number(intervalDays),
      last_completed: lastCompleted || null,
      notes: notes.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Name */}
      <div>
        <label style={labelStyle}># name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Replace HVAC filter"
          required
          style={inputStyle}
        />
      </div>

      {/* Category */}
      <div>
        <label style={labelStyle}># category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as MaintenanceCategory)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {Object.entries(MAINTENANCE_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key} style={{ background: 'var(--card)', color: 'var(--text-1)' }}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Interval */}
      <div>
        <label style={labelStyle}># interval (days)</label>
        <input
          type="number"
          value={intervalDays}
          onChange={e => setIntervalDays(e.target.value)}
          placeholder="90"
          min={1}
          required
          style={inputStyle}
        />
        <span style={{
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '10px',
          color: 'var(--text-3)',
          marginTop: 4,
          display: 'block',
        }}>
          e.g. 90 for every 90 days
        </span>
      </div>

      {/* Last completed */}
      <div>
        <label style={labelStyle}># last completed</label>
        <input
          type="date"
          value={lastCompleted}
          onChange={e => setLastCompleted(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        />
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        {onDelete ? (
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
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            delete
          </button>
        ) : (
          <div />
        )}
        <button
          type="submit"
          disabled={!canSave || saving}
          style={{
            background: canSave && !saving ? 'var(--accent)' : 'var(--border)',
            border: 'none',
            borderRadius: 'var(--radius)',
            color: canSave && !saving ? 'var(--crust)' : 'var(--text-3)',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '12px',
            fontWeight: 600,
            padding: '8px 20px',
            cursor: canSave && !saving ? 'pointer' : 'not-allowed',
          }}
        >
          {saving ? 'saving...' : 'save →'}
        </button>
      </div>
    </form>
  )
}
