import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import Button from '../components/ui/Button'

export default function Cart() {
  const { items, total, count, removeItem, changeQty, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100dvh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', color: 'var(--text-muted)', padding: '2rem' }}>
        <div style={{ fontSize: '3.5rem' }}>🛒</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>Tu carrito está vacío</h2>
        <p style={{ fontSize: '14px' }}>Agrega productos para continuar</p>
        <Link to="/catalog"><Button variant="primary">Ver catálogo</Button></Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 1.25rem 5rem', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, marginBottom: '1.5rem' }}>
        Mi carrito <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>({count} productos)</span>
      </h1>

      <div className="cart-grid">
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '1rem',
              display: 'flex', gap: '.85rem', alignItems: 'center',
            }}>
              <div style={{ width: 64, height: 64, borderRadius: 10, background: 'var(--bg3)', overflow: 'hidden', flexShrink: 0 }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>💨</div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                {item.flavor && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '.3rem' }}>🍬 {item.flavor}</p>}
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>${item.price?.toLocaleString('es-MX')} c/u</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.5rem', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ${(item.price * item.qty).toLocaleString('es-MX')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  <button onClick={() => changeQty(item.id, -1)} style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center', fontSize: '14px' }}>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)}  style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
                <button onClick={() => removeItem(item.id)} style={{ color: '#f87171', fontSize: '12px', padding: '.1rem' }}>Quitar</button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '.5rem' }}>
            <Button variant="danger" size="sm" onClick={clearCart}>Vaciar carrito</Button>
          </div>
        </div>

        {/* Resumen */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', position: 'sticky', top: 80 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Resumen de orden</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', marginBottom: '1.25rem', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal ({count} items)</span>
              <span>${total.toLocaleString('es-MX')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px' }}>
              <span>Envío</span>
              <span>Calculado en checkout</span>
            </div>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
              <span>Total</span>
              <span style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ${total.toLocaleString('es-MX')}
              </span>
            </div>
          </div>
          <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
            Finalizar compra →
          </Button>
          <Link to="/catalog" style={{ display: 'block', textAlign: 'center', marginTop: '.85rem', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
