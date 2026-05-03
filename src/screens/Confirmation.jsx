import { useParams, Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function Confirmation() {
  const { orderId } = useParams()
  const shortId = orderId?.slice(0, 8).toUpperCase()

  return (
    <div style={{
      minHeight: 'calc(100dvh - 64px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.25rem', textAlign: 'center',
    }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, width: '100%' }}>
        {/* Icon */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
          ✓
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2.25rem)', fontWeight: 800, marginBottom: '.75rem' }}>
          ¡Pedido confirmado!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          Tu pedido fue recibido. Te contactaremos pronto con los detalles de entrega.
        </p>

        {/* Order ID */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.4rem' }}>Número de pedido</p>
          <p style={{ fontFamily: "'Space Grotesk'", fontSize: '1.5rem', fontWeight: 800, letterSpacing: '.06em', background: 'linear-gradient(135deg,var(--purple-l),var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            #{shortId}
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '2rem', textAlign: 'left' }}>
          {[
            ['✅', 'Pedido recibido'],
            ['🔄', 'En proceso de preparación'],
            ['📦', 'Enviado / Drop listo'],
            ['🎉', 'Entregado'],
          ].map(([icon, text], i) => (
            <div key={i} style={{ display: 'flex', gap: '.75rem', alignItems: 'center', padding: '.6rem .85rem', background: i === 0 ? 'rgba(34,197,94,.08)' : 'var(--bg2)', borderRadius: 'var(--radius)', border: `1px solid ${i === 0 ? 'rgba(34,197,94,.2)' : 'var(--border)'}` }}>
              <span>{icon}</span>
              <span style={{ fontSize: '13px', color: i === 0 ? '#4ade80' : 'var(--text-muted)', fontWeight: i === 0 ? 600 : 400 }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/catalog"><Button variant="primary">Seguir comprando</Button></Link>
          <Link to="/home"><Button variant="ghost">Ir al inicio</Button></Link>
        </div>
      </div>
    </div>
  )
}
