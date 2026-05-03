import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fmt } from '../lib/supabase'
import AppHeader from '../components/AppHeader'
import BottomNav from '../components/BottomNav'
import ProductImg from '../components/ProductImg'

export default function CartScreen() {
  const navigate = useNavigate()
  const { cart, cartCount, cartTotal, updateQty, removeItem } = useCart()

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 80, maxWidth: 480, margin: '0 auto', animation: 'fadeSlideUp 0.3s ease' }}>
      <AppHeader onBack backTo="/catalog" />

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: 16, margin: '0 auto 16px' }}>
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Carrito vacío</div>
          <div style={{ fontSize: 14, marginBottom: 24 }}>Agrega productos para continuar</div>
          <button onClick={() => navigate('/catalog')} style={{
            background: 'var(--grad)', border: 'none', borderRadius: 12, padding: '12px 24px',
            color: 'white', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>Ver catálogo</button>
        </div>
      ) : (
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {cart.map(item => (
              <div key={item.id} style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
                display: 'flex', gap: 12, padding: 12, alignItems: 'center',
                animation: 'fadeSlideIn 0.25s ease',
              }}>
                <div style={{ width: 60, flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
                  <ProductImg product={item} h={60} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: 'var(--purple)', fontWeight: 600, letterSpacing: 1 }}>{item.brand}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 14, color: 'var(--blue)' }}>{fmt(item.price)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <button onClick={() => removeItem(item.id)} style={{ color: 'var(--muted)', fontSize: 16, padding: 2 }}>✕</button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{
                      width: 26, height: 26, borderRadius: 8, background: 'var(--surface)',
                      border: '1px solid var(--border)', color: 'var(--text)', fontSize: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>−</button>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{
                      width: 26, height: 26, borderRadius: 8, background: 'var(--grad)',
                      border: 'none', color: 'white', fontSize: 16, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--muted)', fontSize: 14 }}>
              <span>Subtotal ({cartCount} items)</span><span>{fmt(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--muted)', fontSize: 14 }}>
              <span>Envío</span><span style={{ color: 'var(--success)' }}>Gratis</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: 'var(--purple)' }}>{fmt(cartTotal)}</span>
            </div>
          </div>

          <button onClick={() => navigate('/checkout')} style={{
            width: '100%', background: 'var(--grad)', border: 'none', borderRadius: 14,
            padding: '16px', color: 'white', fontFamily: 'Space Grotesk', fontWeight: 700,
            fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 24px rgba(139,92,246,0.4)',
          }}>
            Proceder al pago →
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
