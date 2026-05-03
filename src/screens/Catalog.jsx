import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const CATEGORIES = ['Frutas', 'Menta', 'Bebidas', 'Postres', 'Otros']
const PUFF_RANGES = [
  { label: 'Todos',         min: 0,     max: 0     },
  { label: 'Hasta 1,000',  min: 0,     max: 1000  },
  { label: '1,000–5,000',  min: 1000,  max: 5000  },
  { label: '5,000–10,000', min: 5000,  max: 10000 },
  { label: '10,000+',      min: 10000, max: 0     },
]

function FilterBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      display: 'block', width: '100%', textAlign: 'left',
      padding: '.45rem .75rem', borderRadius: 'var(--radius)',
      background: active ? 'rgba(139,92,246,.12)' : 'none',
      color: active ? 'var(--purple-l)' : 'var(--text-muted)',
      border: 'none', cursor: 'pointer', fontSize: '13px',
      fontWeight: active ? 600 : 400,
      transition: 'all var(--transition)', marginBottom: '.1rem',
      minHeight: 36,
    }}>
      {children}
    </button>
  )
}

export default function Catalog() {
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [puffRange, setPuffRange] = useState(0)
  const [sort,      setSort]      = useState('newest')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const range = PUFF_RANGES[puffRange]
  const filters = {
    ...(category && { category }),
    ...(range.min > 0 && { minPuffs: range.min }),
    ...(range.max > 0 && { maxPuffs: range.max }),
    ...(search      && { search }),
  }

  const { products, loading } = useProducts(filters)

  const visible = [...products].sort((a, b) => {
    if (sort === 'price_asc')  return a.price - b.price
    if (sort === 'price_desc') return b.price - a.price
    if (sort === 'puffs')      return b.puffs - a.puffs
    return 0
  })

  const clearFilters = () => { setSearch(''); setCategory(''); setPuffRange(0); setSort('newest') }
  const hasFilters   = search || category || puffRange > 0

  const sidebarContent = (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Input placeholder="Buscar vape..." value={search} onChange={e => setSearch(e.target.value)} />

      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.5rem' }}>Categoría</p>
        {['', ...CATEGORIES].map(c => (
          <FilterBtn key={c} active={category === c} onClick={() => setCategory(c)}>
            {c || 'Todas'}
          </FilterBtn>
        ))}
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.5rem' }}>Puffs</p>
        {PUFF_RANGES.map((r, i) => (
          <FilterBtn key={i} active={puffRange === i} onClick={() => setPuffRange(i)}>
            {r.label}
          </FilterBtn>
        ))}
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.5rem' }}>Ordenar</p>
        {[['newest','Más recientes'],['price_asc','Precio ↑'],['price_desc','Precio ↓'],['puffs','Más puffs']].map(([v, l]) => (
          <FilterBtn key={v} active={sort === v} onClick={() => setSort(v)}>{l}</FilterBtn>
        ))}
      </div>

      {hasFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>Limpiar filtros</Button>
      )}
    </div>
  )

  return (
    <div style={{ padding: '2rem 1.25rem 4rem', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '.75rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800 }}>Catálogo</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '.2rem' }}>
            {loading ? 'Cargando...' : `${visible.length} productos`}
          </p>
        </div>
        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="filter-toggle"
          style={{
            display: 'none', alignItems: 'center', gap: '.5rem',
            padding: '.5rem 1rem', borderRadius: 'var(--radius)',
            background: hasFilters ? 'rgba(139,92,246,.15)' : 'var(--bg2)',
            border: `1px solid ${hasFilters ? 'var(--purple)' : 'var(--border)'}`,
            color: hasFilters ? 'var(--purple-l)' : 'var(--text)',
            fontSize: '14px', fontWeight: 600, minHeight: 40,
          }}
        >
          🔍 Filtros {hasFilters && '•'}
        </button>
      </div>

      <div className="catalog-layout">
        {/* Sidebar */}
        <aside className="catalog-sidebar">
          {/* Desktop: always visible */}
          <div className="sidebar-desktop">{sidebarContent}</div>
          {/* Mobile: collapsible */}
          <div className="sidebar-mobile" style={{ display: 'none' }}>
            <div className={`catalog-sidebar-inner ${sidebarOpen ? 'open' : ''}`}>
              {sidebarContent}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
              {Array(8).fill(0).map((_, i) => (
                <div key={i} style={{ height: 320, background: 'var(--bg2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', opacity: .4, animation: 'pulse 1.5s ease infinite' }} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🔍</div>
              <p style={{ fontSize: '15px' }}>No se encontraron productos</p>
              {hasFilters && <Button variant="ghost" size="sm" style={{ marginTop: '1rem' }} onClick={clearFilters}>Limpiar filtros</Button>}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem' }}>
              {visible.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .filter-toggle { display: flex !important; }
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile { display: block !important; }
        }
      `}</style>
    </div>
  )
}
