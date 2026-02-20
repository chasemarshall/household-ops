'use client'

import Header from '@/components/Header'
import StatCard from '@/components/home/StatCard'
import AlertStrip from '@/components/home/AlertStrip'
import type { AlertItem } from '@/components/home/AlertStrip'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { useMaintenanceItems } from '@/hooks/useMaintenanceItems'
import { useBills } from '@/hooks/useBills'
import { useOrders } from '@/hooks/useOrders'
import { useActivities } from '@/hooks/useActivities'
import { daysUntil, calcNextDue } from '@/lib/utils'
import { useSession } from '@/contexts/SessionContext'
import { useMemo } from 'react'

export default function HomePage() {
  const { profile } = useSession()
  const { items: subscriptions, loading: subLoading } = useSubscriptions()
  const { items: maintenance, loading: maintLoading } = useMaintenanceItems()
  const { items: bills, loading: billLoading } = useBills()
  const { items: orders, loading: orderLoading } = useOrders()
  const { items: activities, loading: actLoading } = useActivities()

  const isLoading = subLoading || maintLoading || billLoading || orderLoading || actLoading

  const firstName = profile?.display_name?.split(' ')[0]?.toLowerCase() ?? ''

  const { overdue, dueThisWeek, completedRecently, stats } = useMemo(() => {
    const overdueItems: AlertItem[] = []
    const weekItems: AlertItem[] = []
    const recentItems: AlertItem[] = []

    // Subscriptions
    for (const s of subscriptions) {
      const days = daysUntil(s.next_renewal_date)
      const item: AlertItem = { id: s.id, name: s.name, type: 'subscription', date: s.next_renewal_date, days }
      if (days !== null && days < 0) overdueItems.push(item)
      else if (days !== null && days >= 0 && days <= 7) weekItems.push(item)
    }

    // Maintenance
    let maintOverdueCount = 0
    for (const m of maintenance) {
      const nextDue = calcNextDue(m.last_completed, m.interval_days)
      const days = daysUntil(nextDue)
      const item: AlertItem = { id: m.id, name: m.name, type: 'maintenance', date: nextDue, days }
      if (days !== null && days < 0) {
        overdueItems.push(item)
        maintOverdueCount++
      } else if (days !== null && days >= 0 && days <= 7) {
        weekItems.push(item)
      }
    }

    // Bills
    let unpaidCount = 0
    for (const b of bills) {
      if (!b.paid) {
        unpaidCount++
        const days = daysUntil(b.due_date)
        const item: AlertItem = { id: b.id, name: b.name, type: 'bill', date: b.due_date, days }
        if (days !== null && days < 0) overdueItems.push(item)
        else if (days !== null && days >= 0 && days <= 7) weekItems.push(item)
      }
      // Recently paid (last 7 days)
      if (b.paid && b.paid_date) {
        const paidDays = daysUntil(b.paid_date)
        if (paidDays !== null && paidDays >= -7 && paidDays <= 0) {
          recentItems.push({ id: b.id, name: b.name, type: 'bill', date: b.paid_date, days: paidDays })
        }
      }
    }

    // Activities
    for (const a of activities) {
      if (a.event_date) {
        const days = daysUntil(a.event_date)
        const isUnpaid = a.amount_due !== null && !a.paid
        const item: AlertItem = { id: a.id, name: a.name, type: 'activity', date: a.event_date, days }
        if (days !== null && days < 0 && (a.amount_due === null || isUnpaid)) overdueItems.push(item)
        else if (days !== null && days >= 0 && days <= 7) weekItems.push(item)
      }
    }

    // Orders due this week
    let deliveryCount = 0
    for (const o of orders) {
      const days = daysUntil(o.next_delivery_date)
      if (days !== null && days >= 0 && days <= 7) deliveryCount++
    }

    return {
      overdue: overdueItems,
      dueThisWeek: weekItems,
      completedRecently: recentItems,
      stats: {
        subscriptions: subscriptions.length,
        maintOverdue: maintOverdueCount,
        billsUnpaid: unpaidCount,
        deliveries: deliveryCount,
      },
    }
  }, [subscriptions, maintenance, bills, orders, activities])

  return (
    <>
      <Header title="household ops" />

      {/* Greeting */}
      <div
        style={{
          padding: '24px',
          fontFamily: 'var(--font-outfit)',
          fontSize: '36px',
          fontWeight: 400,
          color: 'var(--text-1)',
          lineHeight: 1.1,
        }}
      >
        hey, {firstName}.
      </div>

      {/* Stat grid */}
      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '0 24px 16px',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--card)',
                borderRadius: 'var(--radius)',
                padding: '14px',
                height: '68px',
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '0 24px 16px',
          }}
        >
          <StatCard label="subscriptions" value={stats.subscriptions} />
          <StatCard label="maintenance overdue" value={stats.maintOverdue} color={stats.maintOverdue > 0 ? 'var(--red)' : 'var(--text-1)'} />
          <StatCard label="bills unpaid" value={stats.billsUnpaid} color={stats.billsUnpaid > 0 ? 'var(--yellow)' : 'var(--text-1)'} />
          <StatCard label="deliveries" value={stats.deliveries} />
        </div>
      )}

      {/* Alert strips */}
      {!isLoading && (
        <>
          {overdue.length > 0 && (
            <AlertStrip
              label={`${overdue.length} overdue`}
              color="var(--red)"
              items={overdue}
              defaultOpen={true}
            />
          )}
          {dueThisWeek.length > 0 && (
            <AlertStrip
              label="due this week"
              color="var(--yellow)"
              items={dueThisWeek}
              defaultOpen={true}
            />
          )}
          {completedRecently.length > 0 && (
            <AlertStrip
              label="completed recently"
              color="var(--green)"
              items={completedRecently}
              defaultOpen={false}
            />
          )}
        </>
      )}
    </>
  )
}
