import { TUNNELS } from '../data'

const criticalCount = TUNNELS.filter(t => t.cda >= 3).length

export default function TopBar({ view, onNav, selectedTunnel }) {
  return (
    <div style={{
      height: 'var(--topbar-h)', background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', gap: 0,
      padding: '0 24px', flexShrink: 0, zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 32 }}>
        <div style={{ width: 32, height: 32, background: '#1d4ed8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1 }}>ETMOS</div>
          <div style={{ fontSize: 10, color: '#9ca3af', lineHeight: 1, marginTop: 1 }}>Autostrade per l'Italia</div>
        </div>
      </div>

      {/* Nav */}
      {[
        { id: 'map',      label: 'Mappa' },
        { id: 'detail',   label: selectedTunnel ? selectedTunnel.name : 'Dettaglio Galleria', disabled: !selectedTunnel },
        { id: 'schedule', label: 'Monitoraggio' },
        { id: 'agent',    label: 'Agent' },
      ].map(({ id, label, disabled }) => (
        <button key={id} onClick={() => !disabled && onNav(id)}
          disabled={disabled}
          style={{
            background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer',
            padding: '6px 14px', fontSize: 14, fontWeight: view === id ? 600 : 400,
            color: disabled ? '#d1d5db' : view === id ? '#1d4ed8' : '#374151',
            borderBottom: view === id ? '2px solid #1d4ed8' : '2px solid transparent',
            marginBottom: -1, fontFamily: 'DM Sans, sans-serif',
            transition: 'color 0.15s',
          }}>
          {label}
        </button>
      ))}

      {/* Right */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fee2e2', borderRadius: 8, padding: '5px 12px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#dc2626' }}></div>
          <span style={{ fontSize: 13, color: '#b91c1c', fontWeight: 600 }}>{criticalCount} gallerie critiche</span>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'white', fontWeight: 700 }}>
          OP
        </div>
      </div>
    </div>
  )
}
