import { useState } from 'react'
import { SEV_COLORS, SEV_LABELS, cellFrame, frameSeverity } from '../data'
import CellModal from './CellModal'

const SECTIONS = [
  { label: 'Soffitto',    rows: 2, seed: 0  },
  { label: 'Parete sin.', rows: 3, seed: 10 },
  { label: 'Parete des.', rows: 3, seed: 20 },
]
const COLS = 60

export default function HeatmapGrid({ tunnel, timeIdx }) {
  const [selectedCell, setSelectedCell] = useState(null)

  return (
    <>
      {selectedCell && (
        <CellModal cell={selectedCell} tunnel={tunnel} timeIdx={timeIdx} onClose={() => setSelectedCell(null)} />
      )}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ display: 'flex', marginLeft: 80, marginBottom: 4 }}>
          {[0,10,20,30,40,50,60].map(i => (
            <div key={i} style={{ width: `${(10/60)*100}%`, fontSize: 10, color: '#9ca3af', minWidth: 60 }}>
              {Math.round((i/COLS)*tunnel.len*10)/10} km
            </div>
          ))}
        </div>

        {SECTIONS.map(({ label, rows, seed }) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginBottom: 4 }}>{label}</div>
            {Array.from({ length: rows }).map((_, ri) => (
              <div key={ri} style={{ display: 'flex', marginBottom: 1.5 }}>
                {ri === 0
                  ? <div style={{ width: 80, fontSize: 10, color: '#9ca3af', paddingTop: 2, flexShrink: 0 }}>{label}</div>
                  : <div style={{ width: 80, flexShrink: 0 }} />
                }
                {Array.from({ length: COLS }).map((_, ci) => {
                  const frame = cellFrame(ci, ri)
                  const sev = frameSeverity(frame)
                  return (
                    <div key={ci}
                      onClick={() => setSelectedCell({ section: label, row: ri, col: ci, sev, seed, frame })}
                      title={`${label} · KP ${Math.round((ci/COLS)*tunnel.len*100)/100} km — ${SEV_LABELS[sev]} (${frame.status}${frame.coverage > 0 ? ` · ${frame.coverage}%` : ''})`}
                      style={{
                        flex: 1, height: 14, background: SEV_COLORS[sev],
                        margin: '0 0.5px', borderRadius: 1, cursor: 'pointer',
                        minWidth: 8, opacity: 0.85, transition: 'opacity 0.1s, transform 0.1s',
                      }}
                      onMouseEnter={e => { e.target.style.opacity=1; e.target.style.transform='scaleY(1.4)' }}
                      onMouseLeave={e => { e.target.style.opacity=0.85; e.target.style.transform='scaleY(1)' }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12, marginLeft: 80, marginTop: 8, alignItems: 'center' }}>
          {SEV_LABELS.map((l, i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, background: SEV_COLORS[i], borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#6b7280' }}>{l}</span>
            </div>
          ))}
          <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 8 }}>· click su cella → immagine + predizione AI</span>
        </div>
      </div>
    </>
  )
}
