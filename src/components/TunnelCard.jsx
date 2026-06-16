import SevBadge from './SevBadge'
import TrendChip from './TrendChip'

export default function TunnelCard({ tunnel, selected, onClick, onDoubleClick }) {
  return (
    <div onClick={onClick} onDoubleClick={onDoubleClick} style={{
      padding: '14px 16px', cursor: 'pointer',
      borderBottom: '1px solid #f3f4f6',
      background: selected ? '#eff6ff' : '#fff',
      borderLeft: selected ? '3px solid #1d4ed8' : '3px solid transparent',
      transition: 'background 0.1s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{tunnel.name}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>{tunnel.road} · {tunnel.len} km · {tunnel.lanes} carre.</div>
        </div>
        <SevBadge level={tunnel.cda} />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <TrendChip trend={tunnel.trend} />
        <span style={{ fontSize: 11, color: '#6b7280' }}>
          <span style={{ color: tunnel.defects > 500 ? '#dc2626' : '#6b7280', fontWeight: 600 }}>{tunnel.defects.toLocaleString()}</span> difetti attivi
        </span>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>Scan: {tunnel.lastScan}</span>
      </div>
    </div>
  )
}
