'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import type { InventoryItem, InventoryCategory } from '@/lib/types'
import { INVENTORY_CATEGORY_LABELS } from '@/lib/constants'

interface Props {
  item: InventoryItem
  onSave: (updates: Partial<InventoryItem>) => void
  onDelete: () => void
  onClose: () => void
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

export default function InventoryEditModal({ item, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(item.name)
  const [quantity, setQuantity] = useState(item.quantity ?? '')
  const [category, setCategory] = useState<InventoryCategory>(item.category)
  const [alwaysNeeded, setAlwaysNeeded] = useState(item.always_needed)
  const [notes, setNotes] = useState(item.notes ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: name.trim(),
      quantity: quantity.trim() || null,
      category,
      always_needed: alwaysNeeded,
      notes: notes.trim() || null,
    })
  }

  return (
    <Modal title="edit item" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Name */}
        <div>
          <div style={labelStyle}># name</div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="item name"
            style={inputStyle}
          />
        </div>

        {/* Quantity */}
        <div>
          <div style={labelStyle}># quantity</div>
          <input
            type="text"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            placeholder="e.g. 2 bags, 1 gallon"
            style={inputStyle}
          />
        </div>

        {/* Category */}
        <div>
          <div style={labelStyle}># category</div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as InventoryCategory)}
            style={selectStyle}
          >
            {Object.entries(INVENTORY_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Always needed */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={alwaysNeeded}
            onChange={e => setAlwaysNeeded(e.target.checked)}
            style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
          />
          <span style={labelStyle}># always needed</span>
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
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4,
        }}>
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
          <button
            type="submit"
            disabled={!name.trim()}
            style={{
              background: 'var(--accent)',
              border: 'none',
              color: 'var(--card)',
              fontFamily: 'var(--font-outfit)',
              fontSize: '14px',
              fontWeight: 500,
              padding: '10px 20px',
              borderRadius: 'var(--radius)',
              cursor: !name.trim() ? 'not-allowed' : 'pointer',
              opacity: !name.trim() ? 0.5 : 1,
            }}
          >
            save &rarr;
          </button>
        </div>
      </form>
    </Modal>
  )
}
