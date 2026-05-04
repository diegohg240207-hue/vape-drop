import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

export default function Navbar() {
  const { count, toggleCart } = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/home' || pathname === '/'

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, height: 58,
      background: 'rgba(13,13,28,0.97)', backdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 16px', gap: 10,
      }}>
        {/* Left: back button or empty */}
        <div style={{ width: 36, flexShrink: 0 }}>
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Volver"
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--card)', border: '1px solid var(--border)',
                color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
        </div>

        {/* Center: logo */}
        <Link to="/home" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
            background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>VAPE DROP</div>
          <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '0.5px', marginTop: 1 }}>
            Entrega Anónima
          </div>
        </Link>

        {/* Right: admin pill + cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 'auto', flexShrink: 0 }}>
          {isHome && (
            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '5px 12px', borderRadius: 20, background: 'var(--card)',
                border: '1px solid var(--border)', fontSize: 11, fontWeight: 600,
                color: 'var(--muted)', cursor: 'pointer',
              }}>Admin</button>
            </Link>
          )}
          <button
            onClick={toggleCart}
            aria-label="Carrito"
            style={{
              width: 36, height: 36, borderRadius: 10, position: 'relative',
              background: 'var(--card)', border: '1px solid var(--border)',
              color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            {count > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--purple)', color: '#fff',
                fontSize: 9, fontWeight: 800, minWidth: 16, height: 16,
                borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px',
              }}>{count}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
