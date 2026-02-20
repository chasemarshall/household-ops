'use client'
import ItemCard from '@/components/ItemCard'
import { daysUntil, relativeDays, formatCurrency, formatDate } from '@/lib/utils'
import type { Bill } from '@/lib/types'

interface Props {
  item: Bill
  index: number
  onMarkPaid: () => void
  onClick: () => void
}

export default function BillCard({ item, index, onMarkPaid, onClick }: Props) {
  const days = daysUntil(item.due_date)

  let barColor: string
  if (item.paid) {
    barColor = 'var(--green)'
  } else if (days !== null && days < 0) {
    barColor = 'var(--red)'
  } else if (days !== null && days <= 7) {
    barColor = 'var(--yellow)'
  } else {
    barColor = 'var(--text-3)'
  }

  const badgeColor = item.paid ? 'var(--green)' : barColor

  const badge = (
    <span style={{
      fontFamily: 'var(--font-jetbrains)',
      fontSize: '11px',
      color: badgeColor,
      whiteSpace: 'nowrap',
    }}>
      {item.paid ? 'paid' : (days !== null ? relativeDays(days) : '\u2014')}
    </span>
  )

  const actions = !item.paid ? (
    <button
      onClick={e => { e.stopPropagation(); onMarkPaid() }}
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        color: 'var(--text-2)',
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '11px',
        padding: '4px 10px',
        cursor: 'pointer',
      }}
    >
      mark paid
    </button>
  ) : undefined

  return (
    <ItemCard
      index={index}
      barColor={barColor}
      title={item.name}
      subtitle={item.amount != null ? formatCurrency(item.amount) : undefined}
      meta={`due ${formatDate(item.due_date)}${item.recurring ? ' \u00b7 recurring' : ''}${item.paid && item.paid_date ? ` \u00b7 paid ${formatDate(item.paid_date)}` : ''}`}
      rightBadge={badge}
      actions={actions}
      onClick={onClick}
    />
  )
}
