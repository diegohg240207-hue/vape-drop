import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'

const CATS = ['Todos', 'Frutas', 'Menta', 'Bebidas', 'Postres', 'Otros']

function ProductCard({ product }) {
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  const inCart = items.some(i => i.id === product.id)
  const handle = () => {
    if (product.stock === 0) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }
  return (
    <div
      style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'all 0.2s', cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ aspectRatio: '1', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>💨</div>
        }
        {product.stock > 0 && product.stock <= 5 && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: 'var(--danger)', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 6, textTransform: 'uppercase' }}>ÚLTIMAS</div>
        )}
        {inCart && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#10b981', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 6 }}>EN CARRITO</div>
        )}
      </div>
      <div style={{ padding: '10px 10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {product.brand && <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: 1 }}>{product.brand}</span>}
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, lineHeight: 1.2, margin: '3px 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</p>
        {product.puffs > 0 && <span style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{product.puffs.toLocaleString()} puffs</span>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: 'var(--blue)' }}>${product.price?.toLocaleString('es-MX')}</span>
          <button
            onClick={handle}
            disabled={product.stock === 0}
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none',
              background: product.stock === 0 ? 'rgba(255,255,255,0.06)' : added ? '#10b981' : 'var(--grad)',
              color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s', flexShrink: 0,
            }}
          >{product.stock === 0 ? '✕' : added ? '✓' : '+'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Catalog() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')

  const filters = {
    ...(category && category !== 'Todos' && { category }),
    ...(search && { search }),
  }
  const { products, loading } = useProducts(filters)

  const visible = [...products].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    if (sort === 'puffs') return b.puffs - a.puffs
    return 0
  })

  return (
    <div style={{ paddingBottom: 88 }}>
      {/* Sticky search+filter header */}
      <div style={{
        position: 'sticky', top: 90, zIndex: 40,
        background: 'rgba(7,7,14,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '12px 20px 10px',
      }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            style={{
              width: '100%', background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '9px 12px 9px 36px', fontSize: 14, color: 'var(--text)',
              outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--purple)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 10, paddingBottom: 2, scrollbarWidth: 'none' }}>
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c === 'Todos' ? '' : c)}
              style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                background: (c === 'Todos' ? !category : category === c) ? 'var(--grad)' : 'var(--card)',
                color: (c === 'Todos' ? !category : category === c) ? '#fff' : 'var(--muted)',
                ...(!(c === 'Todos' ? !category : category === c) && { border: '1px solid var(--border)' }),
              }}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* Sort bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px 0' }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          {loading ? 'Cargando...' : `${visible.length} productos`}
        </span>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, padding: '5px 8px', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}
        >
          <option value="newest">Más recientes</option>
          <option value="price_asc">Precio ↑</option>
          <option value="price_desc">Precio ↓</option>
          <option value="puffs">Más puffs</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ padding: '12px 20px 0' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[0,1,2,3,4,5].map(i => <div key={i} style={{ height: 220, background: 'var(--card)', borderRadius: 14, opacity: 0.4, animation: 'pulse 1.5s infinite' }} />)}
          </div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '4rem', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🔍</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Sin resultados</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {visible.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
