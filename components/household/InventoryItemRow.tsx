'use client'

import type { InventoryItem } from '@/lib/types'
import { INVENTORY_CATEGORY_LABELS } from '@/lib/constants'

interface Props {
  item: InventoryItem
  index: number
  onToggle: () => void
  onDelete: () => void
  onEdit: () => void
}

export default function InventoryItemRow({ item, index, onToggle, onDelete, onEdit }: Props) {
  const checked = item.checked

  return (
    <div
      className={`animate-fade-slide-up item-${Math.min(index, 7)}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 0',
        borderBottom: '1px solid var(--border)',
        opacity: checked ? 0.5 : 1,
        transition: 'opacity 150ms ease',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={checked ? 'Uncheck item' : 'Check item'}
        style={{
          width: 18,
          height: 18,
          minWidth: 18,
          border: `1px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 3,
          background: checked ? 'var(--accent)' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 150ms ease',
          padding: 0,
        }}
      >
        {checked && (
          <span
            style={{
              color: 'var(--bg)',
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            &#x2713;
          </span>
        )}
      </button>

      {/* Name + category */}
      <button
        onClick={onEdit}
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          padding: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: 14,
            color: checked ? 'var(--text-3)' : 'var(--text-1)',
            textDecoration: checked ? 'line-through' : 'none',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 10,
            color: 'var(--text-3)',
            lineHeight: 1,
          }}
        >
          {INVENTORY_CATEGORY_LABELS[item.category] ?? item.category}
          {item.always_needed && ' \u00b7 always'}
        </span>
      </button>

      {/* Quantity */}
      {item.quantity && (
        <span
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 11,
            color: 'var(--text-3)',
            whiteSpace: 'nowrap',
          }}
        >
          {item.quantity}
        </span>
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        aria-label="Delete item"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-3)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 1,
          padding: '4px',
          transition: 'color 150ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
      >
        &#x2715;
      </button>
    </div>
  )
}
