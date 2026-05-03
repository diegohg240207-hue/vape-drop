const COLORS = {
  purple: { bg: 'rgba(139,92,246,.15)', color: '#a78bfa', border: 'rgba(139,92,246,.3)' },
  blue:   { bg: 'rgba(6,182,255,.12)',  color: '#38bdf8', border: 'rgba(6,182,255,.25)' },
  green:  { bg: 'rgba(34,197,94,.12)',  color: '#4ade80', border: 'rgba(34,197,94,.25)' },
  red:    { bg: 'rgba(239,68,68,.12)',  color: '#f87171', border: 'rgba(239,68,68,.25)' },
  gray:   { bg: 'rgba(148,163,184,.1)', color: '#94a3b8', border: 'rgba(148,163,184,.2)' },
  orange: { bg: 'rgba(249,115,22,.12)', color: '#fb923c', border: 'rgba(249,115,22,.25)' },
}

export default function Badge({ children, color = 'purple', style = {} }) {
  const c = COLORS[color] || COLORS.purple
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '.3rem',
      fontSize: '11px', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
      padding: '.2rem .55rem', borderRadius: 99,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      ...style,
    }}>
      {children}
    </span>
  )
}
