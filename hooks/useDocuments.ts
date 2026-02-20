'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/contexts/SessionContext'
import type { Document } from '@/lib/types'

export function useDocuments() {
  const { profile } = useSession()
  const [items, setItems] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('expiry_date', { ascending: true, nullsFirst: false })
    setItems(data ?? [])
    setLoading(false)
  }, [profile])

  useEffect(() => { load() }, [load])

  const add = async (item: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    if (!profile) return
    await supabase.from('documents').insert({ ...item, household_id: profile.household_id, created_by: profile.id })
    load()
  }

  const update = async (id: string, item: Partial<Document>) => {
    await supabase.from('documents').update(item).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from('documents').delete().eq('id', id)
    load()
  }

  return { items, loading, add, update, remove, reload: load }
}
