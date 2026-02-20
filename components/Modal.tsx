'use client'

import { useEffect } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-slide-up"
        style={{
          background: 'var(--surface)',
          borderRadius: '12px 12px 0 0',
          width: '100%',
          maxWidth: 640,
          margin: '0 auto',
          maxHeight: '85dvh',
          overflowY: 'auto',
          padding:
            '24px 24px calc(24px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-1)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              lineHeight: 1,
              padding: '4px 8px',
            }}
            aria-label="Close"
          >
            &#x2715;
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  )
}
