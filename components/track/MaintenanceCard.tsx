'use client'
import ItemCard from '@/components/ItemCard'
import { calcNextDue, daysUntil, urgencyColor, relativeDays, formatDate } from '@/lib/utils'
import type { MaintenanceItem } from '@/lib/types'

interface Props {
  item: MaintenanceItem
  index: number
  onMarkDone: () => void
  onClick: () => void
}

export default function MaintenanceCard({ item, index, onMarkDone, onClick }: Props) {
  const nextDue = calcNextDue(item.last_completed, item.interval_days)
  const days = daysUntil(nextDue)
  const barColor = item.last_completed ? urgencyColor(days) : 'var(--red)'

  const markDoneButton = (
    <button
      onClick={e => { e.stopPropagation(); onMarkDone() }}
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
      mark done
    </button>
  )

  const intervalLabel = item.interval_days === 1
    ? 'every day'
    : item.interval_days === 7
    ? 'every week'
    : item.interval_days === 30
    ? 'every month'
    : item.interval_days === 90
    ? 'every 90 days'
    : item.interval_days === 365
    ? 'every year'
    : `every ${item.interval_days} days`

  return (
    <ItemCard
      index={index}
      barColor={barColor}
      title={item.name}
      subtitle={intervalLabel}
      meta={`last done: ${formatDate(item.last_completed)} · next: ${nextDue ? relativeDays(days) : 'never done'}`}
      actions={markDoneButton}
      onClick={onClick}
    />
  )
}
