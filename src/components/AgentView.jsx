import { useState, useRef, useEffect } from 'react'
import { TUNNELS, SEV_COLORS, SEV_BG, SEV_TEXT, SEV_LABELS, MONTHS, FRAMES, frameSeverity, frameOriginalUrl, frameOverlayUrl } from '../data'
import SevBadge from './SevBadge'
import TrendChip from './TrendChip'

// ── Mini sparkline chart ──────────────────────────────────────────────────────
function Sparkline({ tunnelId, trend, color }) {
  const points = MONTHS.map((_, i) => {
    const base = 20 + tunnelId * 3
    const y = base + (trend === 'up' ? i * 3.5 : trend === 'down' ? -i * 2 : Math.sin(i) * 4) + Math.sin(tunnelId + i * 1.3) * 3
    return { x: i * 22, y: Math.max(5, Math.min(50, y)) }
  })
  const pts = points.map(p => `${p.x},${p.y}`).join(' ')
  const areaPath = `M${points[0].x},55 ${points.map(p => `L${p.x},${p.y}`).join(' ')} L${points[points.length-1].x},55 Z`
  return (
    <svg viewBox="0 0 198 58" style={{ width: '100%', height: 58, display: 'block' }}>
      <defs>
        <linearGradient id={`sg-${tunnelId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${tunnelId})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      {points.map((p, i) => i === points.length - 1 && (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="white" strokeWidth="1.5"/>
      ))}
      {/* x-axis labels */}
      {[0, 4, 9].map(i => (
        <text key={i} x={points[i].x} y="57" fontSize="7" fill="#9ca3af" textAnchor="middle">{MONTHS[i]}</text>
      ))}
    </svg>
  )
}

// ── Defect bar chart ──────────────────────────────────────────────────────────
function DefectBars({ tunnel }) {
  const vals = MONTHS.map((_, i) => {
    const base = tunnel.defects
    return Math.round(base * (0.6 + (i / 9) * (tunnel.trend === 'up' ? 0.5 : tunnel.trend === 'down' ? -0.2 : 0.1) + Math.sin(i + tunnel.id) * 0.05))
  })
  const max = Math.max(...vals)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 64, padding: '0 2px' }}>
      {vals.map((v, i) => {
        const isLast = i === vals.length - 1
        const color = tunnel.trend === 'up' ? (isLast ? '#dc2626' : '#f87171') : tunnel.trend === 'down' ? (isLast ? '#16a34a' : '#86efac') : '#60a5fa'
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: '100%', background: color, borderRadius: '2px 2px 0 0', height: `${(v / max) * 56}px`, transition: 'height 0.3s' }} title={`${MONTHS[i]}: ${v.toLocaleString()}`}/>
          </div>
        )
      })}
    </div>
  )
}

// ── Frame photo strip ─────────────────────────────────────────────────────────
function PhotoStrip({ frames }) {
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
      {frames.map((f, i) => {
        const sev = frameSeverity(f)
        const statusColor = sev >= 3 ? '#dc2626' : sev >= 1 ? '#ca8a04' : '#16a34a'
        return (
          <div key={i} style={{ flexShrink: 0, position: 'relative', borderRadius: 8, overflow: 'hidden', border: `2px solid ${statusColor}` }}>
            <img src={frameOriginalUrl(f)} style={{ width: 110, height: 74, objectFit: 'cover', display: 'block' }}/>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.65)', fontSize: 9, color: '#fff', padding: '2px 5px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{f.id.replace('frame_0000', 'F')}</span>
              <span style={{ color: statusColor, fontWeight: 700 }}>{f.status.toUpperCase()}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Message bubble components ─────────────────────────────────────────────────
function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
      <div style={{ maxWidth: '72%', background: '#1d4ed8', color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', fontSize: 14, lineHeight: 1.5 }}>
        {text}
      </div>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', fontWeight: 700, marginLeft: 8, flexShrink: 0, alignSelf: 'flex-end' }}>
        OP
      </div>
    </div>
  )
}

function AgentBubble({ children }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'flex-start' }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: '#0f172a', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none"><circle cx="10" cy="7" r="3" stroke="#60a5fa" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </div>
      <div style={{ flex: 1, background: '#fff', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', fontSize: 14, lineHeight: 1.6, color: '#111827' }}>
        {children}
      </div>
    </div>
  )
}

// ── Hardcoded conversations ───────────────────────────────────────────────────
const CONV_1_MESSAGES = [
  { role: 'user', text: 'Quali sono le gallerie critiche e quali sono i prossimi monitoraggi?' },
  { role: 'agent', content: 'critical_tunnels' },
  { role: 'user', text: 'E per la Galleria Apennino, quando è previsto il prossimo intervento?' },
  { role: 'agent', content: 'apennino_next' },
]

const CONV_2_MESSAGES = [
  { role: 'user', text: 'Mostrami il trend della Galleria Frejus con grafici e foto delle anomalie.' },
  { role: 'agent', content: 'frejus_trend' },
  { role: 'user', text: 'Quali sono le celle più critiche? Mostrami le immagini.' },
  { role: 'agent', content: 'frejus_cells' },
]

const criticalTunnels = TUNNELS.filter(t => t.cda >= 3)
const majorFrames = FRAMES.filter(f => f.status === 'major')
const minorFrames = FRAMES.filter(f => f.status === 'minor').slice(0, 5)
const frejus = TUNNELS[0]

function AgentContent({ id }) {
  switch (id) {

    case 'critical_tunnels':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p>Ho analizzato l'intera rete autostradale. Attualmente <strong>{criticalTunnels.length} gallerie</strong> presentano un indice CDA critico (livello 3 o superiore):</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {criticalTunnels.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9fafb', borderRadius: 8, padding: '8px 12px', border: '1px solid #e5e7eb' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{t.road} · {t.len} km · {t.defects.toLocaleString()} difetti</div>
                </div>
                <SevBadge level={t.cda}/>
                <TrendChip trend={t.trend}/>
              </div>
            ))}
          </div>
          <div style={{ background: '#fffbeb', borderRadius: 8, padding: '10px 14px', border: '1px solid #fde68a', fontSize: 13 }}>
            <strong>⚠ Prossimi monitoraggi pianificati:</strong>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { name: 'Galleria del Monte Bianco', date: '12 Mag 2026', urgency: 'Alta' },
                { name: 'Galleria Frejus',           date: '15 Mag 2026', urgency: 'Urgente' },
                { name: 'Galleria dei Giovi',        date: '19 Mag 2026', urgency: 'Alta' },
                { name: 'Galleria Gran Sasso',       date: '26 Mag 2026', urgency: 'Media' },
              ].map(({ name, date, urgency }) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#374151' }}>
                  <span>{name}</span>
                  <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>{date}</span>
                    <span style={{ background: urgency === 'Urgente' ? '#fee2e2' : urgency === 'Alta' ? '#ffedd5' : '#fef9c3', color: urgency === 'Urgente' ? '#b91c1c' : urgency === 'Alta' ? '#c2410c' : '#a16207', borderRadius: 99, padding: '1px 7px', fontWeight: 600, fontSize: 10 }}>{urgency}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'apennino_next':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p>La <strong>Galleria Apennino</strong> (A1, 18.5 km) ha un CDA di livello <strong>2 — Medio</strong> con trend in miglioramento. Non è nella fascia urgente, ma dato il suo trend positivo, l'ispezione è pianificata per:</p>
          <div style={{ background: '#eff6ff', borderRadius: 10, padding: '12px 16px', border: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>19–25 Maggio 2026</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Durata stimata: 2–3 giorni · Carreggiate: 2</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Ultima scansione</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>01 Apr 2026</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#374151' }}>Con il trend attuale in miglioramento (↓), si raccomanda di mantenere il monitoraggio trimestrale e rivalutare il CDA dopo la prossima scansione.</p>
        </div>
      )

    case 'frejus_trend':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p>Ecco l'analisi completa del trend per la <strong>Galleria Frejus</strong> (A32, 12.87 km). Con <strong>{frejus.defects.toLocaleString()} difetti attivi</strong> e CDA al livello massimo, è la galleria più critica della rete.</p>

          {/* Trend chart */}
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Evoluzione difetti — Gen 2024 → Apr 2026</div>
            <DefectBars tunnel={frejus}/>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              {MONTHS.map((m, i) => <span key={i} style={{ flex: 1, fontSize: 8, color: '#9ca3af', textAlign: 'center' }}>{m.split(' ')[0]}</span>)}
            </div>
          </div>

          {/* Sparkline */}
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Indice CDA nel tempo</div>
            <Sparkline tunnelId={frejus.id} trend={frejus.trend} color="#dc2626"/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Difetti totali', value: frejus.defects.toLocaleString(), color: '#dc2626', bg: '#fee2e2' },
              { label: 'Celle monitorate', value: frejus.cells.toLocaleString(), color: '#1d4ed8', bg: '#eff6ff' },
              { label: 'Ultima scansione', value: frejus.lastScan, color: '#374151', bg: '#f3f4f6' },
              { label: 'Previsione intervento', value: 'Entro 8 mesi', color: '#ea580c', bg: '#ffedd5' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: '#6b7280' }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color, marginTop: 2 }}>{value}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#374151' }}>Il trend di <strong>peggioramento continuo</strong> suggerisce un'escalation del degradamento strutturale. Si raccomanda un'ispezione ravvicinata entro <strong>Maggio 2026</strong>.</p>
        </div>
      )

    case 'frejus_cells':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p>Ecco le immagini delle celle con <strong>difetti maggiori (MAJOR)</strong> rilevate durante l'ultima sessione di scansione:</p>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }}/>
              Immagini originali — {majorFrames.length} frame con copertura &gt;20%
            </div>
            <PhotoStrip frames={majorFrames}/>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#ca8a04', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ca8a04' }}/>
              Segmentazione AI (overlay ARGOS) — stessi frame
            </div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {majorFrames.map((f, i) => (
                <div key={i} style={{ flexShrink: 0, position: 'relative', borderRadius: 8, overflow: 'hidden', border: '2px solid #dc2626' }}>
                  <img src={frameOverlayUrl(f)} style={{ width: 110, height: 74, objectFit: 'cover', display: 'block' }}/>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', fontSize: 9, color: '#fff', padding: '2px 5px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{f.coverage}% copertura</span>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>AI</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fef2f2', borderRadius: 8, padding: '10px 14px', border: '1px solid #fecaca', fontSize: 13 }}>
            <strong style={{ color: '#b91c1c' }}>⚠ Riepilogo AI (ARGOS v2.1):</strong>
            <ul style={{ marginTop: 6, paddingLeft: 16, color: '#374151', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <li>{majorFrames.length} frame classificati MAJOR con copertura media {(majorFrames.reduce((a, f) => a + f.coverage, 0) / majorFrames.length).toFixed(1)}%</li>
              <li>Tipologia principale: crepe strutturali + infiltrazioni d'acqua</li>
              <li>Zone critiche concentrate nel tratto KP 2+100 – KP 4+800</li>
              <li>Confidence media modello: 91%</li>
            </ul>
          </div>
        </div>
      )

    default:
      return null
  }
}

// ── Conversation examples selector ───────────────────────────────────────────
const CONVERSATIONS = [
  { id: 1, label: 'Gallerie critiche & monitoraggi', icon: '🗺️', messages: CONV_1_MESSAGES },
  { id: 2, label: 'Trend Galleria Frejus + foto',    icon: '📊', messages: CONV_2_MESSAGES },
]

// ── Main view ─────────────────────────────────────────────────────────────────
export default function AgentView() {
  const [activeConv, setActiveConv] = useState(null)
  const [typingIdx, setTypingIdx] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState([])
  const bottomRef = useRef(null)

  function loadConversation(conv) {
    setActiveConv(conv)
    setVisibleMessages([])
    setTypingIdx(0)
    // Reveal messages one by one with delays
    conv.messages.forEach((msg, i) => {
      setTimeout(() => {
        setVisibleMessages(prev => [...prev, msg])
        setTypingIdx(i + 1)
      }, i * 900)
    })
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleMessages])

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#f7f8fa' }}>

      {/* Left: conversation list */}
      <div style={{ width: 260, background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 20 20" width="12" height="12" fill="none"><circle cx="10" cy="7" r="3" stroke="#60a5fa" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            Agente ARGOS
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>Assistente AI per la rete tunnel</div>
        </div>

        <div style={{ padding: '10px 10px 6px', fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Conversazioni di esempio
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }}>
          {CONVERSATIONS.map(conv => (
            <button key={conv.id} onClick={() => loadConversation(conv)} style={{
              width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, marginBottom: 4,
              background: activeConv?.id === conv.id ? '#eff6ff' : 'transparent',
              border: activeConv?.id === conv.id ? '1px solid #bfdbfe' : '1px solid transparent',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              transition: 'background 0.15s',
            }}>
              <div style={{ fontSize: 16, marginBottom: 3 }}>{conv.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: activeConv?.id === conv.id ? '#1d4ed8' : '#374151', lineHeight: 1.3 }}>{conv.label}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{conv.messages.filter(m => m.role === 'user').length} domande</div>
            </button>
          ))}
        </div>

        <div style={{ padding: '10px 16px 14px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 10, color: '#d1d5db', textAlign: 'center' }}>ARGOS v2.1 · Sessione 20260317</div>
        </div>
      </div>

      {/* Right: chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Chat header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 24px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none"><circle cx="10" cy="7" r="3" stroke="#60a5fa" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Agente ARGOS</div>
            <div style={{ fontSize: 11, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }}/>
              Online · 10 gallerie monitorate
            </div>
          </div>
          {activeConv && (
            <div style={{ marginLeft: 'auto', background: '#f3f4f6', borderRadius: 8, padding: '4px 12px', fontSize: 12, color: '#374151', fontWeight: 500 }}>
              {activeConv.label}
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {!activeConv ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, color: '#9ca3af', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, background: '#f3f4f6', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="12" cy="8" r="4" stroke="#d1d5db" strokeWidth="1.5"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Seleziona una conversazione</div>
                <div style={{ fontSize: 13 }}>Scegli un esempio dal pannello a sinistra<br/>per vedere l'agente in azione.</div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {CONVERSATIONS.map(conv => (
                  <button key={conv.id} onClick={() => loadConversation(conv)} style={{
                    padding: '10px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#374151',
                    display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'border-color 0.15s',
                  }}>
                    <span style={{ fontSize: 18 }}>{conv.icon}</span>
                    <span style={{ fontWeight: 500 }}>{conv.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {visibleMessages.map((msg, i) => (
                <div key={i}>
                  {msg.role === 'user'
                    ? <UserBubble text={msg.text}/>
                    : <AgentBubble><AgentContent id={msg.content}/></AgentBubble>
                  }
                </div>
              ))}
              {/* Typing indicator */}
              {typingIdx < activeConv.messages.length && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: '#0f172a', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="none"><circle cx="10" cy="7" r="3" stroke="#60a5fa" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{ background: '#fff', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', border: '1px solid #e5e7eb', display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(j => (
                      <div key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: '#9ca3af', animation: `bounce 1.2s ${j * 0.2}s infinite` }}/>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </>
          )}
        </div>

        {/* Frozen input bar */}
        <div style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '12px 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#f3f4f6', borderRadius: 10, padding: '10px 14px', border: '1px solid #e5e7eb', opacity: 0.6 }}>
            <input disabled placeholder="Input utente non abilitato in questa demo…" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#374151', cursor: 'not-allowed' }}/>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M4 10h12M10 4l6 6-6 6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
