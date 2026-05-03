import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import StatusBadge from '../components/StatusBadge'

export default function ConfirmationScreen() {
  const { orderNum } = useParams()
  const navigate = useNavigate()
  const code = useMemo(() => Math.random().toString(36).slice(2, 8).toUpperCase(), [])

  return (
    <div style={{
      minHeight: '100dvh', maxWidth: 480, margin: '0 auto',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24, textAlign: 'center',
    }}>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Animated checkmark */}
      <div style={{
        width: 90, height: 90, borderRadius: '50%',
        background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        animation: 'glow 2s ease-in-out infinite', boxShadow: '0 0 40px rgba(16,185,129,0.2)',
        position: 'relative', zIndex: 1,
      }}>
        <svg width="44" height="44" viewBox="0 0 50 50" fill="none">
          <polyline
            points="10,28 20,38 40,16"
            stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="50" strokeDashoffset="0"
            style={{ animation: 'checkmark 0.6s ease 0.2s both' }}
          />
        </svg>
      </div>

      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 28, marginBottom: 8, animation: 'fadeSlideUp 0.4s ease 0.3s both', opacity: 0, position: 'relative', zIndex: 1 }}>
        Pedido confirmado
      </div>
      <div style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 32, animation: 'fadeSlideUp 0.4s ease 0.4s both', opacity: 0, position: 'relative', zIndex: 1 }}>
        Tu pedido está siendo preparado para entrega discreta
      </div>

      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
        padding: 20, width: '100%', maxWidth: 320, marginBottom: 24,
        animation: 'fadeSlideUp 0.4s ease 0.5s both', opacity: 0, position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Número de pedido</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, color: 'var(--purple)' }}>{orderNum}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Estado</div>
            <StatusBadge status="pagado" />
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Código de entrega</div>
          <div style={{
            background: 'var(--surface)', borderRadius: 10, padding: '12px 16px',
            fontFamily: 'monospace', fontSize: 22, fontWeight: 700, letterSpacing: 4,
            backgroundImage: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}>{code}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Muestra este código al recibir</div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13, marginBottom: 32,
        animation: 'fadeSlideUp 0.4s ease 0.6s both', opacity: 0, position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        Entrega estimada en 25–45 minutos
      </div>

      <button onClick={() => navigate('/home')} style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '13px 28px', color: 'var(--text)', fontFamily: 'Space Grotesk',
        fontWeight: 700, fontSize: 14, cursor: 'pointer',
        animation: 'fadeSlideUp 0.4s ease 0.7s both', opacity: 0, position: 'relative', zIndex: 1,
      }}>Volver al inicio</button>
    </div>
  )
}
