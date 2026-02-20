'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

interface SessionContextValue {
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue>({
  profile: null,
  loading: true,
  signOut: async () => {},
})

export const useSession = () => useContext(SessionContext)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data ?? null)
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
        if (event === 'SIGNED_OUT') router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <SessionContext.Provider value={{ profile, loading, signOut }}>
      {children}
    </SessionContext.Provider>
  )
}
