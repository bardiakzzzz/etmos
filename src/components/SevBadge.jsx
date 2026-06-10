import { SEV_BG, SEV_TEXT, SEV_LABELS } from '../data'

export default function SevBadge({ level, size = 'sm' }) {
  const s = size === 'sm'
    ? { fontSize: 11, padding: '2px 8px', borderRadius: 99 }
    : { fontSize: 13, padding: '3px 12px', borderRadius: 99 }
  return (
    <span style={{ ...s, background: SEV_BG[level], color: SEV_TEXT[level], fontWeight: 600, whiteSpace: 'nowrap' }}>
      {SEV_LABELS[level]}
    </span>
  )
}
