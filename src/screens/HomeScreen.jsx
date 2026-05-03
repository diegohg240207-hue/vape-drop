import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, fmt, adminWaLink } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import AppHeader from '../components/AppHeader'
import BottomNav from '../components/BottomNav'
import ProductImg from '../components/ProductImg'
import Logo from '../components/Logo'
const logo = '/logo_vapedrop.png'

function BundlesSection({ bundles, products }) {
  const [added, setAdded] = useState({})
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const active = bundles.filter(b => b.active)
  if (!active.length) return null

  const handleAdd = (b) => {
    b.bundle_items?.forEach(item => {
      const p = products.find(p => p.id === item.product_id)
      if (p) for (let i = 0; i < item.quantity; i++) addToCart(p)
    })
    setAdded(a => ({ ...a, [b.id]: true }))
    setTimeout(() => setAdded(a => ({ ...a, [b.id]: false })), 1400)
  }

  return (
    <div style={{ padding: '8px 20px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>Ofertas especiales</div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: '#f0f0ff' }}>Combos 🎁</h2>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {active.map((b, idx) => (
          <div key={b.id} style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.14) 0%, rgba(6,182,255,0.08) 100%)',
            border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: 16, overflow: 'hidden', position: 'relative',
            animation: `fadeSlideUp 0.35s ease ${idx * 0.08}s both`,
          }}>
            <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(6,182,255,0.07)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ flex: 1, paddingRight: 12 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 16, color: '#f0f0ff', marginBottom: 4 }}>{b.name}</div>
                <div style={{ fontSize: 11, color: '#8888b0', lineHeight: 1.5 }}>{b.description}</div>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: 'var(--blue)' }}>{fmt(b.price)}</div>
              </div>
            </div>
            <button onClick={() => handleAdd(b)} style={{
              width: '100%', background: added[b.id] ? '#10b981' : 'var(--grad)',
              border: 'none', borderRadius: 10, padding: '11px',
              color: 'white', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: added[b.id] ? '0 4px 16px rgba(16,185,129,0.4)' : '0 4px 16px rgba(139,92,246,0.35)',
            }}>
              {added[b.id] ? '✓ Agregado al carrito' : 'Comprar bundle →'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomeScreen() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [added, setAdded] = useState({})
  const [products, setProducts] = useState([])
  const [bundles, setBundles] = useState([])

  useEffect(() => {
    supabase.from('products').select('*').eq('active', true).order('created_at').then(({ data }) => data && setProducts(data))
    supabase.from('bundles').select('*, bundle_items(*)').eq('active', true).then(({ data }) => data && setBundles(data))
  }, [])

  const handleAdd = (p) => {
    addToCart(p)
    setAdded(a => ({ ...a, [p.id]: true }))
    setTimeout(() => setAdded(a => ({ ...a, [p.id]: false })), 1200)
  }

  const featured = products.slice(0, 4)

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 80, maxWidth: 480, margin: '0 auto', animation: 'fadeSlideUp 0.3s ease' }}>
      <AppHeader showAdmin />

      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, #0d0d22 0%, #080812 60%)', paddingBottom: 32 }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 0 16px', position: 'relative', zIndex: 1 }}>
          <div style={{ filter: 'drop-shadow(0 8px 32px rgba(139,92,246,0.45))', animation: 'logoFloat 4s ease-in-out infinite' }}>
            <img src={logo} alt="VAPE DROP" style={{ width: 'min(240px,64vw)', height: 'auto', display: 'block', borderRadius: 18 }} onError={e => { e.target.style.display = 'none' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: '#6ee7b7', fontWeight: 700, letterSpacing: 1 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            SERVICIO ACTIVO — ENTREGA HOY
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '0 24px 24px', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 'clamp(28px,8vw,36px)', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 10, color: '#f0f0ff' }}>
            Compra <span className="grad-text">rápido</span>,<br />recibe <span className="grad-text">discreto</span>
          </h1>
          <p style={{ color: '#7878a8', fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>
            Sin contacto. Sin historial. Tu vapeador favorito llega a tu puerta en minutos.
          </p>
          <button onClick={() => navigate('/catalog')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--grad)', border: 'none', borderRadius: 14, padding: '15px 36px',
            color: 'white', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, letterSpacing: 0.3, cursor: 'pointer',
            boxShadow: '0 6px 32px rgba(139,92,246,0.5)',
          }}>
            Comprar ahora
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {[
          { ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, val: '< 45 min', lab: 'Entrega' },
          { ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, val: 'Anónimo', lab: 'Sin registro' },
          { ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, val: 'Express', lab: 'Sin contacto' },
        ].map((item, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '14px 8px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            {item.ic}
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, color: '#e0e0f5' }}>{item.val}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{item.lab}</div>
          </div>
        ))}
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ padding: '24px 20px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--purple)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>Más vendidos</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: '#f0f0ff' }}>Top Vapes 🔥</h2>
          </div>
          <button onClick={() => navigate('/catalog')} style={{
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: 10, padding: '7px 14px', color: 'var(--purple)',
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, cursor: 'pointer',
          }}>Ver todos</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {featured.map((p, idx) => (
            <div key={p.id} style={{
              background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              animation: `fadeSlideUp 0.35s ease ${idx * 0.07}s both`,
            }}>
              <ProductImg product={p} h={110} />
              <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ fontSize: 9, color: 'var(--purple)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{p.brand}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: '#e8e8f5', lineHeight: 1.2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>{p.puffs} · {p.flavor}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 15, color: 'var(--blue)' }}>{fmt(p.price)}</span>
                  <button onClick={() => handleAdd(p)} style={{
                    background: added[p.id] ? '#10b981' : 'var(--grad)',
                    border: 'none', borderRadius: 8, width: 28, height: 28,
                    color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{added[p.id] ? '✓' : '+'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONVERSION BANNER */}
      <div style={{ padding: '20px 20px 8px' }}>
        <div style={{ borderRadius: 18, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(6,182,255,0.14) 100%)', border: '1px solid rgba(139,92,246,0.3)', padding: '20px 20px' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(6,182,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>⚡ Disponible hoy</div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: '#f0f0ff', lineHeight: 1.2, marginBottom: 6 }}>En tu zona,<br />en minutos</div>
          <div style={{ fontSize: 12, color: '#8888b0', marginBottom: 16 }}>Pedido listo en menos de 45 min</div>
          <button onClick={() => navigate('/catalog')} style={{
            background: 'var(--grad)', border: 'none', borderRadius: 11, padding: '11px 22px',
            color: 'white', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(139,92,246,0.4)',
          }}>Pedir ahora →</button>
        </div>
      </div>

      {/* BUNDLES */}
      <BundlesSection bundles={bundles} products={products} />

      {/* HOW IT WORKS */}
      <div style={{ padding: '24px 20px 20px' }}>
        <div style={{ fontSize: 10, color: 'var(--purple)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Simple y rápido</div>
        <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color: '#f0f0ff', marginBottom: 20 }}>¿Cómo funciona?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { n: '01', t: 'Elige tu vape', d: 'Explora el catálogo y agrega al carrito', ic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
            { n: '02', t: 'Paga en línea', d: 'Tarjeta, transferencia o efectivo', ic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> },
            { n: '03', t: 'Recibe tu pedido', d: 'Entrega sin contacto, directo a ti', ic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: i < 2 ? 22 : 0, position: 'relative' }}>
              {i < 2 && <div style={{ position: 'absolute', left: 17, top: 38, width: 2, bottom: 0, background: 'var(--border)' }} />}
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>{s.ic}</div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15, color: '#e8e8f5', marginBottom: 3 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
        <Logo size={22} />
        <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
          Entrega anónima · Rápida · Discreta<br />
          <span style={{ color: '#404058' }}>© 2026 VAPE DROP. Todos los derechos reservados.</span>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
