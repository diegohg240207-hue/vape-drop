import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useOrders } from '../hooks/useOrders'
import { useDropPoints } from '../hooks/useDropPoints'
import { useSettings } from '../hooks/useSettings'
import Input from '../components/ui/Input'

const card = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 12 }
const sLabel = { fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }

export default function Checkout() {
  const { items, total: subtotal, count, clearCart } = useCart()
  const { createOrder, loading } = useOrders()
  const { dropPoints } = useDropPoints()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const [deliveryType, setDeliveryType] = useState('delivery')
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [dropPointId, setDropPointId] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', reference: '', cardNum: '', cardExp: '', cardCvv: '', transferRef: '' })
  const [errors, setErrors] = useState({})
  const [payErr, setPayErr] = useState('')

  const shippingCost = count >= 3 ? 0 : (Number(settings?.shipping_price) || 50)
  const totalFinal = subtotal + shippingCost
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  if (items.length === 0) { navigate('/cart'); return null }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Requerido'
    if (!form.email.includes('@')) e.email = 'Email inválido'
    if (form.phone.replace(/\D/g, '').length < 8) e.phone = 'Mínimo 8 dígitos'
    if (deliveryType === 'delivery') {
      if (!form.address.trim()) e.address = 'Requerido'
    } else {
      if (!dropPointId) { setPayErr('Selecciona un punto de Drop'); return null }
    }
    if (paymentMethod === 'tarjeta') {
      if (form.cardNum.replace(/\s/g, '').length < 16) e.cardNum = '16 dígitos requeridos'
      if (!form.cardExp) e.cardExp = 'Requerido'
      if (form.cardCvv.length < 3) e.cardCvv = '3 dígitos'
    }
    if (paymentMethod === 'transferencia' && !form.transferRef.trim()) e.transferRef = 'Requerido'
    return Object.keys(e).length ? e : null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (deliveryType === 'drop' && paymentMethod === 'efectivo') { setPayErr('Efectivo no disponible para Drop Anónimo'); return }
    const errs = validate()
    if (errs) { setErrors(errs); return }
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

  const methodBtn = (id, icon, label) => (
    <button
      key={id} type="button"
      onClick={() => { setPaymentMethod(id); setPayErr('') }}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '10px 8px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
        background: paymentMethod === id ? 'var(--grad)' : 'var(--surface)',
        border: paymentMethod === id ? 'none' : '1px solid var(--border)',
        color: paymentMethod === id ? '#fff' : 'var(--muted)',
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700 }}>{label}</span>
    </button>
  )

  const dropPoint = dropPoints.find(d => d.id === dropPointId)

  return (
    <div style={{ padding: '16px 20px 88px' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Finalizar compra</p>

      <form onSubmit={handleSubmit}>
        {/* Delivery type */}
        <div style={card}>
          <p style={sLabel}>🚚 Tipo de entrega</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { id: 'delivery', icon: '🏠', label: 'A domicilio', sub: 'Gratis desde 3 piezas' },
              { id: 'drop', icon: '📍', label: 'Drop Anónimo', sub: 'Recoge sin contacto' },
            ].map(opt => (
              <button key={opt.id} type="button"
                onClick={() => { setDeliveryType(opt.id); if (opt.id === 'drop' && paymentMethod === 'efectivo') setPaymentMethod('tarjeta'); setPayErr('') }}
                style={{
                  padding: 10, borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
                  background: deliveryType === opt.id ? 'rgba(139,92,246,0.12)' : 'var(--surface)',
                  border: `${deliveryType === opt.id ? '2px' : '1px'} solid ${deliveryType === opt.id ? 'var(--purple)' : 'var(--border)'}`,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{opt.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12 }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{opt.sub}</div>
              </button>
            ))}
          </div>

          {deliveryType === 'delivery' && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Input label="Dirección" placeholder="Calle, número, colonia..." value={form.address} onChange={e => set('address', e.target.value)} error={errors.address} />
              <Input label="Referencia" placeholder="Entre calles, color de fachada..." value={form.reference} onChange={e => set('reference', e.target.value)} />
            </div>
          )}
        </div>

        {/* Drop points */}
        {deliveryType === 'drop' && (
          <div style={card}>
            <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: '#c4b5fd', marginBottom: 6 }}>🔒 Drop Anónimo — ¿Cómo funciona?</p>
              {['📦 Tu pedido será colocado en un punto seguro.','📱 Recibirás una foto por WhatsApp cuando el paquete haya sido entregado.','✅ Podrás confirmar la recepción respondiendo al mismo número.'].map((t, i) => (
                <p key={i} style={{ fontSize: 11, color: '#9090c0', lineHeight: 1.8 }}>{t}</p>
              ))}
            </div>
            <Input label="📱 WhatsApp (10 dígitos) *" type="tel" placeholder="5512345678" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} error={errors.phone} />
            <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, marginBottom: 12 }}>10 dígitos — ej. 5512345678</p>
            <p style={sLabel}>Punto de entrega</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dropPoints.length === 0
                ? <p style={{ fontSize: 13, color: 'var(--muted)' }}>Cargando puntos...</p>
                : dropPoints.map(dp => (
                  <label key={dp.id} style={{
                    display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px',
                    borderRadius: 12, cursor: 'pointer',
                    background: dropPointId === dp.id ? 'rgba(139,92,246,0.12)' : 'var(--surface)',
                    border: `${dropPointId === dp.id ? '2px' : '1px'} solid ${dropPointId === dp.id ? 'var(--purple)' : 'var(--border)'}`,
                    transition: 'all 0.2s',
                  }} onClick={() => setDropPointId(dp.id)}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {dp.name.includes('Hugo') ? '🏟️' : dp.name.includes('Biblioteca') ? '📚' : '⚽'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: dropPointId === dp.id ? '#c4b5fd' : 'var(--text)' }}>{dp.name}</p>
                      {dp.address && <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{dp.address}</p>}
                    </div>
                  </label>
                ))
              }
            </div>
          </div>
        )}

        {/* Contact info */}
        <div style={card}>
          <p style={sLabel}>Datos de contacto</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Input label="Nombre completo" placeholder="Juan Pérez" value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} />
            <Input label="Email" type="email" placeholder="juan@email.com" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} />
            {deliveryType === 'delivery' && (
              <Input label="Teléfono" type="tel" placeholder="+52 55 1234 5678" value={form.phone} onChange={e => set('phone', e.target.value)} error={errors.phone} />
            )}
          </div>
        </div>

        {/* Payment */}
        <div style={card}>
          <p style={sLabel}>💳 Método de pago</p>
          {deliveryType === 'drop' && (
            <div style={{ fontSize: 11, color: 'var(--blue)', background: 'rgba(6,182,255,0.08)', border: '1px solid rgba(6,182,255,0.2)', borderRadius: 8, padding: '6px 10px', marginBottom: 10 }}>
              📦 Drop Anónimo — solo tarjeta o transferencia
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {methodBtn('tarjeta', '💳', 'Tarjeta')}
            {methodBtn('transferencia', '🏦', 'Transferencia')}
            {deliveryType !== 'drop' && methodBtn('efectivo', '💵', 'Efectivo')}
          </div>

          {paymentMethod === 'tarjeta' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Input label="Número de tarjeta" placeholder="0000 0000 0000 0000" value={form.cardNum} onChange={e => set('cardNum', e.target.value.replace(/\D/g, '').slice(0, 16))} error={errors.cardNum} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input label="Vencimiento" placeholder="MM/AA" value={form.cardExp} onChange={e => set('cardExp', e.target.value)} error={errors.cardExp} />
                <Input label="CVV" placeholder="123" type="password" value={form.cardCvv} onChange={e => set('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))} error={errors.cardCvv} />
              </div>
            </div>
          )}

          {paymentMethod === 'transferencia' && (
            <div>
              <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, marginBottom: 6 }}>Datos de transferencia</p>
                <p style={{ fontFamily: 'monospace', color: 'var(--purple)', fontSize: 13, fontWeight: 700 }}>CLABE: 646180157000000001</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Banco: STP — VAPE DROP SA</p>
              </div>
              <Input label="Referencia de pago" placeholder="Últimos 6 dígitos de tu operación" value={form.transferRef} onChange={e => set('transferRef', e.target.value)} error={errors.transferRef} />
            </div>
          )}

          {paymentMethod === 'efectivo' && (
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: 12 }}>
              <p style={{ fontSize: 12, color: '#fbbf24', lineHeight: 1.6 }}>⚠️ Pago al recibir. El repartidor portará un código QR. Prepara el importe exacto.</p>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div style={card}>
          <p style={sLabel}>Resumen del pedido</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.08)', borderRadius: 8, padding: '8px 10px', marginBottom: 12 }}>
            <span style={{ fontSize: 14 }}>{deliveryType === 'drop' ? '📍' : '🏠'}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: '#c4b5fd' }}>
              {deliveryType === 'drop' ? `Drop Anónimo${dropPoint ? ` — ${dropPoint.name}` : ''}` : 'Entrega a domicilio'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: 'var(--muted)' }}>Subtotal</span>
            <span>${subtotal.toLocaleString('es-MX')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12 }}>
            <span style={{ color: 'var(--muted)' }}>Envío</span>
            {shippingCost === 0 ? <span style={{ color: '#4ade80', fontWeight: 600 }}>GRATIS 🎉</span> : <span>${shippingCost} MXN</span>}
          </div>
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 12 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>{count} productos</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--purple)', lineHeight: 1 }}>${totalFinal.toLocaleString('es-MX')}</p>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
          </div>
        </div>

        {payErr && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 12px', marginBottom: 12, fontSize: 13, color: '#f87171' }}>
            ⚠️ {payErr}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: 15, borderRadius: 14, border: 'none',
            background: loading ? 'var(--surface)' : 'var(--grad)',
            color: '#fff', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'default' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 24px rgba(139,92,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading
            ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'block' }} />Procesando...</>
            : 'Confirmar pedido →'
          }
        </button>
      </form>
    </div>
  )
}
