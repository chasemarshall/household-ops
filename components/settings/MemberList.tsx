'use client'

import { initials } from '@/lib/utils'
import type { Profile } from '@/lib/types'

interface Props {
  members: Profile[]
  currentUserId: string
  isAdmin: boolean
  onRoleChange: (userId: string, newRole: 'admin' | 'member') => void
}

export default function MemberList({ members, currentUserId, isAdmin, onRoleChange }: Props) {
  return (
    <div>
      {members.map((member) => {
        const isYou = member.id === currentUserId
        const toggleRole = member.role === 'admin' ? 'member' : 'admin'
        return (
          <div
            key={member.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: member.avatar_color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--bg)',
                  lineHeight: 1,
                }}
              >
                {initials(member.display_name)}
              </span>
            </div>

            {/* Name + you indicator */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-outfit)',
                  fontSize: 14,
                  color: 'var(--text-1)',
                }}
              >
                {member.display_name}
              </span>
              {isYou && (
                <span
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    fontSize: 11,
                    color: 'var(--text-3)',
                    fontStyle: 'italic',
                    marginLeft: 6,
                  }}
                >
                  you
                </span>
              )}
            </div>

            {/* Role badge */}
            <span
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 10,
                color: member.role === 'admin' ? 'var(--accent)' : 'var(--text-3)',
                flexShrink: 0,
              }}
            >
              {member.role}
            </span>

            {/* Role toggle (admin only, not self) */}
            {isAdmin && !isYou && (
              <button
                onClick={() => onRoleChange(member.id, toggleRole)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 11,
                  color: 'var(--text-3)',
                  padding: '2px 6px',
                  flexShrink: 0,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
              >
                &rarr; {toggleRole}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
