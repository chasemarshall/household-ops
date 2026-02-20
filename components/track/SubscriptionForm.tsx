'use client'
import { useState } from 'react'
import type { Subscription, SubscriptionCategory, BillingCycle } from '@/lib/types'
import { BILLING_CYCLE_LABELS, SUBSCRIPTION_CATEGORY_LABELS } from '@/lib/constants'

interface Props {
  initial?: Partial<Subscription>
  onSave: (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => void
  onDelete?: () => void
  saving?: boolean
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains)',
  fontSize: '11px',
  color: 'var(--text-3)',
  marginBottom: 2,
}

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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

export default function SubscriptionForm({ initial, onSave, onDelete, saving }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState<SubscriptionCategory>(initial?.category ?? 'other')
  const [cost, setCost] = useState(initial?.cost?.toString() ?? '')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initial?.billing_cycle ?? 'monthly')
  const [nextRenewalDate, setNextRenewalDate] = useState(initial?.next_renewal_date ?? '')
  const [autoRenews, setAutoRenews] = useState(initial?.auto_renews ?? false)
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: name.trim(),
      category,
      cost: cost ? parseFloat(cost) : null,
      billing_cycle: billingCycle,
      next_renewal_date: nextRenewalDate || null,
      auto_renews: autoRenews,
      notes: notes.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Name */}
      <div>
        <div style={labelStyle}># name</div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="e.g. Netflix"
          style={inputStyle}
        />
      </div>

      {/* Category */}
      <div>
        <div style={labelStyle}># category</div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as SubscriptionCategory)}
          style={selectStyle}
        >
          {Object.entries(SUBSCRIPTION_CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Cost + Billing Cycle (two-column) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <div style={labelStyle}># cost ($)</div>
          <input
            type="number"
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            style={inputStyle}
          />
        </div>
        <div>
          <div style={labelStyle}># billing cycle</div>
          <select
            value={billingCycle}
            onChange={e => setBillingCycle(e.target.value as BillingCycle)}
            style={selectStyle}
          >
            {Object.entries(BILLING_CYCLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Next Renewal Date */}
      <div>
        <div style={labelStyle}># next renewal date</div>
        <input
          type="date"
          value={nextRenewalDate}
          onChange={e => setNextRenewalDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Auto-renews */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
      }}>
        <input
          type="checkbox"
          checked={autoRenews}
          onChange={e => setAutoRenews(e.target.checked)}
          style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
        />
        <span style={labelStyle}># auto-renews</span>
      </label>

      {/* Notes */}
      <div>
        <div style={labelStyle}># notes</div>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="optional"
          style={inputStyle}
        />
      </div>

      {/* Bottom row: delete + save */}
      <div style={{
        display: 'flex',
        justifyContent: onDelete ? 'space-between' : 'flex-end',
        alignItems: 'center',
        marginTop: 4,
      }}>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--red)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '13px',
              cursor: 'pointer',
              padding: '8px 0',
            }}
          >
            delete
          </button>
        )}
        <button
          type="submit"
          disabled={!name.trim() || saving}
          style={{
            background: 'var(--accent)',
            border: 'none',
            color: 'var(--card)',
            fontFamily: 'var(--font-outfit)',
            fontSize: '14px',
            fontWeight: 500,
            padding: '10px 20px',
            borderRadius: 'var(--radius)',
            cursor: !name.trim() || saving ? 'not-allowed' : 'pointer',
            opacity: !name.trim() || saving ? 0.5 : 1,
          }}
        >
          {saving ? 'saving...' : 'save \u2192'}
        </button>
      </div>
    </form>
  )
}
