import type { Metadata } from 'next'
import { JetBrains_Mono, Outfit } from 'next/font/google'
import './globals.css'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Household Ops',
  description: 'Household management dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${outfit.variable}`}>
      <body style={{ fontFamily: 'var(--font-outfit), sans-serif', background: 'var(--bg)', color: 'var(--text-1)', minHeight: '100svh' }}>
        {children}
      </body>
    </html>
  )
}
