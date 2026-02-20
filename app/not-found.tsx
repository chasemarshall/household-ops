import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      gap: '16px',
    }}>
      <span style={{
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '48px',
        fontWeight: 700,
        color: 'var(--text-3)',
      }}>
        404
      </span>
      <p style={{
        fontFamily: 'var(--font-outfit)',
        fontSize: '14px',
        color: 'var(--text-3)',
        textAlign: 'center',
      }}>
        page not found
      </p>
      <Link href="/" style={{
        color: 'var(--accent)',
        fontFamily: 'var(--font-jetbrains)',
        fontSize: '13px',
        textDecoration: 'none',
      }}>
        ← go home
      </Link>
    </div>
  )
}
