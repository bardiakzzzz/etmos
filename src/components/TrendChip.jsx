export default function TrendChip({ trend }) {
  const cfg = {
    up:     { label: '↑ Peggioramento', color: '#dc2626', bg: '#fee2e2' },
    down:   { label: '↓ Miglioramento', color: '#16a34a', bg: '#dcfce7' },
    stable: { label: '→ Stabile',       color: '#6b7280', bg: '#f3f4f6' },
  }[trend]
  return (
    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: cfg.bg, color: cfg.color, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  )
}
