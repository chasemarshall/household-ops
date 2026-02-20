'use client'

import { useSession } from '@/contexts/SessionContext'
import { initials } from '@/lib/utils'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const { profile } = useSession()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: 'calc(14px + env(safe-area-inset-top, 0px)) 24px 14px',
        flexShrink: 0,
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-1)',
          lineHeight: 1,
          margin: 0,
        }}
      >
        {title}
      </h2>

      {profile && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: profile.avatar_color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--bg)',
              lineHeight: 1,
            }}
          >
            {initials(profile.display_name)}
          </span>
        </div>
      )}
    </header>
  )
}
