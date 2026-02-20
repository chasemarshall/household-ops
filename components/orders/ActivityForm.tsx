'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/contexts/SessionContext'
import type { Activity, Profile } from '@/lib/types'

interface Props {
  initial?: Partial<Activity>
  onSave: (data: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'person'>) => void
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

export default function ActivityForm({ initial, onSave, onDelete, saving }: Props) {
  const { profile } = useSession()
  const [members, setMembers] = useState<Profile[]>([])

  const [name, setName] = useState(initial?.name ?? '')
  const [personId, setPersonId] = useState(initial?.person_id ?? '')
  const [eventDescription, setEventDescription] = useState(initial?.event_description ?? '')
  const [eventDate, setEventDate] = useState(initial?.event_date ?? '')
  const [amountDue, setAmountDue] = useState(initial?.amount_due != null ? String(initial.amount_due) : '')
  const [paid, setPaid] = useState(initial?.paid ?? false)
  const [notes, setNotes] = useState(initial?.notes ?? '')

  useEffect(() => {
    if (!profile) return
    supabase
      .from('profiles')
      .select('*')
      .eq('household_id', profile.household_id)
      .then(({ data }) => setMembers(data ?? []))
  }, [profile])

  const canSubmit = name.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSave({
      name: name.trim(),
      person_id: personId || null,
      event_description: eventDescription.trim() || null,
      event_date: eventDate || null,
      amount_due: amountDue !== '' ? parseFloat(amountDue) : null,
      paid: amountDue !== '' ? paid : false,
      notes: notes.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Activity name */}
      <div>
        <label style={labelStyle}># activity name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Soccer practice"
          required
          style={inputStyle}
        />
      </div>

      {/* Person */}
      <div>
        <label style={labelStyle}># person</label>
        <select
          value={personId}
          onChange={e => setPersonId(e.target.value)}
          style={{ ...inputStyle, appearance: 'auto' }}
        >
          <option value="">select...</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.display_name}</option>
          ))}
        </select>
      </div>

      {/* Event description */}
      <div>
        <label style={labelStyle}># event description</label>
        <input
          type="text"
          value={eventDescription}
          onChange={e => setEventDescription(e.target.value)}
          placeholder="optional"
          style={inputStyle}
        />
      </div>

      {/* Event date */}
      <div>
        <label style={labelStyle}># event date</label>
        <input
          type="date"
          value={eventDate}
          onChange={e => setEventDate(e.target.value)}
          style={{ ...inputStyle, colorScheme: 'dark' }}
        />
      </div>

      {/* Amount due */}
      <div>
        <label style={labelStyle}># amount due ($)</label>
        <input
          type="number"
          value={amountDue}
          onChange={e => setAmountDue(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          style={inputStyle}
        />
      </div>

      {/* Paid checkbox (only if amount_due is set) */}
      {amountDue !== '' && (
        <label style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={paid}
            onChange={e => setPaid(e.target.checked)}
            style={{ marginTop: 2, accentColor: 'var(--accent)' }}
          />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-3)',
          }}>
            # paid
          </span>
        </label>
      )}

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
