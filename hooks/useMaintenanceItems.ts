'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/contexts/SessionContext'
import type { MaintenanceItem } from '@/lib/types'

export function useMaintenanceItems() {
  const { profile } = useSession()
  const [items, setItems] = useState<MaintenanceItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('maintenance_items')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('last_completed', { ascending: true, nullsFirst: true })
    setItems(data ?? [])
    setLoading(false)
  }, [profile])

  useEffect(() => { load() }, [load])

  const add = async (item: Omit<MaintenanceItem, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    if (!profile) return
    await supabase.from('maintenance_items').insert({
      ...item,
      household_id: profile.household_id,
      created_by: profile.id,
    })
    load()
  }

  const update = async (id: string, item: Partial<MaintenanceItem>) => {
    await supabase.from('maintenance_items').update(item).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from('maintenance_items').delete().eq('id', id)
    load()
  }

  const markDone = async (id: string) => {
    const today = new Date().toISOString().split('T')[0]
    await update(id, { last_completed: today })
  }

  return { items, loading, add, update, remove, markDone, reload: load }
}
