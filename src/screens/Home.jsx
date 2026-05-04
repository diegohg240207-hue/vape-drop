import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFeaturedProducts } from '../hooks/useProducts'
import { useBundles } from '../hooks/useBundles'
import { useCart } from '../hooks/useCart'

const s = {
  section: { padding: '20px' },
  cardBg: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14 },
  label: { fontSize: 10, fontWeight: 700, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: 2 },
  title: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, marginTop: 4 },
}

function MiniCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const handle = () => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1400) }
  return (
    <div style={{ ...s.cardBg, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ aspectRatio: '1', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>💨</div>
        }
        {product.puffs > 0 && (
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--grad)', padding: '3px 6px', borderRadius: '0 14px 0 8px', fontSize: 9, fontWeight: 700, color: '#fff' }}>
            {product.puffs.toLocaleString()}p
          </div>
        )}
      </div>
      <div style={{ padding: '10px 10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {product.brand && <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: 1 }}>{product.brand}</span>}
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, lineHeight: 1.2, margin: '3px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
        {product.flavor && <span style={{ fontSize: 10, color: 'var(--muted)' }}>{product.flavor}</span>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--blue)' }}>${product.price?.toLocaleString('es-MX')}</span>
          <button
            onClick={handle}
            disabled={product.stock === 0}
            style={{
              width: 28, height: 28, borderRadius: 8, border: 'none', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              background: product.stock === 0 ? 'rgba(255,255,255,0.08)' : added ? '#10b981' : 'var(--grad)',
              color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >{product.stock === 0 ? '✕' : added ? '✓' : '+'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { products, loading } = useFeaturedProducts(4)
  const { bundles } = useBundles(false)
  const { addItem } = useCart()
  const navigate = useNavigate()

  const addBundle = (bundle) => {
    bundle.bundle_items?.forEach(item => {
      if (item.products) {
        for (let i = 0; i < item.quantity; i++) addItem(item.products)
      }
    })
  }

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '28px 20px 24px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg,#0d0d22 0%,#080812 60%)' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%)', top: -60, right: -60, filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,255,0.1),transparent 70%)', bottom: -40, left: -40, filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <img
            src="/logo_vapedrop.png"
            alt="VAPE DROP"
            style={{ width: 'min(200px,55vw)', margin: '0 auto 16px', animation: 'logoFloat 4s ease-in-out infinite', filter: 'drop-shadow(0 8px 32px rgba(139,92,246,0.35)) drop-shadow(0 2px 12px rgba(6,182,255,0.25))', borderRadius: 20 }}
            onError={e => { e.target.style.display = 'none' }}
          />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 99, padding: '4px 12px', marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'block', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.5px' }}>SERVICIO ACTIVO — ENTREGA HOY</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(24px,7vw,30px)', lineHeight: 1.15, marginBottom: 10 }}>
            Compra <span className="grad-text">rápido</span>, recibe <span className="grad-text">discreto</span>
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto 20px' }}>
            Sin contacto. Sin historial. Solo tú y tu vape.
          </p>

          <button
            onClick={() => navigate('/catalog')}
            style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none',
              background: 'var(--grad)', color: '#fff', fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 6px 32px rgba(139,92,246,0.4)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 40px rgba(139,92,246,0.5)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 32px rgba(139,92,246,0.4)' }}
          >
            Comprar ahora →
          </button>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ display: 'flex', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {[
          { icon: '⚡', t: '< 45 min', s: 'Entrega' },
          { icon: '🔒', t: 'Anónimo', s: 'Sin registro' },
          { icon: '🚚', t: 'Express', s: 'Sin contacto' },
        ].map((f, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '14px 4px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: 18 }}>{f.icon}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12 }}>{f.t}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{f.s}</span>
          </div>
        ))}
      </section>

      {/* Featured products */}
      <section style={s.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <p style={s.label}>Más vendidos</p>
            <p style={s.title}>Top Vapes 🔥</p>
          </div>
          <Link to="/catalog" style={{
            fontSize: 11, fontWeight: 700, background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '5px 12px', textDecoration: 'none', color: 'var(--text)',
          }}>Ver todos</Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ height: 220, background: 'var(--card)', borderRadius: 14, opacity: 0.4, animation: 'pulse 1.5s infinite' }} />)}
          </div>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: 13 }}>Cargando productos...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {products.map(p => <MiniCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Bundles */}
      {bundles.length > 0 && (
        <section style={{ padding: '0 20px 20px' }}>
          <p style={s.label}>Combos</p>
          <p style={{ ...s.title, marginBottom: 14 }}>Packs especiales 💥</p>
          {bundles.map(b => (
            <BundleCard key={b.id} bundle={b} onAdd={addBundle} />
          ))}
        </section>
      )}

      {/* How it works */}
      <section style={{ ...s.section, background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, marginBottom: 16 }}>¿Cómo funciona?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 17, top: 36, bottom: 36, width: 2, background: 'var(--border)', zIndex: 0 }} />
          {[
            { icon: '🛍️', t: 'Elige tu vape', d: 'Explora el catálogo y agrega al carrito' },
            { icon: '💳', t: 'Paga en línea', d: 'Tarjeta, transferencia o efectivo' },
            { icon: '📦', t: 'Recibe tu pedido', d: 'Entrega sin contacto, directo a ti' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {step.icon}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{step.t}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, marginTop: 2 }}>{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 20, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }} className="grad-text">VAPE DROP</p>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Entrega anónima · Rápida · Discreta</p>
        <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8, opacity: 0.6 }}>© 2026 VAPE DROP. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

function BundleCard({ bundle, onAdd }) {
  const [added, setAdded] = useState(false)
  const handle = () => { onAdd(bundle); setAdded(true); setTimeout(() => setAdded(false), 2000) }
  const names = bundle.bundle_items?.map(i => i.products?.name).filter(Boolean).join(' · ') || ''
  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(139,92,246,0.14) 0%,rgba(6,182,255,0.08) 100%)',
      border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, padding: 14, marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }}>{bundle.name}</p>
          {bundle.description && <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{bundle.description}</p>}
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--blue)', flexShrink: 0, marginLeft: 8 }}>
          ${bundle.price?.toLocaleString('es-MX')}
        </span>
      </div>
      {names && <p style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 8 }}>{names}</p>}
      <button
        onClick={handle}
        style={{
          width: '100%', padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: added ? '#10b981' : 'var(--grad)', color: '#fff',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, transition: 'all 0.3s',
        }}
      >{added ? '✓ Agregado al carrito' : 'Comprar bundle →'}</button>
    </div>
  )
}
