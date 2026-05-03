const catColors = {
  Desechables: ['#8b5cf6', '#5b21b6'],
}

export default function ProductImg({ product, h = 140 }) {
  const [c1, c2] = catColors[product.category || product.cat] || ['#8b5cf6', '#06b6ff']
  const uid = product.id || Math.random().toString(36).slice(2)
  return (
    <svg width="100%" height={h} viewBox={`0 0 200 ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={c1} stopOpacity="0.25" /><stop offset="1" stopColor={c2} stopOpacity="0.1" />
        </linearGradient>
        <pattern id={`p${uid}`} patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="20" stroke={c1} strokeWidth="1" strokeOpacity="0.12" />
        </pattern>
      </defs>
      <rect width="200" height={h} fill={`url(#p${uid})`} />
      <rect width="200" height={h} fill={`url(#g${uid})`} />
      <rect x="86" y={h * 0.15} width="28" height={h * 0.6} rx="8" fill={c1} fillOpacity="0.35" />
      <rect x="90" y={h * 0.12} width="20" height="8" rx="4" fill={c1} fillOpacity="0.5" />
      <rect x="88" y={h * 0.45} width="24" height="3" rx="1" fill="white" fillOpacity="0.15" />
      <circle cx="100" cy={h * 0.75} r="5" fill={c2} fillOpacity="0.6" />
      <text x="100" y={h - 8} textAnchor="middle" fill={c1} fontSize="9"
        fontFamily="Space Grotesk" opacity="0.6" fontWeight="600">
        {product.flavor || ''}
      </text>
    </svg>
  )
}
