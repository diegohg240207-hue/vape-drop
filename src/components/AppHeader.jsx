import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Logo from './Logo'
import TickerBanner from './TickerBanner'

export default function AppHeader({ onBack, backTo, showAdmin }) {
  const navigate = useNavigate()
  const { cartCount } = useCart()

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <TickerBanner />
      <div style={{
        background: 'rgba(13,13,28,0.97)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border)', padding: '0 20px',
        height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button
              onClick={() => navigate(backTo || -1)}
              style={{ color: 'var(--muted)', padding: '6px', marginLeft: -6, borderRadius: 8, display: 'flex', alignItems: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
          )}
          <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <Logo />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showAdmin && (
            <button onClick={() => navigate('/admin')} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '5px 11px', color: 'var(--muted)', fontSize: 11, fontWeight: 600,
            }}>Admin</button>
          )}
          <button
            onClick={() => navigate('/cart')}
            style={{ position: 'relative', padding: 8, color: 'var(--text)', borderRadius: 10 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                background: 'var(--grad)', color: 'white', borderRadius: 8,
                fontSize: 9, fontWeight: 800, padding: '1px 4px', minWidth: 16, textAlign: 'center',
                boxShadow: '0 0 8px rgba(139,92,246,0.5)',
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
