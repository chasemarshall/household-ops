'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import SectionFilter from '@/components/SectionFilter'
import Modal from '@/components/Modal'
import { Plus } from 'lucide-react'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { useMaintenanceItems } from '@/hooks/useMaintenanceItems'
import { useBills } from '@/hooks/useBills'
import SubscriptionCard from '@/components/track/SubscriptionCard'
import SubscriptionForm from '@/components/track/SubscriptionForm'
import MaintenanceCard from '@/components/track/MaintenanceCard'
import MaintenanceForm from '@/components/track/MaintenanceForm'
import BillCard from '@/components/track/BillCard'
import BillForm from '@/components/track/BillForm'
import type { Subscription, MaintenanceItem, Bill } from '@/lib/types'

const SECTIONS = [
  { key: 'subscriptions', label: 'subscriptions' },
  { key: 'maintenance', label: 'maintenance' },
  { key: 'bills', label: 'bills' },
]

const ADD_LABELS: Record<string, string> = {
  subscriptions: 'add subscription',
  maintenance: 'add maintenance item',
  bills: 'add bill',
}

type SectionKey = 'subscriptions' | 'maintenance' | 'bills'

export default function TrackPage() {
  const [section, setSection] = useState<SectionKey>('subscriptions')
  const [modal, setModal] = useState<null | 'add' | 'edit'>(null)
  const [editItem, setEditItem] = useState<Subscription | MaintenanceItem | Bill | null>(null)
  const [saving, setSaving] = useState(false)

  const subs = useSubscriptions()
  const maint = useMaintenanceItems()
  const bills = useBills()

  const closeModal = () => {
    setModal(null)
    setEditItem(null)
  }

  const handleAdd = () => {
    setEditItem(null)
    setModal('add')
  }

  /* ---- Subscriptions handlers ---- */
  const handleSubSave = async (data: Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    setSaving(true)
    if (modal === 'edit' && editItem) {
      await subs.update(editItem.id, data)
    } else {
      await subs.add(data)
    }
    setSaving(false)
    closeModal()
  }

  const handleSubDelete = async () => {
    if (editItem) {
      await subs.remove(editItem.id)
      closeModal()
    }
  }

  /* ---- Maintenance handlers ---- */
  const handleMaintSave = async (data: Omit<MaintenanceItem, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    setSaving(true)
    if (modal === 'edit' && editItem) {
      await maint.update(editItem.id, data)
    } else {
      await maint.add(data)
    }
    setSaving(false)
    closeModal()
  }

  const handleMaintDelete = async () => {
    if (editItem) {
      await maint.remove(editItem.id)
      closeModal()
    }
  }

  /* ---- Bills handlers ---- */
  const handleBillSave = async (data: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    setSaving(true)
    if (modal === 'edit' && editItem) {
      await bills.update(editItem.id, data)
    } else {
      await bills.add(data)
    }
    setSaving(false)
    closeModal()
  }

  const handleBillDelete = async () => {
    if (editItem) {
      await bills.remove(editItem.id)
      closeModal()
    }
  }

  /* ---- Resolve loading / items / empty for active section ---- */
  const sectionData = {
    subscriptions: { loading: subs.loading, items: subs.items },
    maintenance: { loading: maint.loading, items: maint.items },
    bills: { loading: bills.loading, items: bills.items },
  }

  const { loading, items } = sectionData[section]

  /* ---- Modal title ---- */
  const modalTitles: Record<SectionKey, { add: string; edit: string }> = {
    subscriptions: { add: 'add subscription', edit: 'edit subscription' },
    maintenance: { add: 'add maintenance item', edit: 'edit maintenance item' },
    bills: { add: 'add bill', edit: 'edit bill' },
  }

  return (
    <>
      <Header title="track" />
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
            {section === 'subscriptions' &&
              subs.items.map((item, i) => (
                <SubscriptionCard
                  key={item.id}
                  item={item}
                  index={i}
                  onClick={() => {
                    setEditItem(item)
                    setModal('edit')
                  }}
                />
              ))}

            {section === 'maintenance' &&
              maint.items.map((item, i) => (
                <MaintenanceCard
                  key={item.id}
                  item={item}
                  index={i}
                  onMarkDone={() => maint.markDone(item.id)}
                  onClick={() => {
                    setEditItem(item)
                    setModal('edit')
                  }}
                />
              ))}

            {section === 'bills' &&
              bills.items.map((item, i) => (
                <BillCard
                  key={item.id}
                  item={item}
                  index={i}
                  onMarkPaid={() => bills.markPaid(item)}
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
          {section === 'subscriptions' && (
            <SubscriptionForm
              initial={modal === 'edit' && editItem ? (editItem as Subscription) : undefined}
              onSave={handleSubSave}
              onDelete={modal === 'edit' ? handleSubDelete : undefined}
              saving={saving}
            />
          )}
          {section === 'maintenance' && (
            <MaintenanceForm
              initial={modal === 'edit' && editItem ? (editItem as MaintenanceItem) : undefined}
              onSave={handleMaintSave}
              onDelete={modal === 'edit' ? handleMaintDelete : undefined}
              saving={saving}
            />
          )}
          {section === 'bills' && (
            <BillForm
              initial={modal === 'edit' && editItem ? (editItem as Bill) : undefined}
              onSave={handleBillSave}
              onDelete={modal === 'edit' ? handleBillDelete : undefined}
              saving={saving}
            />
          )}
        </Modal>
      )}
    </>
  )
}
