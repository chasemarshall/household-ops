interface StatCardProps {
  label: string
  value: number | string
  color?: string
}

export default function StatCard({ label, value, color = 'var(--text-1)' }: StatCardProps) {
  return (
    <div
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius)',
        padding: '14px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '24px',
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-jetbrains)',
          fontSize: '11px',
          color: 'var(--text-3)',
          marginTop: '4px',
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
    </div>
  )
}
