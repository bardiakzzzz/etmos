import { useState } from 'react'
import { MONTHS, FRAMES, SEV_COLORS, SEV_BG, SEV_TEXT, SEV_LABELS, frameSeverity, frameOriginalUrl, frameOverlayUrl } from '../data'
import SevBadge from './SevBadge'

export default function CellModal({ cell, tunnel, timeIdx, onClose }) {
  const { section, row, col } = cell
  const kp = Math.round((col / 60) * tunnel.len * 100) / 100
  const [selMonth, setSelMonth] = useState(timeIdx)

  // Human-in-the-loop state
  const [reviewState, setReviewState] = useState('idle') // 'idle' | 'reviewing' | 'submitted'
  const [humanSev, setHumanSev] = useState(null)         // null = not overridden
  const [humanNote, setHumanNote] = useState('')
  const [defectTypes, setDefectTypes] = useState([])

  const baseFrame = cell.frame
  const baseIdx = FRAMES.indexOf(baseFrame)
  const frameAtMonth = (monthIdx) => {
    const offset = (monthIdx >= 8) ? 0 : (monthIdx - timeIdx) * 3
    return FRAMES[(baseIdx + offset + FRAMES.length * 10) % FRAMES.length]
  }

  const finalFrame = frameAtMonth(selMonth)
  const aiSev = frameSeverity(finalFrame)
  const activeSev = humanSev !== null ? humanSev : aiSev
  const prevSev = selMonth > 0 ? frameSeverity(frameAtMonth(selMonth - 1)) : aiSev
  const pctDefect = finalFrame.coverage > 0 ? finalFrame.coverage.toFixed(1) : 0

  const DEFECT_OPTIONS = ['Crepa strutturale', 'Infiltrazione d\'acqua', 'Distacco', 'Eflorescenza', 'Deformazione', 'Nessun difetto']

  function toggleDefect(d) {
    setDefectTypes(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  function submitReview() {
    setReviewState('submitted')
  }

  function resetReview() {
    setReviewState('idle')
    setHumanSev(null)
    setHumanNote('')
    setDefectTypes([])
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: 860, maxWidth: '96vw', maxHeight: '92vh', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Cella — {tunnel.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
              {section} · Riga {row + 1} · KP {kp} km · <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{MONTHS[selMonth]}</span>
            </div>
          </div>
          <SevBadge level={activeSev} size="md" />
          {reviewState === 'submitted' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#dcfce7', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: '#15803d', fontWeight: 600 }}>
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Verificato
            </div>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#6b7280', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Two image panels */}
          <div style={{ display: 'flex' }}>
            {/* Original */}
            <div style={{ flex: 1, padding: '16px', borderRight: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>📷 Immagine acquisizione — {MONTHS[selMonth]}</div>
              <div style={{ borderRadius: 8, overflow: 'hidden', background: '#111', position: 'relative' }}>
                <img src={frameOriginalUrl(finalFrame)} alt={`Scan ${MONTHS[selMonth]}`} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}/>
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#fff', backdropFilter: 'blur(3px)' }}>
                  {finalFrame.id.replace('frame_', 'Frame ')}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, textAlign: 'center' }}>Sensore RIDAS · HD Camera · 1m² · f/2.8</div>
            </div>

            {/* AI overlay */}
            <div style={{ flex: 1, padding: '16px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                🤖 Segmentazione AI — ARGOS · {MONTHS[selMonth]}
                <span style={{ fontSize: 10, background: '#f3f4f6', borderRadius: 99, padding: '1px 7px', color: '#6b7280' }}>Confidence {75 + aiSev * 4}%</span>
              </div>
              <div style={{ borderRadius: 8, overflow: 'hidden', background: '#0f172a', position: 'relative' }}>
                <img src={frameOverlayUrl(finalFrame)} alt={`Overlay ${MONTHS[selMonth]}`} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}/>
                <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.75)', borderRadius: 8, padding: '4px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: SEV_COLORS[aiSev], lineHeight: 1 }}>{pctDefect}%</span>
                  <span style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>area difettosa (AI)</span>
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8, background: aiSev >= 3 ? 'rgba(220,38,38,0.85)' : aiSev >= 1 ? 'rgba(202,138,4,0.85)' : 'rgba(22,163,74,0.85)', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#fff', fontWeight: 700 }}>
                  {finalFrame.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* ── Human in the Loop panel ──────────────────────────────────────── */}
          <div style={{ borderTop: '2px solid #e5e7eb', margin: '0', background: reviewState === 'submitted' ? '#f0fdf4' : reviewState === 'reviewing' ? '#fafafa' : '#fff' }}>

            {/* Collapsed bar */}
            {reviewState === 'idle' && (
              <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: '#f3f4f6', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="none"><circle cx="10" cy="7" r="3" stroke="#6b7280" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Verifica umana</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>Controlla la segmentazione AI e correggi se necessario</div>
                  </div>
                </div>
                <button onClick={() => setReviewState('reviewing')} style={{ padding: '7px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none"><path d="M8 1v14M1 8h14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                  Avvia revisione
                </button>
              </div>
            )}

            {/* Review form */}
            {reviewState === 'reviewing' && (
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 0 3px rgba(245,158,11,0.2)' }}/>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Revisione in corso</span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>· Le modifiche sovrascrivono la classificazione ARGOS</span>
                  <button onClick={resetReview} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#9ca3af', padding: '2px 6px' }}>Annulla</button>
                </div>

                {/* Severity override */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    Livello di gravità
                    <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: 8 }}>AI suggerisce: <strong style={{ color: SEV_COLORS[aiSev] }}>{SEV_LABELS[aiSev]}</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {SEV_LABELS.map((label, i) => {
                      const isSelected = humanSev === i
                      const isAI = humanSev === null && i === aiSev
                      return (
                        <button key={i} onClick={() => setHumanSev(humanSev === i ? null : i)} style={{
                          flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                          border: `2px solid ${isSelected ? SEV_COLORS[i] : isAI ? SEV_COLORS[i] + '80' : '#e5e7eb'}`,
                          background: isSelected ? SEV_BG[i] : isAI ? SEV_BG[i] + '60' : '#fff',
                          fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                        }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: SEV_COLORS[i], margin: '0 auto 4px' }}/>
                          <div style={{ fontSize: 10, fontWeight: isSelected ? 700 : 500, color: isSelected ? SEV_TEXT[i] : '#374151', lineHeight: 1.2 }}>{label}</div>
                          {isAI && !isSelected && <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2 }}>AI</div>}
                          {isSelected && <div style={{ fontSize: 9, color: SEV_TEXT[i], fontWeight: 700, marginTop: 2 }}>✓ Scelto</div>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Defect type checkboxes */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Tipologia difetto</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {DEFECT_OPTIONS.map(d => {
                      const checked = defectTypes.includes(d)
                      return (
                        <button key={d} onClick={() => toggleDefect(d)} style={{
                          padding: '5px 11px', borderRadius: 99, fontSize: 12, cursor: 'pointer',
                          border: `1px solid ${checked ? '#1d4ed8' : '#e5e7eb'}`,
                          background: checked ? '#eff6ff' : '#fff',
                          color: checked ? '#1d4ed8' : '#374151',
                          fontFamily: 'DM Sans, sans-serif', fontWeight: checked ? 600 : 400,
                          display: 'flex', alignItems: 'center', gap: 5,
                          transition: 'all 0.12s',
                        }}>
                          {checked && <svg viewBox="0 0 12 12" width="10" height="10" fill="none"><path d="M2 6l3 3 5-5" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          {d}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Note (opzionale)</div>
                  <textarea value={humanNote} onChange={e => setHumanNote(e.target.value)}
                    placeholder="Aggiungi osservazioni sul difetto, contesto visivo, o indicazioni per il team di manutenzione…"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, fontFamily: 'DM Sans, sans-serif', resize: 'vertical', minHeight: 60, outline: 'none', color: '#374151', lineHeight: 1.5 }}
                  />
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button onClick={submitReview} style={{ padding: '9px 20px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none"><path d="M2 8l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Conferma revisione
                  </button>
                  {humanSev !== null && humanSev !== aiSev && (
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      Gravità: <span style={{ color: SEV_COLORS[aiSev], fontWeight: 600 }}>{SEV_LABELS[aiSev]}</span>
                      <span style={{ margin: '0 6px', color: '#d1d5db' }}>→</span>
                      <span style={{ color: SEV_COLORS[humanSev], fontWeight: 600 }}>{SEV_LABELS[humanSev]}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submitted confirmation */}
            {reviewState === 'submitted' && (
              <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M4 10l4.5 4.5L16 5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>Revisione confermata</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span>Gravità: <strong style={{ color: SEV_COLORS[activeSev] }}>{SEV_LABELS[activeSev]}</strong>{humanSev !== null && humanSev !== aiSev && <span style={{ color: '#9ca3af' }}> (corretta da AI: {SEV_LABELS[aiSev]})</span>}</span>
                    {defectTypes.length > 0 && <span>Tipologie: {defectTypes.join(', ')}</span>}
                    {humanNote && <span>Note: "{humanNote}"</span>}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', flexShrink: 0 }}>
                  Operatore OP · {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <button onClick={resetReview} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', color: '#6b7280', fontFamily: 'DM Sans, sans-serif' }}>
                  Modifica
                </button>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                Traiettoria storica — questa cella
                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400 }}>· clicca un punto per cambiare mese</span>
              </div>
              <div style={{ position: 'relative', height: 56, userSelect: 'none' }}>
                <svg viewBox="0 0 400 48" style={{ width: '100%', height: 48, display: 'block', cursor: 'pointer' }} preserveAspectRatio="none">
                  {SEV_COLORS.map((c, i) => <rect key={i} x="0" y={4+(4-i)*8} width="400" height="8" fill={c} opacity="0.07"/>)}
                  {[0,1,2,3,4].map(i => <line key={i} x1="0" y1={i*10+4} x2="400" y2={i*10+4} stroke="#e5e7eb" strokeWidth="0.8"/>)}
                  <polyline
                    points={MONTHS.map((_,i) => { const s=frameSeverity(frameAtMonth(i)); return `${i*44.4},${44-s*8}` }).join(' ')}
                    fill="none" stroke="#94a3b8" strokeWidth="1.5"
                  />
                  {/* Human override dot on selected month */}
                  {reviewState === 'submitted' && humanSev !== null && (
                    <circle cx={selMonth*44.4} cy={44-humanSev*8} r="7" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="3,2"/>
                  )}
                  <rect x={selMonth*44.4-18} y="0" width="36" height="48" fill="#1d4ed8" opacity="0.07" rx="3"/>
                  <line x1={selMonth*44.4} y1="0" x2={selMonth*44.4} y2="48" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="3,3"/>
                  {MONTHS.map((_,i) => {
                    const s = frameSeverity(frameAtMonth(i))
                    const displayS = (reviewState === 'submitted' && humanSev !== null && i === selMonth) ? humanSev : s
                    const cx=i*44.4, cy=44-displayS*8
                    const isSel=i===selMonth
                    return (
                      <g key={i} onClick={()=>setSelMonth(i)} style={{cursor:'pointer'}}>
                        <circle cx={cx} cy={cy} r="12" fill="transparent"/>
                        {isSel && <circle cx={cx} cy={cy} r="8" fill={SEV_COLORS[displayS]} opacity="0.25"/>}
                        <circle cx={cx} cy={cy} r={isSel?5:4} fill={SEV_COLORS[displayS]} stroke={isSel?'#1d4ed8':'white'} strokeWidth={isSel?2:1.5}/>
                      </g>
                    )
                  })}
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  {MONTHS.map((m,i) => (
                    <span key={i} onClick={()=>setSelMonth(i)} style={{ fontSize: 9, cursor: 'pointer', color: i===selMonth?'#1d4ed8':'#9ca3af', fontWeight: i===selMonth?700:400 }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ width: 190, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ background: SEV_BG[activeSev], borderRadius: 8, padding: '8px 12px', transition: 'background 0.2s' }}>
                <div style={{ fontSize: 11, color: '#6b7280', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{MONTHS[selMonth]}</span>
                  {reviewState === 'submitted' && humanSev !== null && <span style={{ fontSize: 10, color: '#1d4ed8', fontWeight: 600 }}>✓ Verificato</span>}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: SEV_TEXT[activeSev], marginTop: 2 }}>{SEV_LABELS[activeSev]}</div>
                <div style={{ fontSize: 12, color: SEV_TEXT[activeSev] }}>{pctDefect}% area difettosa</div>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Rispetto al mese precedente</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: activeSev>prevSev?'#dc2626':activeSev<prevSev?'#16a34a':'#6b7280', marginTop: 2 }}>
                  {activeSev>prevSev?'↑ Peggiorato':activeSev<prevSev?'↓ Migliorato':'→ Invariato'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
