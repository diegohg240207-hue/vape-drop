import { STATUS_LABEL, STATUS_COLORS } from '../lib/supabase'

export default function StatusBadge({ status }) {
  const label = STATUS_LABEL[status] || status
  const color = STATUS_COLORS[status] || '#8b5cf6'
  return (
    <span style={{
      background: `${color}22`, color,
      border: `1px solid ${color}44`, borderRadius: 20,
      padding: '3px 10px', fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}
