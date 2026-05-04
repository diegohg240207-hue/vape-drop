import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import Button from './ui/Button'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, changeQty } = useCart()
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const navigate = useNavigate()

  const drawerWidth = typeof window !== 'undefined' ? Math.min(420, window.innerWidth) : 420

  return (
    <>
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
          }}
        />
      )}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 201,
        width: drawerWidth,
        background: 'var(--bg2)', borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .28s cubic-bezier(.4,0,.2,1)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
            🛒 Carrito
            {count > 0 && <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '.4rem' }}>({count})</span>}
          </h2>
          <button
            onClick={closeCart}
            style={{ color: 'var(--text-muted)', fontSize: '1.25rem', padding: '.25rem .5rem', borderRadius: 8, minHeight: 36 }}
          >✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🛒</div>
              <p style={{ fontSize: '14px' }}>Tu carrito está vacío</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{
              display: 'flex', gap: '.75rem', alignItems: 'center',
              background: 'var(--bg3)', borderRadius: 'var(--radius)',
              padding: '.75rem', border: '1px solid var(--border)',
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 8, background: 'var(--bg)', overflow: 'hidden', flexShrink: 0 }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💨</div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '.15rem' }}>{item.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>${item.price?.toLocaleString('es-MX')} c/u</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  <button
                    onClick={() => changeQty(item.id, -1)}
                    style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >−</button>
                  <span style={{ fontSize: '13px', fontWeight: 700, minWidth: 22, textAlign: 'center' }}>{item.qty}</span>
                  <button
                    onClick={() => changeQty(item.id, 1)}
                    style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >+</button>
                </div>
                <button onClick={() => removeItem(item.id)} style={{ color: '#f87171', fontSize: '11px', padding: '.1rem' }}>Quitar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '.75rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700 }}>
              <span>Subtotal</span>
              <span style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ${total.toLocaleString('es-MX')}
              </span>
            </div>
            <Button variant="primary" style={{ width: '100%' }} onClick={() => { closeCart(); navigate('/checkout') }}>
              Ir al checkout →
            </Button>
            <Button variant="ghost" style={{ width: '100%' }} onClick={() => { closeCart(); navigate('/cart') }}>
              Ver carrito completo
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
