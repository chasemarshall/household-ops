'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import SectionFilter from '@/components/SectionFilter'
import Modal from '@/components/Modal'
import { Plus } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { useActivities } from '@/hooks/useActivities'
import OrderCard from '@/components/orders/OrderCard'
import OrderForm from '@/components/orders/OrderForm'
import ActivityCard from '@/components/orders/ActivityCard'
import ActivityForm from '@/components/orders/ActivityForm'
import type { Order, Activity } from '@/lib/types'

const SECTIONS = [
  { key: 'deliveries', label: 'deliveries' },
  { key: 'activities', label: 'activities' },
]

const ADD_LABELS: Record<string, string> = {
  deliveries: 'add order',
  activities: 'add activity',
}

type SectionKey = 'deliveries' | 'activities'

export default function OrdersPage() {
  const [section, setSection] = useState<SectionKey>('deliveries')
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null)
  const [editItem, setEditItem] = useState<Order | Activity | null>(null)
  const [saving, setSaving] = useState(false)

  const orders = useOrders()
  const activities = useActivities()

  const closeModal = () => {
    setModal(null)
    setEditItem(null)
  }

  const handleAdd = () => {
    setEditItem(null)
    setModal('add')
  }

  /* ---- Order handlers ---- */
  const handleOrderSave = async (data: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    setSaving(true)
    if (modal === 'edit' && editItem) {
      await orders.update(editItem.id, data)
    } else {
      await orders.add(data)
    }
    setSaving(false)
    closeModal()
  }

  const handleOrderDelete = async () => {
    if (editItem) {
      await orders.remove(editItem.id)
      closeModal()
    }
  }

  /* ---- Activity handlers ---- */
  const handleActivitySave = async (data: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'person'>) => {
    setSaving(true)
    if (modal === 'edit' && editItem) {
      await activities.update(editItem.id, data)
    } else {
      await activities.add(data)
    }
    setSaving(false)
    closeModal()
  }

  const handleActivityDelete = async () => {
    if (editItem) {
      await activities.remove(editItem.id)
      closeModal()
    }
  }

  /* ---- Resolve loading / items for active section ---- */
  const sectionData = {
    deliveries: { loading: orders.loading, items: orders.items },
    activities: { loading: activities.loading, items: activities.items },
  }

  const { loading, items } = sectionData[section]

  /* ---- Modal titles ---- */
  const modalTitles: Record<SectionKey, { add: string; edit: string }> = {
    deliveries: { add: 'add order', edit: 'edit order' },
    activities: { add: 'add activity', edit: 'edit activity' },
  }

  return (
    <>
      <Header title="orders" />
      <SectionFilter
        sections={SECTIONS}
        active={section}
        onChange={(key) => setSection(key as SectionKey)}
      />

      {/* Content area */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Add button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleAdd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 12,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Plus size={14} />
            {ADD_LABELS[section]}
          </button>
        </div>

        {/* Section content */}
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{
                  height: 72,
                  borderRadius: 'var(--radius)',
                }}
              />
            ))}
          </>
        ) : items.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-3)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 12,
              padding: '48px 0',
            }}
          >
            no {section} yet
          </div>
        ) : (
          <>
            {section === 'deliveries' &&
              orders.items.map((item, i) => (
                <OrderCard
                  key={item.id}
                  item={item}
                  index={i}
                  onClick={() => {
                    setEditItem(item)
                    setModal('edit')
                  }}
                />
              ))}

            {section === 'activities' &&
              activities.items.map((item, i) => (
                <ActivityCard
                  key={item.id}
                  item={item}
                  index={i}
                  onMarkPaid={() => activities.markPaid(item.id)}
                  onClick={() => {
                    setEditItem(item)
                    setModal('edit')
                  }}
                />
              ))}
          </>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          title={modalTitles[section][modal]}
          onClose={closeModal}
        >
          {section === 'deliveries' && (
            <OrderForm
              initial={modal === 'edit' && editItem ? (editItem as Order) : undefined}
              onSave={handleOrderSave}
              onDelete={modal === 'edit' ? handleOrderDelete : undefined}
              saving={saving}
            />
          )}
          {section === 'activities' && (
            <ActivityForm
              initial={modal === 'edit' && editItem ? (editItem as Activity) : undefined}
              onSave={handleActivitySave}
              onDelete={modal === 'edit' ? handleActivityDelete : undefined}
              saving={saving}
            />
          )}
        </Modal>
      )}
    </>
  )
}
