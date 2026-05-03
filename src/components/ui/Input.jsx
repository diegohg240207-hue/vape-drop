export default function Input({ label, error, style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      <input
        style={{
          background: 'var(--bg3)', border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
          borderRadius: 'var(--radius)', padding: '.6rem .9rem', color: 'var(--text)',
          fontSize: '14px', fontFamily: "'Outfit', sans-serif", outline: 'none',
          transition: 'border-color var(--transition)',
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: '#f87171' }}>{error}</span>}
    </div>
  )
}
