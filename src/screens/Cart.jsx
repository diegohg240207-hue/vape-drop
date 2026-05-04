import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

export default function Cart() {
  const { items, total, count, removeItem, changeQty, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100dvh - 90px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', paddingBottom: 88 }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.2, marginBottom: 16 }}>
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
        </svg>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Carrito vacío</p>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, marginBottom: 20 }}>Agrega productos para continuar</p>
        <button
          onClick={() => navigate('/catalog')}
          style={{ padding: '12px 28px', borderRadius: 14, background: 'var(--grad)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' }}
        >Ver catálogo →</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px 20px 88px' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>Mi carrito</p>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2, marginBottom: 16 }}>{count} {count === 1 ? 'producto' : 'productos'}</p>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 8, background: 'var(--surface)', overflow: 'hidden', flexShrink: 0 }}>
              {item.image_url
                ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>💨</div>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {item.brand && <p style={{ fontSize: 9, fontWeight: 600, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: 1 }}>{item.brand}</p>}
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--blue)', marginTop: 3 }}>${(item.price * item.qty).toLocaleString('es-MX')}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <button onClick={() => removeItem(item.id)} style={{ fontSize: 16, color: 'var(--muted)', padding: 2, cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => changeQty(item.id, -1)} style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>−</button>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => changeQty(item.id, 1)} style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--grad)', border: 'none', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clear cart */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={clearCart} style={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer', background: 'none', border: 'none', padding: '4px 0' }}>Vaciar carrito</button>
      </div>

      {/* Summary */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
          <span style={{ color: 'var(--muted)' }}>Subtotal ({count} items)</span>
          <span>${total.toLocaleString('es-MX')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
          <span style={{ color: 'var(--muted)' }}>Envío</span>
          {count >= 3
            ? <span style={{ color: '#4ade80', fontWeight: 600 }}>Gratis</span>
            : <span>$50 MXN</span>
          }
        </div>
        {count < 3 && (
          <p style={{ fontSize: 11, color: 'var(--purple-l)', background: 'rgba(139,92,246,0.1)', padding: '5px 10px', borderRadius: 8, marginBottom: 10 }}>
            Agrega {3 - count} producto{3 - count !== 1 ? 's' : ''} más para envío gratis
          </p>
        )}
        <div style={{ height: 1, background: 'var(--border)', margin: '0 0 10px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Total</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--purple)' }}>
            ${(total + (count >= 3 ? 0 : 50)).toLocaleString('es-MX')}
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/checkout')}
        style={{
          width: '100%', marginTop: 14, padding: 15, borderRadius: 14, border: 'none',
          background: 'var(--grad)', color: '#fff', fontFamily: 'var(--font-display)',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(139,92,246,0.4)',
        }}
      >Proceder al pago →</button>
    </div>
  )
}
