'use client'

import { useState } from 'react'

interface ItemCardProps {
  barColor: string
  title: string
  subtitle?: string
  meta?: string
  rightBadge?: React.ReactNode
  actions?: React.ReactNode
  onClick?: () => void
  index?: number
}

export default function ItemCard({
  barColor,
  title,
  subtitle,
  meta,
  rightBadge,
  actions,
  onClick,
  index,
}: ItemCardProps) {
  const [hovered, setHovered] = useState(false)

  const staggerClass =
    index !== undefined && index >= 0 && index <= 7 ? `item-${index}` : ''

  return (
    <div
      onClick={onClick}
      onMouseEnter={onClick ? () => setHovered(true) : undefined}
      onMouseLeave={onClick ? () => setHovered(false) : undefined}
      className={`animate-fade-slide-up ${staggerClass}`}
      style={{
        background:
          hovered && onClick ? 'var(--card-hover)' : 'var(--card)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : undefined,
        opacity: 0,
      }}
    >
      {/* Left status bar */}
      <div
        style={{
          width: 3,
          background: barColor,
          flexShrink: 0,
        }}
      />

      {/* Content area */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '12px 14px',
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text-1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}
          >
            {title}
          </span>
          {rightBadge && (
            <div style={{ flexShrink: 0 }}>{rightBadge}</div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <span
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: 13,
              fontWeight: 400,
              color: 'var(--text-2)',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </span>
        )}

        {/* Meta */}
        {meta && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 400,
              color: 'var(--text-3)',
              lineHeight: 1.3,
            }}
          >
            {meta}
          </span>
        )}

        {/* Actions */}
        {actions && <div style={{ marginTop: 4 }}>{actions}</div>}
      </div>
    </div>
  )
}
