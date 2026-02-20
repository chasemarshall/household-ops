'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/contexts/SessionContext'
import type { InventoryItem } from '@/lib/types'

export function useInventory() {
  const { profile } = useSession()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('checked', { ascending: true })
      .order('category', { ascending: true })
      .order('created_at', { ascending: true })
    setItems(data ?? [])
    setLoading(false)
  }, [profile])

  useEffect(() => { load() }, [load])

  const add = async (name: string, category: InventoryItem['category'] = 'grocery') => {
    if (!profile) return
    await supabase.from('inventory_items').insert({
      name,
      category,
      household_id: profile.household_id,
      created_by: profile.id,
      always_needed: false,
      checked: false,
    })
    load()
  }

  const update = async (id: string, item: Partial<InventoryItem>) => {
    await supabase.from('inventory_items').update(item).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from('inventory_items').delete().eq('id', id)
    load()
  }

  const toggleChecked = async (id: string, checked: boolean) => {
    await supabase.from('inventory_items').update({ checked }).eq('id', id)
    load()
  }

  const clearChecked = async () => {
    if (!profile) return
    // Always-needed items get unchecked instead of deleted
    const checkedAlwaysNeeded = items.filter(i => i.checked && i.always_needed)
    const checkedNormal = items.filter(i => i.checked && !i.always_needed)

    if (checkedAlwaysNeeded.length > 0) {
      await supabase
        .from('inventory_items')
        .update({ checked: false })
        .in('id', checkedAlwaysNeeded.map(i => i.id))
    }
    if (checkedNormal.length > 0) {
      await supabase
        .from('inventory_items')
        .delete()
        .in('id', checkedNormal.map(i => i.id))
    }
    load()
  }

  return { items, loading, add, update, remove, toggleChecked, clearChecked, reload: load }
}
