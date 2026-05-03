export default function TickerBanner() {
  const msg = '🚚 Entrega GRATIS a domicilio a partir de 3 piezas  ·  ⚡ Entrega en menos de 45 min  ·  🔒 100% Anónimo  ·  '
  const repeated = msg.repeat(6)
  return (
    <div style={{
      background: 'linear-gradient(90deg, var(--purple) 0%, #06b6ff 100%)',
      height: 32, overflow: 'hidden', display: 'flex', alignItems: 'center',
      position: 'relative', zIndex: 60,
    }}>
      <div style={{
        display: 'flex', whiteSpace: 'nowrap',
        animation: 'ticker 22s linear infinite',
        willChange: 'transform',
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: 0.5,
          fontFamily: 'Space Grotesk', opacity: 0.97,
        }}>{repeated}</span>
      </div>
    </div>
  )
}
