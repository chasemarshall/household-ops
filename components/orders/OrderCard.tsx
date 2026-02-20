'use client'
import ItemCard from '@/components/ItemCard'
import { daysUntil, urgencyColor, relativeDays, formatDate } from '@/lib/utils'
import type { Order } from '@/lib/types'

interface Props { item: Order; index: number; onClick: () => void }

export default function OrderCard({ item, index, onClick }: Props) {
  const days = daysUntil(item.next_delivery_date)

  let barColor: string
  switch (item.status) {
    case 'delivered': barColor = 'var(--green)'; break
    case 'ordered':
    case 'shipped':   barColor = 'var(--blue)'; break
    case 'recurring': barColor = 'var(--text-3)'; break
    default:          barColor = item.next_delivery_date ? urgencyColor(days, 7) : 'var(--text-3)'
  }

  const badge = (
    <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
      {item.type === 'recurring' ? 'recurring' : 'one-time'}
    </span>
  )

  const statusLabel = item.status === 'delivered' ? 'delivered'
    : item.status === 'shipped' ? 'shipped'
    : item.status === 'ordered' ? 'ordered'
    : item.next_delivery_date ? `next: ${relativeDays(days)}` : '\u2014'

  return (
    <ItemCard
      index={index}
      barColor={barColor}
      title={item.name}
      subtitle={item.notes ?? undefined}
      meta={`${statusLabel} \u00b7 ${formatDate(item.next_delivery_date)}${item.frequency ? ` \u00b7 ${item.frequency}` : ''}`}
      rightBadge={badge}
      onClick={onClick}
    />
  )
}
