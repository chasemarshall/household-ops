'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, RefreshCw, Package, Layers, Settings } from 'lucide-react'

const TABS = [
  { href: '/home', label: 'home', icon: Home },
  { href: '/track', label: 'track', icon: RefreshCw },
  { href: '/orders', label: 'orders', icon: Package },
  { href: '/household', label: 'household', icon: Layers },
  { href: '/settings', label: 'settings', icon: Settings },
] as const

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: '12px 0 calc(12px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text-3)',
              }}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: '10px',
                  fontWeight: isActive ? 700 : 400,
                  lineHeight: 1,
                  paddingBottom: '2px',
                  borderBottom: isActive
                    ? '1px solid var(--accent)'
                    : '1px solid transparent',
                }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
