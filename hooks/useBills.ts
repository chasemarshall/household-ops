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
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('household_id', profile.household_id)
      .order('due_date', { ascending: true })
    if (error) console.error('useBills load error:', error)
    setItems(data ?? [])
    setLoading(false)
  }, [profile])

  useEffect(() => { load() }, [load])

  const add = async (item: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    if (!profile) return
    const { error } = await supabase.from('bills').insert({
      ...item,
      household_id: profile.household_id,
      created_by: profile.id,
    })
    if (error) console.error('useBills add error:', error)
    load()
  }

  const update = async (id: string, item: Partial<Bill>) => {
    const { error } = await supabase.from('bills').update(item).eq('id', id)
    if (error) console.error('useBills update error:', error)
    load()
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('bills').delete().eq('id', id)
    if (error) console.error('useBills remove error:', error)
    load()
  }

  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null)

  const markPaid = async (bill: Bill) => {
    if (!profile) return
    if (markingPaidId) return
    setMarkingPaidId(bill.id)
    try {
      const today = new Date().toISOString().split('T')[0]
      const { error: updateError } = await supabase.from('bills').update({ paid: true, paid_date: today }).eq('id', bill.id)
      if (updateError) console.error('markPaid error:', updateError)

      // Auto-create next month's bill for recurring bills
      if (bill.recurring) {
        const [year, month, day] = bill.due_date.split('-').map(Number)
        const targetMonth = month === 12 ? 1 : month + 1
        const targetYear = month === 12 ? year + 1 : year
        // Get last day of target month
        const lastDay = new Date(targetYear, targetMonth, 0).getDate()
        const clampedDay = Math.min(day, lastDay)
        const nextDue = new Date(targetYear, targetMonth - 1, clampedDay)
        const { error: insertError } = await supabase.from('bills').insert({
          household_id: bill.household_id,
          created_by: profile.id,
          name: bill.name,
          amount: bill.amount,
          due_date: nextDue.toISOString().split('T')[0],
          paid: false,
          recurring: true,
          notes: bill.notes,
        })
        if (insertError) console.error('markPaid error:', insertError)
      }
      load()
    } finally {
      setMarkingPaidId(null)
    }
  }

  return { items, loading, add, update, remove, markPaid, markingPaidId, reload: load }
}
