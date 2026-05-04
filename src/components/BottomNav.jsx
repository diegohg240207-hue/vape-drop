import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

const items = [
  {
    path: '/home', label: 'Inicio',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  },
  {
    path: '/catalog', label: 'Tienda',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  },
  {
    path: '/cart', label: 'Carrito',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>,
  },
  {
    path: '/admin', label: 'Admin',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { items: cartItems } = useCart()
  const count = cartItems.reduce((sum, i) => sum + i.qty, 0)

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480, display: 'flex',
      background: 'rgba(7,7,14,0.96)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)', padding: '8px 0 12px', zIndex: 100,
    }}>
      {items.map(item => {
        const active = pathname === item.path || (item.path === '/home' && pathname === '/')
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: active ? 'var(--purple)' : 'var(--muted)',
              transition: 'color 0.2s', position: 'relative',
            }}
          >
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>{item.label}</span>
            {item.path === '/cart' && count > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: 'calc(50% - 18px)',
                background: 'var(--grad)', color: 'white', borderRadius: 10,
                fontSize: 9, fontWeight: 700, padding: '1px 5px', minWidth: 16, textAlign: 'center',
                boxShadow: '0 0 8px rgba(139,92,246,0.6)',
              }}>{count}</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
