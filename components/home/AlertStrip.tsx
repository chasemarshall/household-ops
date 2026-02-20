'use client'

import { useState } from 'react'
import { relativeDays } from '@/lib/utils'

export interface AlertItem {
  id: string
  name: string
  type: string
  date: string | null
  days: number | null
}

interface AlertStripProps {
  label: string
  color: string
  items: AlertItem[]
  defaultOpen?: boolean
}

function urgencyTextColor(days: number | null): string {
  if (days === null) return 'var(--text-3)'
  if (days < 0) return 'var(--red)'
  if (days <= 3) return 'var(--yellow)'
  return 'var(--green)'
}

export default function AlertStrip({ label, color, items, defaultOpen = false }: AlertStripProps) {
  const [open, setOpen] = useState(defaultOpen)

  if (items.length === 0) return null

  return (
    <div style={{ padding: '0 24px', marginBottom: '8px' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '10px 0',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Colored dot */}
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: color,
            flexShrink: 0,
          }}
        />
        {/* Label */}
        <span
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '12px',
            color: 'var(--text-2)',
            lineHeight: 1,
          }}
        >
          {label}
        </span>
        {/* Count chip */}
        <span
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '10px',
            fontWeight: 700,
            color,
            background: 'var(--card)',
            borderRadius: '8px',
            padding: '2px 7px',
            lineHeight: 1.3,
          }}
        >
          {items.length}
        </span>
        {/* Spacer */}
        <span style={{ flex: 1 }} />
        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-3)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Items list */}
      {open && (
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {/* Left: name + type */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: '13px',
                    color: 'var(--text-1)',
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: '10px',
                    color: 'var(--text-3)',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {item.type}
                </span>
              </div>
              {/* Right: relative days */}
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '11px',
                  color: urgencyTextColor(item.days),
                  lineHeight: 1,
                  flexShrink: 0,
                  marginLeft: '12px',
                }}
              >
                {relativeDays(item.days)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
