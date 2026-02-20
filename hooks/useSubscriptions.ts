'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/contexts/SessionContext'
import type { Subscription } from '@/lib/types'

export function useSubscriptions() {
  const { profile } = useSession()
  const [items, setItems] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('next_renewal_date', { ascending: true, nullsFirst: false })
    setItems(data ?? [])
    setLoading(false)
  }, [profile])

  useEffect(() => { load() }, [load])

  const add = async (item: Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    if (!profile) return
    await supabase.from('subscriptions').insert({
      ...item,
      household_id: profile.household_id,
      created_by: profile.id,
    })
    load()
  }

  const update = async (id: string, item: Partial<Subscription>) => {
    await supabase.from('subscriptions').update(item).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from('subscriptions').delete().eq('id', id)
    load()
  }

  return { items, loading, add, update, remove, reload: load }
}
