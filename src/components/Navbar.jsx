import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

export default function Navbar() {
  const { count, toggleCart } = useCart()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/home',    label: 'Inicio' },
    { to: '/catalog', label: 'Catálogo' },
    { to: '/cart',    label: 'Carrito' },
  ]

  const linkStyle = (to) => ({
    padding: '.45rem .9rem', borderRadius: 'var(--radius)',
    fontSize: '14px', fontWeight: 500, textDecoration: 'none',
    color: pathname === to ? 'var(--purple-l)' : 'var(--text-muted)',
    background: pathname === to ? 'rgba(139,92,246,.1)' : 'transparent',
    transition: 'all var(--transition)', whiteSpace: 'nowrap',
  })

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 64,
        background: 'rgba(7,7,14,.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Logo */}
          <Link to="/home" style={{
            textDecoration: 'none', fontFamily: 'var(--font-display)',
            fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-.02em',
            background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            flexShrink: 0,
          }}>
            VAPE DROP
          </Link>

          {/* Desktop nav */}
          <nav className="nav-links">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={linkStyle(to)}>{label}</Link>
            ))}
          </nav>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            {/* Cart button */}
            <button
              onClick={toggleCart}
              aria-label="Abrir carrito"
              style={{
                position: 'relative', background: 'rgba(139,92,246,.1)',
                border: '1px solid rgba(139,92,246,.25)', borderRadius: 'var(--radius)',
                padding: '.45rem .75rem', cursor: 'pointer',
                color: 'var(--text)', fontSize: '1rem',
                display: 'flex', alignItems: 'center', gap: '.4rem',
                minHeight: 40, transition: 'all var(--transition)',
              }}
            >
              🛒
              {count > 0 && (
                <span style={{
                  background: 'var(--purple)', color: '#fff',
                  fontSize: '11px', fontWeight: 700, minWidth: 18, height: 18,
                  borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 .25rem',
                }}>
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menú"
              style={{
                display: 'none', flexDirection: 'column', justifyContent: 'center',
                gap: 5, padding: '.5rem', borderRadius: 'var(--radius)',
                background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)',
                minHeight: 40, minWidth: 40,
              }}
              className="hamburger"
            >
              <span style={{ display: 'block', width: 18, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }}/>
              <span style={{ display: 'block', width: 18, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all .2s', opacity: menuOpen ? 0 : 1 }}/>
              <span style={{ display: 'block', width: 18, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all .2s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }}/>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '.5rem',
          animation: 'fadeUp .15s ease',
        }}
          onClick={() => setMenuOpen(false)}
        >
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              ...linkStyle(to), display: 'block', padding: '.75rem 1rem', fontSize: '15px',
            }}>
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* Mobile hamburger show via CSS */}
      <style>{`
        @media (max-width: 600px) {
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
