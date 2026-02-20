'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/contexts/SessionContext'
import type { Activity } from '@/lib/types'

export function useActivities() {
  const { profile } = useSession()
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('activities')
      .select('*, person:profiles!person_id(*)')
      .eq('household_id', profile.household_id)
      .order('event_date', { ascending: true, nullsFirst: false })
    setItems((data ?? []) as Activity[])
    setLoading(false)
  }, [profile])

  useEffect(() => { load() }, [load])

  const add = async (item: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'person'>) => {
    if (!profile) return
    await supabase.from('activities').insert({ ...item, household_id: profile.household_id })
    load()
  }

  const update = async (id: string, item: Partial<Omit<Activity, 'person'>>) => {
    await supabase.from('activities').update(item).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from('activities').delete().eq('id', id)
    load()
  }

  const markPaid = async (id: string) => {
    await update(id, { paid: true })
  }

  return { items, loading, add, update, remove, markPaid, reload: load }
}
