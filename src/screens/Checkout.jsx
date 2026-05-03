import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart }       from '../hooks/useCart'
import { useOrders }     from '../hooks/useOrders'
import { useDropPoints } from '../hooks/useDropPoints'
import { useSettings }   from '../hooks/useSettings'
import Button from '../components/ui/Button'
import Input  from '../components/ui/Input'

const PAYMENT_METHODS = [
  { id: 'tarjeta',       label: 'Tarjeta',       icon: '💳' },
  { id: 'transferencia', label: 'Transferencia',  icon: '🏦' },
  { id: 'efectivo',      label: 'Efectivo',       icon: '💵' },
]

function validate(form, deliveryType) {
  const e = {}
  if (!form.name.trim())                        e.name    = 'Requerido'
  if (!form.email.includes('@'))                e.email   = 'Email inválido'
  if (form.phone.replace(/\D/g,'').length < 8) e.phone   = 'Teléfono inválido'
  if (deliveryType === 'delivery' && !form.address.trim()) e.address = 'Requerido'
  return e
}

export default function Checkout() {
  const { items, total: subtotal, count, clearCart } = useCart()
  const { createOrder, loading } = useOrders()
  const { dropPoints }           = useDropPoints()
  const { settings }             = useSettings()
  const navigate                 = useNavigate()

  const [deliveryType,  setDeliveryType]  = useState('delivery')
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [dropPointId,   setDropPointId]   = useState('')
  const [form,   setForm]   = useState({ name:'', email:'', phone:'', address:'' })
  const [errors, setErrors] = useState({})
  const [payErr, setPayErr] = useState('')

  const shippingCost = count >= 3 ? 0 : (Number(settings?.shipping_price) || 50)
  const totalFinal   = subtotal + shippingCost
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const availablePayments = PAYMENT_METHODS.filter(p =>
    !(deliveryType === 'drop' && p.id === 'efectivo')
  )

  const handleDeliveryChange = (type) => {
    setDeliveryType(type)
    if (type === 'drop' && paymentMethod === 'efectivo') setPaymentMethod('tarjeta')
    setPayErr('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (deliveryType === 'drop' && !dropPointId)           { setPayErr('Selecciona un punto de drop'); return }
    if (deliveryType === 'drop' && paymentMethod === 'efectivo') { setPayErr('Efectivo no disponible para Drop Anónimo'); return }
    const errs = validate(form, deliveryType)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setPayErr('')

    const { order, error } = await createOrder({
      customer: form, items, total: subtotal,
      deliveryType, paymentMethod, shippingCost,
      dropPointId: dropPointId || null,
    })
    if (error) { setPayErr(error); return }
    clearCart()
    navigate('/confirmation/' + order.id)
  }

  if (items.length === 0) { navigate('/cart'); return null }

  const card = {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1rem',
  }
  const sectionLabel = {
    fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
    letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.75rem',
  }

  return (
    <div style={{ padding: '2rem 1.25rem 5rem' }}>
      <div className="container">
        <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 800, marginBottom: '1.75rem' }}>
          Finalizar compra
        </h1>

        <div className="checkout-grid">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Tipo de entrega */}
            <div style={card}>
              <p style={sectionLabel}>Tipo de entrega</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                {[
                  { id: 'delivery', label: 'Envío a domicilio', icon: '🚚', desc: 'Recibe en tu dirección' },
                  { id: 'drop',     label: 'Drop Anónimo',       icon: '📦', desc: 'Retira en punto discreto' },
                ].map(opt => (
                  <button
                    key={opt.id} type="button"
                    onClick={() => handleDeliveryChange(opt.id)}
                    style={{
                      padding: '.85rem', borderRadius: 'var(--radius)', cursor: 'pointer',
                      textAlign: 'left',
                      background: deliveryType === opt.id ? 'rgba(139,92,246,.15)' : 'rgba(255,255,255,.03)',
                      border: `2px solid ${deliveryType === opt.id ? 'var(--purple)' : 'var(--border)'}`,
                      transition: 'all var(--transition)',
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', marginBottom: '.3rem' }}>{opt.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{opt.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drop point */}
            {deliveryType === 'drop' && (
              <div style={card}>
                <p style={sectionLabel}>Punto de Drop</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  {dropPoints.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Cargando puntos...</p>
                  ) : dropPoints.map(dp => (
                    <label key={dp.id} style={{
                      display: 'flex', gap: '.75rem', padding: '.75rem 1rem',
                      borderRadius: 'var(--radius)', cursor: 'pointer',
                      background: dropPointId === dp.id ? 'rgba(139,92,246,.12)' : 'rgba(255,255,255,.03)',
                      border: `1px solid ${dropPointId === dp.id ? 'var(--purple)' : 'var(--border)'}`,
                      transition: 'all var(--transition)',
                    }}>
                      <input
                        type="radio" name="drop" value={dp.id}
                        checked={dropPointId === dp.id}
                        onChange={() => setDropPointId(dp.id)}
                        style={{ marginTop: 3, accentColor: 'var(--purple)' }}
                      />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '14px' }}>{dp.name}</p>
                        {dp.address && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{dp.address}</p>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Datos de contacto */}
            <div style={card}>
              <p style={sectionLabel}>Datos de contacto</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
                <Input label="Nombre completo" placeholder="Juan Pérez" value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} />
                <Input label="Email" type="email" placeholder="juan@email.com" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} />
                <Input label="Teléfono" type="tel" placeholder="+52 55 1234 5678" value={form.phone} onChange={e => set('phone', e.target.value)} error={errors.phone} />
                {deliveryType === 'delivery' && (
                  <Input label="Dirección de entrega" placeholder="Calle, número, colonia..." value={form.address} onChange={e => set('address', e.target.value)} error={errors.address} />
                )}
              </div>
            </div>

            {/* Método de pago */}
            <div style={card}>
              <p style={sectionLabel}>Método de pago</p>
              {deliveryType === 'drop' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.6rem .9rem', background: 'rgba(6,182,255,.08)', border: '1px solid rgba(6,182,255,.2)', borderRadius: 8, marginBottom: '.85rem', fontSize: '12px', color: 'var(--blue)' }}>
                  📦 Drop Anónimo — solo tarjeta o transferencia
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                {availablePayments.map(pm => (
                  <label key={pm.id} style={{
                    display: 'flex', gap: '.75rem', padding: '.75rem 1rem',
                    borderRadius: 'var(--radius)', cursor: 'pointer', alignItems: 'center',
                    background: paymentMethod === pm.id ? 'rgba(139,92,246,.12)' : 'rgba(255,255,255,.03)',
                    border: `1px solid ${paymentMethod === pm.id ? 'var(--purple)' : 'var(--border)'}`,
                    transition: 'all var(--transition)',
                  }}>
                    <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} style={{ accentColor: 'var(--purple)' }} />
                    <span style={{ fontSize: '1.1rem' }}>{pm.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {payErr && (
              <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '1rem', padding: '.7rem .9rem', background: 'rgba(239,68,68,.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,.2)' }}>
                ⚠️ {payErr}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Confirmar pedido →
            </Button>
          </form>

          {/* Resumen */}
          <div className="checkout-summary" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', position: 'sticky', top: 80 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Resumen</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem', marginBottom: '1rem', maxHeight: 240, overflowY: 'auto' }}>
              {items.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {i.name} ×{i.qty}
                  </span>
                  <span style={{ flexShrink: 0 }}>${(i.price * i.qty).toLocaleString('es-MX')}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '.75rem', display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${subtotal.toLocaleString('es-MX')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Envío</span>
                {shippingCost === 0
                  ? <span style={{ color: '#4ade80', fontWeight: 600 }}>GRATIS 🎉</span>
                  : <span>${shippingCost} MXN</span>
                }
              </div>
              {count < 3 && (
                <div style={{ fontSize: '11px', color: 'var(--purple-l)', background: 'rgba(139,92,246,.1)', padding: '.4rem .65rem', borderRadius: 6 }}>
                  Agrega {3 - count} producto{3 - count !== 1 ? 's' : ''} más para envío gratis
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ${totalFinal.toLocaleString('es-MX')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
