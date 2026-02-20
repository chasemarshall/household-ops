'use client'
import ItemCard from '@/components/ItemCard'
import type { ParcelDelivery } from '@/hooks/useParcelDeliveries'

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: 'delivered',        color: 'var(--green)' },
  1: { label: 'stalled',          color: 'var(--text-3)' },
  2: { label: 'in transit',       color: 'var(--blue)' },
  3: { label: 'awaiting pickup',  color: 'var(--yellow)' },
  4: { label: 'out for delivery', color: 'var(--accent)' },
  5: { label: 'not found',        color: 'var(--red)' },
  6: { label: 'failed attempt',   color: 'var(--red)' },
  7: { label: 'exception',        color: 'var(--red)' },
  8: { label: 'info received',    color: 'var(--text-3)' },
}

interface Props {
  delivery: ParcelDelivery
  index: number
}

export default function ParcelDeliveryCard({ delivery, index }: Props) {
  const status = STATUS_MAP[delivery.status_code] ?? { label: 'unknown', color: 'var(--text-3)' }
  const latestEvent = delivery.events[0]

  const badge = (
    <span style={{
      fontFamily: 'var(--font-jetbrains)',
      fontSize: '11px',
      color: status.color,
      whiteSpace: 'nowrap',
    }}>
      {status.label}
    </span>
  )

  const metaParts = [
    delivery.tracking_number,
    delivery.carrier_code.toUpperCase(),
    latestEvent?.location,
    delivery.date_expected ? `expected ${delivery.date_expected}` : null,
  ].filter(Boolean).join(' \u00b7 ')

  return (
    <ItemCard
      index={index}
      barColor={status.color}
      title={delivery.description}
      subtitle={latestEvent?.event}
      meta={metaParts}
      rightBadge={badge}
    />
  )
}
