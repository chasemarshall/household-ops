'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import BottomNav from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !profile) router.push('/')
  }, [loading, profile, router])

  if (loading) return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{
        color: 'var(--text-3)',
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '13px',
      }}>
        loading...
      </span>
    </div>
  )

  if (!profile) return null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <main style={{
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
        maxWidth: '640px',
        margin: '0 auto',
      }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
