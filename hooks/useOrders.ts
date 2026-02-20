'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/contexts/SessionContext'
import type { Order } from '@/lib/types'

export function useOrders() {
  const { profile } = useSession()
  const [items, setItems] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('next_delivery_date', { ascending: true, nullsFirst: false })
    setItems(data ?? [])
    setLoading(false)
  }, [profile])

  useEffect(() => { load() }, [load])

  const add = async (item: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    if (!profile) return
    await supabase.from('orders').insert({ ...item, household_id: profile.household_id, created_by: profile.id })
    load()
  }

  const update = async (id: string, item: Partial<Order>) => {
    await supabase.from('orders').update(item).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from('orders').delete().eq('id', id)
    load()
  }

  return { items, loading, add, update, remove, reload: load }
}
