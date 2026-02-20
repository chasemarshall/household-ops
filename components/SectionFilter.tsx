'use client'

interface SectionFilterProps {
  sections: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
}

export default function SectionFilter({
  sections,
  active,
  onChange,
}: SectionFilterProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 57,
        zIndex: 50,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        overflowX: 'auto',
        padding: '0 24px',
      }}
    >
      {sections.map((section) => {
        const isActive = section.key === active

        return (
          <button
            key={section.key}
            onClick={() => onChange(section.key)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 16px 11px',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 12,
              fontWeight: isActive ? 700 : 400,
              color: isActive ? 'var(--accent)' : 'var(--text-3)',
              borderBottom: isActive
                ? '2px solid var(--accent)'
                : '2px solid transparent',
              whiteSpace: 'nowrap',
              lineHeight: 1,
            }}
          >
            {section.label}
          </button>
        )
      })}
    </div>
  )
}
