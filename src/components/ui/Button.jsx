export default function Button({ children, variant = 'primary', size = 'md', onClick, disabled, loading, fullWidth, type = 'button', style = {}, ...props }) {
  const isDisabled = disabled || loading
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '.45rem',
    fontFamily: "'Outfit', sans-serif", fontWeight: 600, cursor: isDisabled ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: 'var(--radius)', transition: 'all var(--transition)',
    opacity: isDisabled ? 0.5 : 1, whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : undefined,
  }
  const sizes = {
    xs: { fontSize: '11px', padding: '.25rem .6rem' },
    sm: { fontSize: '13px', padding: '.4rem .85rem' },
    md: { fontSize: '14px', padding: '.55rem 1.2rem' },
    lg: { fontSize: '16px', padding: '.75rem 1.75rem' },
  }
  const variants = {
    primary: {
      background: 'linear-gradient(135deg,var(--purple),#7c3aed)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(139,92,246,.35)',
    },
    ghost: {
      background: 'rgba(139,92,246,.1)',
      color: 'var(--purple-l)',
      border: '1px solid rgba(139,92,246,.25)',
    },
    danger: {
      background: 'rgba(239,68,68,.15)',
      color: '#ef4444',
      border: '1px solid rgba(239,68,68,.3)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      style={{ ...base, ...sizes[size] || sizes.md, ...variants[variant] || variants.primary, ...style }}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  )
}
