'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })
export const useToast = () => useContext(ToastContext)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = nextId++
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom, 0px) + 16px)',
        right: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} className="animate-toast-in" style={{
            background: t.type === 'error' ? 'var(--red-dim)' : 'var(--card)',
            border: `1px solid ${t.type === 'error' ? 'var(--red)' : 'var(--border)'}`,
            color: t.type === 'error' ? 'var(--red)' : 'var(--text-1)',
            padding: '10px 16px',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-jetbrains)',
            fontSize: '13px',
            maxWidth: '280px',
            pointerEvents: 'auto',
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
