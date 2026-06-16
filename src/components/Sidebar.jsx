import { useState } from 'react'
import { TUNNELS } from '../data'
import TunnelCard from './TunnelCard'

export default function Sidebar({ selectedTunnel, onSelectTunnel, onOpenDetail }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = TUNNELS
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.road.toLowerCase().includes(search.toLowerCase()))
    .filter(t => filter === 'all' || (filter === 'critical' && t.cda >= 3) || (filter === 'ok' && t.cda <= 1))

  return (
    <div style={{
      width: 'var(--sidebar-w)', background: '#fff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Rete Autostradale — {TUNNELS.length} gallerie</div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Critiche', value: TUNNELS.filter(t => t.cda >= 3).length, color: '#dc2626', bg: '#fee2e2' },
            { label: 'In pegg.', value: TUNNELS.filter(t => t.trend === 'up').length, color: '#ea580c', bg: '#ffedd5' },
            { label: 'OK',       value: TUNNELS.filter(t => t.cda <= 1).length, color: '#16a34a', bg: '#dcfce7' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ flex: 1, background: bg, borderRadius: 8, padding: '6px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 10, color, opacity: 0.8, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', marginBottom: 8 }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="8" cy="8" r="5" /><path d="M13 13l4 4" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cerca galleria o strada..."
            style={{ width: '100%', padding: '7px 10px 7px 30px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none', color: '#374151' }} />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {[['all','Tutte'],['critical','Critiche'],['ok','OK']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              border: '1px solid', borderRadius: 99, padding: '3px 10px', fontSize: 11, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontWeight: filter === val ? 600 : 400,
              borderColor: filter === val ? '#1d4ed8' : '#e5e7eb',
              background: filter === val ? '#eff6ff' : '#fff',
              color: filter === val ? '#1d4ed8' : '#6b7280',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(t => (
          <TunnelCard key={t.id} tunnel={t} selected={selectedTunnel?.id === t.id}
            onClick={() => onSelectTunnel(t)}
            onDoubleClick={() => { onSelectTunnel(t); onOpenDetail() }} />
        ))}
      </div>

      {selectedTunnel && (
        <div style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>
          <button onClick={onOpenDetail} style={{
            width: '100%', padding: '10px', background: '#1d4ed8', color: 'white',
            border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>
            Apri dettaglio galleria →
          </button>
        </div>
      )}
    </div>
  )
}
