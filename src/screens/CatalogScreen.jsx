import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, fmt } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import AppHeader from '../components/AppHeader'
import BottomNav from '../components/BottomNav'
import ProductImg from '../components/ProductImg'

export default function CatalogScreen() {
  const navigate = useNavigate()
  const { addToCart, cart } = useCart()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [added, setAdded] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at')
      .then(({ data }) => {
        if (data) setProducts(data)
        setLoading(false)
      })
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.flavor || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (product) => {
    addToCart(product)
    setAdded(a => ({ ...a, [product.id]: true }))
    setTimeout(() => setAdded(a => ({ ...a, [product.id]: false })), 1200)
  }

  const inCart = (id) => cart.find(i => i.id === id)

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 80, maxWidth: 480, margin: '0 auto', animation: 'fadeSlideUp 0.3s ease' }}>
      <AppHeader onBack backTo="/home" />

      {/* Sticky search bar */}
      <div style={{
        position: 'sticky', top: 90, zIndex: 40,
        background: 'rgba(7,7,14,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '12px 20px 10px',
      }}>
        <div style={{ position: 'relative' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto, marca o sabor..."
            style={{
              width: '100%', background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '9px 12px 9px 36px', color: 'var(--text)',
              fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--purple)'}
            onBlur={e => e.target.style.borderColor = ''}
          />
        </div>
      </div>

      {/* Products grid */}
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {loading ? (
          <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <div style={{ width: 28, height: 28, border: '2px solid var(--border)', borderTopColor: 'var(--purple)', borderRadius: '50%', animation: 'spin 0.6s linear infinite', margin: '0 auto 12px' }} />
            Cargando...
          </div>
        ) : filtered.map((p, idx) => (
          <div key={p.id} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            animation: `fadeSlideUp 0.3s ease ${idx * 0.05}s both`,
          }}>
            <div style={{ position: 'relative' }}>
              <ProductImg product={p} h={120} />
              {p.stock <= 5 && (
                <span style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(244,63,94,0.9)', color: 'white', borderRadius: 6, fontSize: 9, fontWeight: 700, padding: '2px 6px' }}>ÚLTIMAS</span>
              )}
              {inCart(p.id) && (
                <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(16,185,129,0.9)', color: 'white', borderRadius: 6, fontSize: 9, fontWeight: 700, padding: '2px 6px' }}>EN CARRITO</span>
              )}
            </div>
            <div style={{ padding: '10px 10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 9, color: 'var(--purple)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{p.brand}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>{p.name}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{p.puffs}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 6 }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 15, color: 'var(--blue)' }}>{fmt(p.price)}</span>
                <button onClick={() => handleAdd(p)} style={{
                  background: added[p.id] ? 'var(--success)' : 'var(--grad)',
                  border: 'none', borderRadius: 8, padding: '5px 10px',
                  color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {added[p.id] ? '✓' : '+'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Sin resultados para "{search}"</div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
