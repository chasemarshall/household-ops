'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/contexts/SessionContext'
import type { Bill } from '@/lib/types'

export function useBills() {
  const { profile } = useSession()
  const [items, setItems] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('bills')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('due_date', { ascending: true })
    setItems(data ?? [])
    setLoading(false)
  }, [profile])

  useEffect(() => { load() }, [load])

  const add = async (item: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    if (!profile) return
    await supabase.from('bills').insert({
      ...item,
      household_id: profile.household_id,
      created_by: profile.id,
    })
    load()
  }

  const update = async (id: string, item: Partial<Bill>) => {
    await supabase.from('bills').update(item).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from('bills').delete().eq('id', id)
    load()
  }

  const markPaid = async (bill: Bill) => {
    if (!profile) return
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('bills').update({ paid: true, paid_date: today }).eq('id', bill.id)

    // Auto-create next month's bill for recurring bills
    if (bill.recurring) {
      const nextDue = new Date(bill.due_date)
      nextDue.setMonth(nextDue.getMonth() + 1)
      await supabase.from('bills').insert({
        household_id: bill.household_id,
        created_by: profile.id,
        name: bill.name,
        amount: bill.amount,
        due_date: nextDue.toISOString().split('T')[0],
        paid: false,
        recurring: true,
        notes: bill.notes,
      })
    }
    load()
  }

  return { items, loading, add, update, remove, markPaid, reload: load }
}
