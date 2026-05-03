import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import Button from './ui/Button'
import Badge from './ui/Badge'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div
      style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'all var(--transition)', cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(139,92,246,.18)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* Image */}
      <div style={{ aspectRatio: '1', background: 'var(--bg3)', position: 'relative', overflow: 'hidden' }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
            💨
          </div>
        )}
        {product.puffs > 0 && (
          <div style={{ position: 'absolute', top: '.6rem', right: '.6rem' }}>
            <Badge color="purple">{product.puffs.toLocaleString()} puffs</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.5rem', flex: 1 }}>
        {product.brand && (
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {product.brand}
          </span>
        )}
        <h3 style={{ fontSize: '.95rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>{product.name}</h3>
        {product.flavor && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🍬 {product.flavor}</span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '.5rem' }}>
          <span style={{
            fontFamily: "'Space Grotesk'", fontSize: '1.15rem', fontWeight: 800,
            background: 'linear-gradient(135deg,var(--purple-l),var(--blue))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            ${product.price?.toLocaleString('es-MX')}
          </span>
          <Button
            variant={added ? 'ghost' : 'primary'}
            size="sm"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Agotado' : added ? '✓ Agregado' : '+ Agregar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
