import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase, fmt, adminWaLink, DROP_ICONS } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import AppHeader from '../components/AppHeader'

export default function CheckoutScreen() {
  const navigate = useNavigate()
  const { cart, cartTotal, clearCart } = useCart()
  const [dropPoints, setDropPoints] = useState([])
  const [deliveryType, setDeliveryType] = useState('home')
  const [dropPoint, setDropPoint] = useState(null)
  const [method, setMethod] = useState('card')
  const [form, setForm] = useState({ address: '', ref: '', cardNum: '', expiry: '', cvv: '', clabe: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cart.length === 0) { navigate('/catalog'); return }
    supabase.from('drop_points').select('*').eq('active', true).then(({ data }) => data && setDropPoints(data))
  }, [])

  const validate = () => {
    const e = {}
    if (deliveryType === 'home') {
      if (!form.address.trim()) e.address = 'Requerido'
      if (!form.ref.trim()) e.ref = 'Requerido'
    } else {
      if (!dropPoint) e.dropPoint = 'Selecciona un punto de entrega'
      if (!form.phone || form.phone.length < 10) e.phone = 'Ingresa un número válido de 10 dígitos'
    }
    if (method === 'card') {
      if (!form.cardNum || form.cardNum.length < 16) e.cardNum = 'Número inválido'
      if (!form.expiry) e.expiry = 'Requerido'
      if (!form.cvv || form.cvv.length < 3) e.cvv = 'Inválido'
    }
    if (method === 'transfer' && !form.clabe) e.clabe = 'Requerido'
    return e
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)

    try {
      const pt = dropPoints.find(p => p.id === dropPoint)
      const orderNum = await getOrderNumber()

      // Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNum,
          phone: form.phone || null,
          delivery_type: deliveryType === 'home' ? 'domicilio' : 'drop',
          delivery_location: pt ? pt.name : null,
          address: deliveryType === 'home' ? `${form.address} — ${form.ref}` : null,
          total: cartTotal,
          status: 'nuevo',
          is_drop: deliveryType === 'drop',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      const items = cart.map(i => ({
        order_id: order.id,
        product_id: i.id,
        quantity: i.qty,
        price: i.price,
        product_name: i.name,
      }))
      await supabase.from('order_items').insert(items)

      // WhatsApp notification to admin for drop orders
      if (deliveryType === 'drop' && form.phone) {
        const productList = cart.map(i => `${i.name} x${i.qty}`).join(', ')
        const msg = `🚨 *NUEVO DROP ANÓNIMO*\n\n📦 Pedido: ${orderNum}\n📍 Punto: ${pt ? pt.name : ''}\n📱 Cliente: +52${form.phone}\n🛒 Productos: ${productList}\n💰 Total: ${fmt(cartTotal)}\n\n⚡ El cliente recibirá foto por WhatsApp al realizar el drop.`
        setTimeout(() => window.open(adminWaLink(msg), '_blank'), 800)
      }

      clearCart()
      navigate(`/confirmation/${orderNum}`)
    } catch (err) {
      console.error(err)
      toast.error('Error al procesar el pedido. Intenta de nuevo.')
      setLoading(false)
    }
  }

  const setField = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const Field = ({ id, label, placeholder, type = 'text', maxLen }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</label>
      <input value={form[id]} onChange={e => setField(id, e.target.value)} placeholder={placeholder} type={type} maxLength={maxLen}
        style={{
          width: '100%', background: 'var(--card)', border: `1px solid ${errors[id] ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--purple)'}
        onBlur={e => e.target.style.borderColor = errors[id] ? 'var(--danger)' : ''}
      />
      {errors[id] && <div style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{errors[id]}</div>}
    </div>
  )

  const selectedPoint = dropPoints.find(p => p.id === dropPoint)

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 20, maxWidth: 480, margin: '0 auto', animation: 'fadeSlideUp 0.3s ease' }}>
      <AppHeader onBack backTo="/cart" />
      <div style={{ padding: '16px 20px 100px' }}>

        {/* TIPO DE ENTREGA */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, marginBottom: 14, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' }}>🚚 Tipo de entrega</h3>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              { id: 'home', icon: '🏠', label: 'A domicilio', sub: 'Gratis desde 3 piezas' },
              { id: 'drop', icon: '📍', label: 'Drop Anónimo', sub: 'Recoge sin contacto' },
            ].map(opt => (
              <button key={opt.id} onClick={() => { setDeliveryType(opt.id); setDropPoint(null); setErrors({}) }}
                style={{
                  flex: 1, padding: '12px 8px', borderRadius: 12, cursor: 'pointer',
                  border: deliveryType === opt.id ? '2px solid var(--purple)' : '1px solid var(--border)',
                  background: deliveryType === opt.id ? 'rgba(139,92,246,0.12)' : 'var(--surface)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                <span style={{ fontSize: 22 }}>{opt.icon}</span>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, color: deliveryType === opt.id ? '#c4b5fd' : 'var(--text)', textAlign: 'center' }}>{opt.label}</span>
                <span style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center' }}>{opt.sub}</span>
              </button>
            ))}
          </div>

          {deliveryType === 'home' && (
            <div style={{ animation: 'fadeSlideUp 0.2s ease' }}>
              <Field id="address" label="Dirección" placeholder="Calle, número, colonia..." />
              <Field id="ref" label="Referencia" placeholder="Punto de referencia discreto..." />
            </div>
          )}

          {deliveryType === 'drop' && (
            <div style={{ animation: 'fadeSlideUp 0.2s ease' }}>
              <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: '#c4b5fd', marginBottom: 6 }}>🔒 Drop Anónimo — ¿Cómo funciona?</div>
                <div style={{ fontSize: 12, color: '#9090c0', lineHeight: 1.8 }}>
                  Tu pedido será colocado en un punto seguro.<br />
                  Recibirás una <strong style={{ color: '#a78bfa' }}>foto por WhatsApp</strong> cuando el paquete haya sido entregado.<br />
                  Podrás confirmar la recepción respondiendo al mismo número.
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>📱 Número de WhatsApp *</label>
                <input
                  value={form.phone}
                  onChange={e => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10 dígitos — ej. 5512345678"
                  type="tel" maxLength={10}
                  style={{
                    width: '100%', background: 'var(--card)',
                    border: `1px solid ${errors.phone ? 'var(--danger)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                  onBlur={e => e.target.style.borderColor = errors.phone ? 'var(--danger)' : ''}
                />
                {errors.phone && <div style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{errors.phone}</div>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dropPoints.map(pt => (
                  <button key={pt.id} onClick={() => { setDropPoint(pt.id); setErrors(p => ({ ...p, dropPoint: '' })) }}
                    style={{
                      border: dropPoint === pt.id ? '2px solid var(--purple)' : '1px solid var(--border)',
                      borderRadius: 12, padding: '12px 14px', cursor: 'pointer',
                      background: dropPoint === pt.id ? 'rgba(139,92,246,0.12)' : 'var(--surface)',
                      display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                    }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: dropPoint === pt.id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {DROP_ICONS[pt.name] || '📍'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, color: dropPoint === pt.id ? '#c4b5fd' : 'var(--text)', marginBottom: 2, lineHeight: 1.3 }}>{pt.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>{pt.description}</div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: dropPoint === pt.id ? '2px solid var(--purple)' : '2px solid var(--border)', background: dropPoint === pt.id ? 'var(--purple)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {dropPoint === pt.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                    </div>
                  </button>
                ))}
              </div>
              {errors.dropPoint && <div style={{ color: 'var(--danger)', fontSize: 11, marginTop: 8 }}>{errors.dropPoint}</div>}
            </div>
          )}
        </div>

        {/* PAGO */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' }}>💳 Método de pago</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['card', 'Tarjeta', '💳'], ['transfer', 'Transferencia', '🏦'], ['cash', 'Efectivo', '💵']].map(([id, label, ic]) => (
              <button key={id} onClick={() => setMethod(id)} style={{
                flex: 1, padding: '10px 4px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: method === id ? 'var(--grad)' : 'var(--surface)',
                border: method === id ? 'none' : '1px solid var(--border)',
                color: method === id ? 'white' : 'var(--muted)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 18 }}>{ic}</span><span>{label}</span>
              </button>
            ))}
          </div>

          {method === 'card' && (
            <div style={{ animation: 'fadeSlideUp 0.2s ease' }}>
              <Field id="cardNum" label="Número de tarjeta" placeholder="1234 5678 9012 3456" maxLen={16} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field id="expiry" label="Vencimiento" placeholder="MM/AA" />
                <Field id="cvv" label="CVV" placeholder="123" maxLen={3} />
              </div>
            </div>
          )}
          {method === 'transfer' && (
            <div style={{ animation: 'fadeSlideUp 0.2s ease' }}>
              <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 13, color: 'var(--muted)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Datos de transferencia</div>
                <div>CLABE: <span style={{ fontFamily: 'monospace', color: 'var(--purple)' }}>646180157000000001</span></div>
                <div>Banco: STP — VAPE DROP SA</div>
              </div>
              <Field id="clabe" label="Referencia de pago" placeholder="Últimos 6 dígitos de tu operación" />
            </div>
          )}
          {method === 'cash' && (
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: '#fbbf24', animation: 'fadeSlideUp 0.2s ease' }}>
              ⚠️ Pago al recibir. El repartidor portará un código QR. Prepara el importe exacto.
            </div>
          )}
        </div>

        {/* RESUMEN */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Resumen del pedido</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(139,92,246,0.08)', borderRadius: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>{deliveryType === 'home' ? '🏠' : '📍'}</span>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Método de entrega</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, color: '#c4b5fd' }}>
                {deliveryType === 'home' ? 'Entrega a domicilio' : `Drop Anónimo${selectedPoint ? ` — ${selectedPoint.name}` : ''}`}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>{cart.reduce((s, i) => s + i.qty, 0)} productos</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 22, color: 'var(--purple)' }}>{fmt(cartTotal)}</div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>
          </div>
        </div>

        <button onClick={submit} disabled={loading} style={{
          width: '100%', background: loading ? 'var(--surface)' : 'var(--grad)',
          border: 'none', borderRadius: 14, padding: '16px',
          color: 'white', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16,
          cursor: loading ? 'default' : 'pointer',
          boxShadow: loading ? 'none' : '0 4px 24px rgba(139,92,246,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {loading ? (
            <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />Procesando...</>
          ) : 'Confirmar pedido →'}
        </button>
      </div>
    </div>
  )
}

async function getOrderNumber() {
  const { data } = await supabase.rpc('generate_order_number')
  return data || `VD-${Math.floor(Math.random() * 90000 + 10000)}`
}
