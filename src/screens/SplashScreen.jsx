import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const logo = '/logo_vapedrop.png'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/home', { replace: true }), 2600)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'splashFadeIn 0.5s ease both',
    }}>
      {/* BG glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Scanline */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg,transparent,rgba(6,182,255,0.3),transparent)',
        animation: 'scanline 2s linear infinite', zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        width: 'min(280px, 75vw)', marginBottom: 32,
        animation: 'logoFloat 3s ease-in-out infinite',
        filter: 'drop-shadow(0 8px 32px rgba(139,92,246,0.35)) drop-shadow(0 2px 12px rgba(6,182,255,0.25))',
        zIndex: 2,
      }}>
        <img
          src={logo}
          alt="VAPE DROP"
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 20 }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Loading bar */}
      <div style={{
        width: 'min(200px,60vw)', height: 3,
        background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden',
        marginBottom: 16, zIndex: 2,
      }}>
        <div style={{
          height: '100%', background: 'var(--grad)', borderRadius: 4,
          animation: 'loadBar 2.2s cubic-bezier(0.4,0,0.2,1) forwards',
        }} />
      </div>
      <div style={{
        fontSize: 12, color: 'var(--muted)', letterSpacing: 3,
        textTransform: 'uppercase', fontFamily: 'Space Grotesk', fontWeight: 600,
        zIndex: 2,
      }}>
        Iniciando...
      </div>
    </div>
  )
}
