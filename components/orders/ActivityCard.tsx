'use client'
import ItemCard from '@/components/ItemCard'
import { daysUntil, relativeDays, formatDate, formatCurrency, initials } from '@/lib/utils'
import type { Activity } from '@/lib/types'

interface Props { item: Activity; index: number; onMarkPaid?: () => void; onClick: () => void }

export default function ActivityCard({ item, index, onMarkPaid, onClick }: Props) {
  const days = daysUntil(item.event_date)

  let barColor: string
  if (days === null) barColor = 'var(--text-3)'
  else if (days < 0) barColor = 'var(--red)'
  else if (days <= 7) barColor = 'var(--yellow)'
  else barColor = 'var(--blue)'

  const personBadge = item.person ? (
    <div style={{
      width: '22px', height: '22px', borderRadius: '50%',
      background: item.person.avatar_color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-jetbrains)', fontSize: '9px', fontWeight: 700,
      color: 'var(--bg)', flexShrink: 0,
    }}>
      {initials(item.person.display_name)}
    </div>
  ) : null

  const paidBadge = item.amount_due != null ? (
    <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', color: item.paid ? 'var(--green)' : 'var(--yellow)', whiteSpace: 'nowrap' }}>
      {item.paid ? 'paid' : formatCurrency(item.amount_due)}
    </span>
  ) : null

  const rightBadge = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {paidBadge}
      {personBadge}
    </div>
  )

  const actions = item.amount_due != null && !item.paid && onMarkPaid ? (
    <button onClick={e => { e.stopPropagation(); onMarkPaid() }} style={{
      background: 'none', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', color: 'var(--text-2)',
      fontFamily: 'var(--font-jetbrains)', fontSize: '11px',
      padding: '4px 10px', cursor: 'pointer',
    }}>
      mark paid
    </button>
  ) : undefined

  return (
    <ItemCard
      index={index}
      barColor={barColor}
      title={item.name}
      subtitle={item.event_description ?? undefined}
      meta={item.event_date ? `${formatDate(item.event_date)} \u00b7 ${relativeDays(days)}` : undefined}
      rightBadge={rightBadge}
      actions={actions}
      onClick={onClick}
    />
  )
}
