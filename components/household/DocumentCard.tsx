'use client'
import ItemCard from '@/components/ItemCard'
import { daysUntil, formatDate } from '@/lib/utils'
import { DOCUMENT_TYPE_LABELS } from '@/lib/constants'
import { ExternalLink } from 'lucide-react'
import type { Document } from '@/lib/types'

interface Props { item: Document; index: number; onClick: () => void }

export default function DocumentCard({ item, index, onClick }: Props) {
  const days = daysUntil(item.expiry_date)

  let barColor: string
  if (!item.expiry_date) {
    barColor = 'var(--text-3)'
  } else if (days !== null && days < 0) {
    barColor = 'var(--red)'
  } else if (days !== null && days <= 60) {
    barColor = 'var(--yellow)'
  } else {
    barColor = 'var(--green)'
  }

  const badge = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '11px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
        {DOCUMENT_TYPE_LABELS[item.type]}
      </span>
      {item.link && <ExternalLink size={12} color="var(--text-3)" />}
    </div>
  )

  const expiryMeta = item.expiry_date
    ? `expires ${formatDate(item.expiry_date)}`
    : 'no expiry'

  return (
    <ItemCard
      index={index}
      barColor={barColor}
      title={item.name}
      subtitle={item.associated_item ?? undefined}
      meta={expiryMeta}
      rightBadge={badge}
      onClick={onClick}
    />
  )
}
