'use client'

import { useState, useRef } from 'react'

interface Props {
  onAdd: (name: string) => void
}

export default function InventoryQuickAdd({ onAdd }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = value.trim()
      if (trimmed) {
        onAdd(trimmed)
        setValue('')
      }
    }
    if (e.key === 'Escape') {
      inputRef.current?.blur()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 12,
        borderBottom: '1px solid var(--border)',
        marginBottom: 8,
      }}
    >
      {/* Plus icon */}
      <span
        style={{
          fontSize: 14,
          color: 'var(--text-3)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        +
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="add item..."
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--font-outfit)',
          fontSize: 14,
          color: 'var(--text-1)',
          padding: 0,
        }}
      />
    </div>
  )
}
