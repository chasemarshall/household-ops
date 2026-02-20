'use client'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import type { Document, DocumentType } from '@/lib/types'
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants'

interface Props {
  initial?: Partial<Document>
  onSave: (data: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => void
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

export default function DocumentForm({ initial, onSave, onDelete, saving }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<DocumentType>(initial?.type ?? 'other')
  const [associatedItem, setAssociatedItem] = useState(initial?.associated_item ?? '')
  const [expiryDate, setExpiryDate] = useState(initial?.expiry_date ?? '')
  const [link, setLink] = useState(initial?.link ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: name.trim(),
      type,
      associated_item: associatedItem.trim() || null,
      expiry_date: expiryDate || null,
      link: link.trim() || null,
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
          placeholder="e.g. Washer Warranty"
          style={inputStyle}
        />
      </div>

      {/* Type */}
      <div>
        <div style={labelStyle}># type</div>
        <select
          value={type}
          onChange={e => setType(e.target.value as DocumentType)}
          style={selectStyle}
        >
          {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Associated Item */}
      <div>
        <div style={labelStyle}># associated item</div>
        <input
          type="text"
          value={associatedItem}
          onChange={e => setAssociatedItem(e.target.value)}
          placeholder="e.g. Samsung Washer"
          style={inputStyle}
        />
      </div>

      {/* Expiry Date */}
      <div>
        <div style={labelStyle}># expiry date</div>
        <input
          type="date"
          value={expiryDate}
          onChange={e => setExpiryDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Link */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={labelStyle}># link</div>
          {initial && link.trim() && (
            <a
              href={link.trim()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'var(--font-jetbrains)',
                fontSize: '11px',
                color: 'var(--accent)',
                textDecoration: 'none',
                marginBottom: 2,
              }}
            >
              open link <ExternalLink size={10} />
            </a>
          )}
        </div>
        <input
          type="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="https://drive.google.com/..."
          style={inputStyle}
        />
      </div>

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
