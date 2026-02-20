'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import SectionFilter from '@/components/SectionFilter'
import Modal from '@/components/Modal'
import { Plus } from 'lucide-react'
import { useInventory } from '@/hooks/useInventory'
import { useDocuments } from '@/hooks/useDocuments'
import InventoryQuickAdd from '@/components/household/InventoryQuickAdd'
import InventoryItemRow from '@/components/household/InventoryItemRow'
import InventoryEditModal from '@/components/household/InventoryEditModal'
import DocumentCard from '@/components/household/DocumentCard'
import DocumentForm from '@/components/household/DocumentForm'
import type { InventoryItem, Document } from '@/lib/types'

const SECTIONS = [
  { key: 'inventory', label: 'inventory' },
  { key: 'documents', label: 'documents' },
]

type SectionKey = 'inventory' | 'documents'

export default function HouseholdPage() {
  const [section, setSection] = useState<SectionKey>('inventory')
  const [editInventoryItem, setEditInventoryItem] = useState<InventoryItem | null>(null)
  const [docModal, setDocModal] = useState<null | 'add' | 'edit'>(null)
  const [editDoc, setEditDoc] = useState<Document | null>(null)
  const [saving, setSaving] = useState(false)

  const inv = useInventory()
  const docs = useDocuments()

  /* ---- Inventory handlers ---- */
  const handleEditSave = async (updates: Partial<InventoryItem>) => {
    if (!editInventoryItem) return
    await inv.update(editInventoryItem.id, updates)
    setEditInventoryItem(null)
  }

  const handleEditDelete = async () => {
    if (!editInventoryItem) return
    await inv.remove(editInventoryItem.id)
    setEditInventoryItem(null)
  }

  const uncheckedItems = inv.items.filter(i => !i.checked)
  const checkedItems = inv.items.filter(i => i.checked)
  const hasChecked = checkedItems.length > 0

  /* ---- Documents handlers ---- */
  const closeDocModal = () => {
    setDocModal(null)
    setEditDoc(null)
  }

  const handleDocSave = async (data: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'household_id' | 'created_by'>) => {
    setSaving(true)
    if (docModal === 'edit' && editDoc) {
      await docs.update(editDoc.id, data)
    } else {
      await docs.add(data)
    }
    setSaving(false)
    closeDocModal()
  }

  const handleDocDelete = async () => {
    if (editDoc) {
      await docs.remove(editDoc.id)
      closeDocModal()
    }
  }

  return (
    <>
      <Header title="household" />
      <SectionFilter
        sections={SECTIONS}
        active={section}
        onChange={(key) => setSection(key as SectionKey)}
      />

      <div style={{ padding: '16px 24px' }}>
        {/* ======= INVENTORY SECTION ======= */}
        {section === 'inventory' && (
          <>
            <InventoryQuickAdd onAdd={inv.add} />

            {/* Clear checked button */}
            {hasChecked && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                <button
                  onClick={inv.clearChecked}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-3)',
                    fontFamily: 'var(--font-jetbrains)',
                    fontSize: 11,
                    cursor: 'pointer',
                    padding: '4px 0',
                  }}
                >
                  clear checked
                </button>
              </div>
            )}

            {/* Loading skeleton */}
            {inv.loading ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{ height: 48, borderRadius: 'var(--radius)', marginBottom: 8 }}
                  />
                ))}
              </>
            ) : inv.items.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'var(--text-3)',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 12,
                  padding: '48px 0',
                }}
              >
                no items yet
              </div>
            ) : (
              <>
                {uncheckedItems.map((item, i) => (
                  <InventoryItemRow
                    key={item.id}
                    item={item}
                    index={i}
                    onToggle={() => inv.toggleChecked(item.id, true)}
                    onDelete={() => inv.remove(item.id)}
                    onEdit={() => setEditInventoryItem(item)}
                  />
                ))}
                {checkedItems.map((item, i) => (
                  <InventoryItemRow
                    key={item.id}
                    item={item}
                    index={uncheckedItems.length + i}
                    onToggle={() => inv.toggleChecked(item.id, false)}
                    onDelete={() => inv.remove(item.id)}
                    onEdit={() => setEditInventoryItem(item)}
                  />
                ))}
              </>
            )}
          </>
        )}

        {/* ======= DOCUMENTS SECTION ======= */}
        {section === 'documents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Add document button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setEditDoc(null); setDocModal('add') }}
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
                add document
              </button>
            </div>

            {/* Document list */}
            {docs.loading ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{ height: 72, borderRadius: 'var(--radius)' }}
                  />
                ))}
              </>
            ) : docs.items.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'var(--text-3)',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 12,
                  padding: '48px 0',
                }}
              >
                no documents yet
              </div>
            ) : (
              docs.items.map((doc, i) => (
                <DocumentCard
                  key={doc.id}
                  item={doc}
                  index={i}
                  onClick={() => {
                    setEditDoc(doc)
                    setDocModal('edit')
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* ======= INVENTORY EDIT MODAL ======= */}
      {editInventoryItem && (
        <InventoryEditModal
          item={editInventoryItem}
          onSave={handleEditSave}
          onDelete={handleEditDelete}
          onClose={() => setEditInventoryItem(null)}
        />
      )}

      {/* ======= DOCUMENT ADD/EDIT MODAL ======= */}
      {docModal && (
        <Modal
          title={docModal === 'edit' ? 'edit document' : 'add document'}
          onClose={closeDocModal}
        >
          <DocumentForm
            initial={docModal === 'edit' && editDoc ? editDoc : undefined}
            onSave={handleDocSave}
            onDelete={docModal === 'edit' ? handleDocDelete : undefined}
            saving={saving}
          />
        </Modal>
      )}
    </>
  )
}
