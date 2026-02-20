'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import MemberList from '@/components/settings/MemberList'
import InviteModal from '@/components/settings/InviteModal'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import { TICKET_URL } from '@/lib/constants'
import type { Profile } from '@/lib/types'

const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains)',
  fontSize: 11,
  color: 'var(--text-3)',
  margin: '0 0 8px 0',
  fontWeight: 400,
  letterSpacing: '0.02em',
}

export default function SettingsPage() {
  const { profile, signOut } = useSession()
  const { showToast } = useToast()
  const [members, setMembers] = useState<Profile[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  const isAdmin = profile?.role === 'admin'

  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.display_name)

    // Load members
    supabase
      .from('profiles')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMembers(data)
      })

    // Load email
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [profile])

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editingName])

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'member') => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      showToast('failed to update role', 'error')
      return
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
    )
    showToast('role updated')
  }

  const handleNameSave = async () => {
    setEditingName(false)
    const trimmed = displayName.trim()
    if (!trimmed || !profile || trimmed === profile.display_name) {
      setDisplayName(profile?.display_name ?? '')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: trimmed })
      .eq('id', profile.id)

    if (error) {
      showToast('failed to update name', 'error')
      setDisplayName(profile.display_name)
    } else {
      showToast('name updated')
    }
  }

  if (!profile) return null

  return (
    <>
      <Header title="settings" />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Section 1: household members */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={sectionLabel}># household members</p>
            {isAdmin && (
              <button
                onClick={() => setShowInvite(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 12,
                  color: 'var(--accent)',
                  padding: 0,
                }}
              >
                invite member +
              </button>
            )}
          </div>
          <MemberList
            members={members}
            currentUserId={profile.id}
            isAdmin={isAdmin}
            onRoleChange={handleRoleChange}
          />
        </section>

        {/* Section 2: ticket system */}
        <section>
          <p style={sectionLabel}># ticket system</p>
          <a
            href={TICKET_URL}
            target="_blank"
            rel="noopener"
            style={{
              display: 'block',
              background: 'var(--card)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              textDecoration: 'none',
              marginTop: 8,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 13,
                color: 'var(--accent)',
                marginBottom: 4,
                margin: '0 0 4px 0',
              }}
            >
              need help? submit a ticket &rarr;
            </p>
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: 12,
                color: 'var(--text-3)',
                margin: 0,
              }}
            >
              chase can help with household issues via kin
            </p>
          </a>
        </section>

        {/* Section 3: account */}
        <section>
          <p style={sectionLabel}># account</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              {editingName ? (
                <input
                  ref={nameInputRef}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave()
                    if (e.key === 'Escape') {
                      setDisplayName(profile.display_name)
                      setEditingName(false)
                    }
                  }}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-1)',
                    fontFamily: 'var(--font-outfit)',
                    fontSize: 14,
                    padding: '6px 10px',
                    outline: 'none',
                    width: '100%',
                    maxWidth: 240,
                  }}
                />
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-outfit)',
                    fontSize: 14,
                    color: 'var(--text-1)',
                    padding: 0,
                    textAlign: 'left',
                  }}
                  title="click to edit"
                >
                  {displayName}
                </button>
              )}
              <p
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 11,
                  color: 'var(--text-3)',
                  margin: '4px 0 0 0',
                }}
              >
                {email}
              </p>
            </div>

            <button
              onClick={signOut}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 12,
                color: 'var(--red)',
                padding: 0,
                textAlign: 'left',
                width: 'fit-content',
              }}
            >
              sign out
            </button>
          </div>
        </section>
      </div>

      {showInvite && (
        <InviteModal
          householdId={profile.household_id}
          onClose={() => setShowInvite(false)}
        />
      )}
    </>
  )
}
