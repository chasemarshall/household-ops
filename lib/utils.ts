import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns days between today and a target date. Negative = overdue. */
export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/** Calculates next due date from last completed + interval */
export function calcNextDue(lastCompleted: string | null, intervalDays: number): string | null {
  if (!lastCompleted) return null
  const last = new Date(lastCompleted)
  last.setDate(last.getDate() + intervalDays)
  return last.toISOString().split('T')[0]
}

/** Formats a date string to a human-readable label */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Returns relative label like "in 3d", "2d ago", "today" */
export function relativeDays(days: number | null): string {
  if (days === null) return '—'
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days === -1) return 'yesterday'
  if (days > 0) return `in ${days}d`
  return `${Math.abs(days)}d ago`
}

/** Status color for left bar based on days remaining */
export function urgencyColor(days: number | null, thresholdWarn = 14): string {
  if (days === null) return 'var(--text-3)'
  if (days < 0) return 'var(--red)'
  if (days <= thresholdWarn) return 'var(--yellow)'
  return 'var(--green)'
}

/** Gets initials from a display name */
export function initials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Formats currency */
export function formatCurrency(amount: number | null): string {
  if (amount === null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
