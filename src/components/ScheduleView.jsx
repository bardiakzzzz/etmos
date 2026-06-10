import { TUNNELS } from '../data'
import SevBadge from './SevBadge'
import TrendChip from './TrendChip'

const weeks = [
  { week: 'Sett. 1 (5–11 Mag)',  tunnels: [TUNNELS[1], TUNNELS[3]] },
  { week: 'Sett. 2 (12–18 Mag)', tunnels: [TUNNELS[0], TUNNELS[6]] },
  { week: 'Sett. 3 (19–25 Mag)', tunnels: [TUNNELS[4]] },
  { week: 'Sett. 4 (26–31 Mag)', tunnels: [TUNNELS[8], TUNNELS[2]] },
  { week: 'Giugno 2026',          tunnels: [TUNNELS[7], TUNNELS[9], TUNNELS[5]] },
]

export default function ScheduleView() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', background: '#f7f8fa' }}>
      <div style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Piano di manutenzione</div>
          <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Generato dall'AI — basato su CDA, trend e priorità</div>
        </div>

        {weeks.map(({ week, tunnels }) => (
          <div key={week} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#6b7280" strokeWidth="2">
                <rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M8 4v4M12 4v4"/>
              </svg>
              {week}
            </div>
            {tunnels.map(t => (
              <div key={t.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{t.road} · {t.len} km · {t.defects} difetti attivi</div>
                </div>
                <SevBadge level={t.cda} />
                <TrendChip trend={t.trend} />
                <div style={{ background: '#f3f4f6', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#374151' }}>Est. 2–3 gg</div>
                <button style={{ padding: '6px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, fontSize: 13, color: '#1d4ed8', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
                  Conferma →
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
