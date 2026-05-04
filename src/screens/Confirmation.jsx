import { Link, useParams } from 'react-router-dom'
import { useOrder } from '../hooks/useOrders'

const STATUS_COLORS = { nuevo:'#8b5cf6', en_proceso:'#06b6ff', drop_realizado:'#f59e0b', confirmado:'#10b981', entregado:'#22c55e' }
const STATUS_LABELS = { nuevo:'Nuevo', en_proceso:'En proceso', drop_realizado:'Drop realizado', confirmado:'Confirmado', entregado:'Entregado' }

export default function Confirmation() {
  const { orderId } = useParams()
  const { order, loading } = useOrder(orderId)
  const code = orderId?.slice(-6).toUpperCase() || 'XXXXXX'
  const statusColor = STATUS_COLORS[order?.status] || '#8b5cf6'
  const statusLabel = STATUS_LABELS[order?.status] || 'Nuevo'

  return (
    <div style={{
      minHeight: 'calc(100dvh - 90px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '24px 20px 88px', position: 'relative',
    }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Checkmark */}
      <div style={{
        width: 90, height: 90, borderRadius: '50%',
        background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, animation: 'glow 2s ease-in-out infinite', position: 'relative', zIndex: 1,
      }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="22" cy="22" r="20" opacity="0.3"/>
          <path d="M12 22l8 8 12-14" strokeDasharray="50" style={{ animation: 'checkmark 0.6s ease 0.2s both' }}/>
        </svg>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, animation: 'fadeSlideUp 0.4s ease 0.3s both', opacity: 0, position: 'relative', zIndex: 1 }}>
        Pedido confirmado
      </h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 280, margin: '8px auto 24px', lineHeight: 1.6, animation: 'fadeSlideUp 0.4s ease 0.4s both', opacity: 0, position: 'relative', zIndex: 1 }}>
        Tu pedido está siendo preparado para entrega discreta
      </p>

      {/* Order card */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18,
        width: '100%', maxWidth: 320, marginBottom: 20, zIndex: 1, position: 'relative',
        animation: 'fadeSlideUp 0.4s ease 0.5s both', opacity: 0,
      }}>
        {loading ? (
          <div style={{ height: 80, background: 'var(--surface)', borderRadius: 8, opacity: 0.4, animation: 'pulse 1.5s infinite' }} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>Número de pedido</p>
                <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: 'var(--purple)' }}>
                  {(order?.id || orderId)?.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>Estado</p>
                <span style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
                  {statusLabel}
                </span>
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
            <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6 }}>Código de entrega</p>
            <p className="grad-text" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 24, letterSpacing: 4, textAlign: 'center' }}>{code}</p>
            <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 6 }}>Muestra este código al recibir</p>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 24, zIndex: 1, position: 'relative' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'block', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Entrega estimada en 25–45 minutos</span>
      </div>

      <Link to="/home" style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
        padding: '12px 28px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
        textDecoration: 'none', color: 'var(--text)', zIndex: 1, position: 'relative',
        animation: 'fadeSlideUp 0.4s ease 0.7s both', opacity: 0, display: 'inline-block',
      }}>Volver al inicio</Link>
    </div>
  )
}
