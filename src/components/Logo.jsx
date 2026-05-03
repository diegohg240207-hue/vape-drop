export default function Logo({ size = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <svg width={size} height={size * 1.1} viewBox="0 0 36 40" fill="none">
        <defs>
          <linearGradient id="lgh" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--purple)" />
            <stop offset="1" stopColor="var(--blue)" />
          </linearGradient>
        </defs>
        <path d="M18 2C18 2 4 16 4 26a14 14 0 0028 0C32 16 18 2 18 2z" fill="url(#lgh)" />
        <path d="M11 18l7 14 7-14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <div>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 16, letterSpacing: 1, lineHeight: 1, color: 'var(--text)' }}>
          VAPE DROP
        </div>
        <div style={{ fontSize: 8, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', lineHeight: 1.4 }}>
          Entrega Anónima
        </div>
      </div>
    </div>
  )
}
