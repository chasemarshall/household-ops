'use client'
import ItemCard from '@/components/ItemCard'
import { daysUntil, urgencyColor, relativeDays, formatCurrency, formatDate } from '@/lib/utils'
import { BILLING_CYCLE_LABELS, SUBSCRIPTION_CATEGORY_LABELS } from '@/lib/constants'
import type { Subscription } from '@/lib/types'

interface Props {
  item: Subscription
  index: number
  onClick: () => void
}

export default function SubscriptionCard({ item, index, onClick }: Props) {
  const days = daysUntil(item.next_renewal_date)
  const barColor = item.next_renewal_date ? urgencyColor(days, 7) : 'var(--text-3)'

  const badge = (
    <span style={{
      fontFamily: 'var(--font-jetbrains)',
      fontSize: '11px',
      color: barColor,
      whiteSpace: 'nowrap',
    }}>
      {item.next_renewal_date ? relativeDays(days) : '\u2014'}
    </span>
  )

  return (
    <ItemCard
      index={index}
      barColor={barColor}
      title={item.name}
      subtitle={item.cost != null ? `${formatCurrency(item.cost)} / ${BILLING_CYCLE_LABELS[item.billing_cycle]}` : BILLING_CYCLE_LABELS[item.billing_cycle]}
      meta={`${SUBSCRIPTION_CATEGORY_LABELS[item.category]}${item.auto_renews ? ' \u00b7 auto-renews' : ''} \u00b7 renews ${formatDate(item.next_renewal_date)}`}
      rightBadge={badge}
      onClick={onClick}
    />
  )
}
