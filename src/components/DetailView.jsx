import { useState } from 'react'
import { MONTHS, SEV_COLORS, SEV_LABELS, HERO_FRAME, frameOriginalUrl } from '../data'
import SevBadge from './SevBadge'
import TrendChip from './TrendChip'
import HeatmapGrid from './HeatmapGrid'

export default function DetailView({ tunnel, onBack }) {
  const [timeIdx, setTimeIdx] = useState(9)
  const [tube, setTube] = useState('right')

  // Distribution changes with both tube and timeIdx so the bars react to the slider
  const defectPct = [18, 24, 35, 14, 9].map((v, i) => {
    const tubeShift = tube === 'right' ? 0 : 5
    const timeShift = Math.round((timeIdx / 9) * (tunnel.trend === 'up' ? 12 : tunnel.trend === 'down' ? -8 : 4) * (i === 4 ? 1.5 : i === 3 ? 1.2 : 0.7))
    return Math.max(0, Math.min(100, v + Math.round(Math.sin(tunnel.id + i + tubeShift) * 8) + timeShift))
  })

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#f7f8fa' }}>

      {/* Subheader */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4l-6 6 6 6" /></svg>
          Torna alla mappa
        </button>
        <div style={{ width: 1, height: 20, background: '#e5e7eb' }} />
        <div>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{tunnel.name}</span>
          <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 10 }}>{tunnel.road} · {tunnel.len} km · {tunnel.lanes} carreggiate · Costruita {tunnel.year}</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <SevBadge level={tunnel.cda} size="md" />
          <TrendChip trend={tunnel.trend} />
          <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '4px 12px', fontSize: 13, color: '#374151' }}>Scan: {tunnel.lastScan}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Row 1 */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>

          {/* Tunnel photo */}
          <div style={{ width: 380, flexShrink: 0, background: '#111', borderRadius: 12, overflow: 'hidden', minHeight: 260, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <img
                src={frameOriginalUrl(HERO_FRAME)}
                alt={tunnel.name}
                style={{ width: '100%', height: 230, objectFit: 'cover', display: 'block' }}
              />
              {/* Overlay badge */}
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: '#fff', backdropFilter: 'blur(4px)' }}>
                KP 3+450 · {tube === 'right' ? 'Carreggiata destra' : 'Carreggiata sinistra'}
              </div>
            </div>
            <div style={{ padding: '7px 12px', background: '#0a0a0a', color: '#9ca3af', fontSize: 11, display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #222' }}>
              <span>📷</span>
              <span>Acquisizione — <b style={{ color: '#d1d5db' }}>{MONTHS[timeIdx]}</b> · KP 3+450 · Carreggiata {tube === 'right' ? 'destra' : 'sinistra'}</span>
              <span style={{ marginLeft: 'auto', color: '#ef4444', fontWeight: 600 }}>⚠ 2 difetti rilevati</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Carreggiata</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['right','Destra →'],['left','← Sinistra']].map(([val,label]) => (
                  <button key={val} onClick={() => setTube(val)} style={{
                    flex: 1, padding: '8px', border: '1.5px solid', borderRadius: 8,
                    fontFamily: 'DM Sans, sans-serif', fontSize: 13, cursor: 'pointer', fontWeight: 600,
                    borderColor: tube===val?'#1d4ed8':'#e5e7eb',
                    background: tube===val?'#eff6ff':'#fff',
                    color: tube===val?'#1d4ed8':'#374151',
                  }}>{label}</button>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb', flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Distribuzione difetti per livello</div>
              {defectPct.map((pct, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 70, fontSize: 11, color: '#6b7280', textAlign: 'right' }}>{SEV_LABELS[i]}</div>
                  <div style={{ flex: 1, height: 18, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: SEV_COLORS[i], borderRadius: 99, transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ width: 30, fontSize: 12, fontWeight: 600, color: SEV_COLORS[i] }}>{pct}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI card */}
          <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: tunnel.cda>=3?'#fef2f2':'#f0fdf4', border: `1px solid ${tunnel.cda>=3?'#fecaca':'#bbf7d0'}`, borderRadius: 12, padding: '14px 16px', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Previsione AI</div>
              <div style={{ height: 60, position: 'relative', marginBottom: 8 }}>
                <svg viewBox="0 0 180 60" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <polyline
                    points={MONTHS.map((_,i) => { const y=50-(i/9)*(tunnel.trend==='up'?38:tunnel.trend==='down'?-38:5)-Math.sin(i)*4; return `${i*20},${Math.max(5,Math.min(55,y))}` }).join(' ')}
                    fill="none" stroke={tunnel.cda>=3?'#dc2626':'#16a34a'} strokeWidth="2"
                  />
                  <line x1={`${9*20}`} y1="0" x2={`${9*20}`} y2="60" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3"/>
                  <text x={`${9*20+4}`} y="10" fontSize="7" fill="#9ca3af">oggi</text>
                </svg>
              </div>
              <div style={{ fontSize: 12, color: tunnel.trend==='up'?'#dc2626':'#16a34a', fontWeight: 600, lineHeight: 1.3 }}>
                {tunnel.trend==='up'?'⚠ Intervento entro 8 mesi':tunnel.trend==='down'?'✓ Miglioramento in corso':'→ Situazione stabile'}
              </div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{tunnel.defects.toLocaleString()} difetti attivi su {tunnel.cells.toLocaleString()} celle</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Prossima ispezione</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>15 Giu 2026</div>
              <button style={{ marginTop: 8, width: '100%', padding: '6px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', fontWeight: 600 }}>
                Pianifica monitoraggio
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Heatmap */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Mappa intradosso — vista srotolata</div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#6b7280' }}>Storico:</span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Gen 2024</span>
              <input type="range" min="0" max="9" value={timeIdx} onChange={e => setTimeIdx(Number(e.target.value))}
                style={{ width: 160, accentColor: '#1d4ed8', cursor: 'pointer' }} />
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Apr 2026</span>
              <div style={{ background: '#1d4ed8', color: 'white', padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, minWidth: 70, textAlign: 'center' }}>
                {MONTHS[timeIdx]}
              </div>
            </div>
          </div>
          <HeatmapGrid tunnel={tunnel} timeIdx={timeIdx} />
        </div>

      </div>
    </div>
  )
}
