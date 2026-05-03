import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  supabase, fmt, waLink, DROP_ICONS,
  STATUS_CYCLE_NORMAL, STATUS_CYCLE_DROP, STATUS_LABEL, STATUS_COLORS,
} from '../lib/supabase'
import AppHeader from '../components/AppHeader'
import StatusBadge from '../components/StatusBadge'
import ProductImg from '../components/ProductImg'

const TABS = [
  ['dashboard', '📊 Dashboard'],
  ['orders', '📦 Pedidos'],
  ['inventory', '🗃 Inventario'],
  ['bundles', '🏷 Bundles'],
  ['reports', '📈 Reportes'],
]

const salesData = [
  { day: 'L', val: 3200 }, { day: 'M', val: 5100 }, { day: 'X', val: 2800 },
  { day: 'J', val: 6400 }, { day: 'V', val: 7200 }, { day: 'S', val: 8900 }, { day: 'H', val: 4100 },
]
const maxVal = Math.max(...salesData.map(d => d.val))

export default function AdminScreen() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [bundles, setBundles] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editPrice, setEditPrice] = useState('')
  const [editStock, setEditStock] = useState('')
  const [showBundleForm, setShowBundleForm] = useState(false)
  const [editBundle, setEditBundle] = useState(null)
  const [bundleForm, setBundleForm] = useState({ name: '', description: '', price: '', active: true })
  const [evidenceModal, setEvidenceModal] = useState(null)
  const [evidenceImg, setEvidenceImg] = useState(null)
  const [evidenceImgName, setEvidenceImgName] = useState('')
  const evidenceFileRef = useRef(null)

  // ── Load data ──
  useEffect(() => {
    loadOrders()
    loadProducts()
    loadBundles()

    // Realtime subscription for new orders
    const channel = supabase
      .channel('orders-admin')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        setOrders(prev => [payload.new, ...prev])
        toast('🔔 Nuevo pedido recibido', { icon: '📦' })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const loadOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
  }

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('name')
    if (data) setProducts(data)
  }

  const loadBundles = async () => {
    const { data } = await supabase.from('bundles').select('*').order('name')
    if (data) setBundles(data)
  }

  // ── Orders ──
  const advanceStatus = async (o) => {
    const cycle = o.is_drop ? STATUS_CYCLE_DROP : STATUS_CYCLE_NORMAL
    const next = cycle[o.status] || 'nuevo'
    const { error } = await supabase.from('orders').update({ status: next }).eq('id', o.id)
    if (!error) setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: next } : x))
    else toast.error('Error al actualizar estado')
  }

  const openEvidence = (o) => { setEvidenceModal(o); setEvidenceImg(null); setEvidenceImgName('') }

  const sendEvidence = async (o) => {
    const code = o.order_number.split('-')[1] || '####'
    const msg = `📦 *VAPE DROP — Evidencia de entrega*\n\nTu pedido *${o.order_number}* ha sido entregado.\n📍 ${o.delivery_location || 'Punto de entrega'}\n🔑 Código de entrega: *${code}*\n\n_Responde este mensaje para confirmar que recibiste tu pedido._`
    window.open(waLink(`52${o.phone}`, msg), '_blank')
    await supabase.from('orders').update({ status: 'drop_realizado' }).eq('id', o.id)
    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: 'drop_realizado' } : x))
    setEvidenceModal(null)
    toast.success('Evidencia enviada por WhatsApp')
  }

  // ── Inventory ──
  const saveProduct = async (p) => {
    const updates = {}
    if (editPrice) updates.price = parseFloat(editPrice) || p.price
    if (editStock) updates.stock = parseInt(editStock) || p.stock
    const { error } = await supabase.from('products').update(updates).eq('id', p.id)
    if (!error) {
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, ...updates } : x))
      toast.success('Producto actualizado')
    }
    setEditingId(null)
  }

  // ── Bundles ──
  const openBundleForm = (b = null) => {
    setEditBundle(b)
    setBundleForm(b ? { name: b.name, description: b.description || '', price: String(b.price), active: b.active } : { name: '', description: '', price: '', active: true })
    setShowBundleForm(true)
  }

  const saveBundle = async () => {
    if (!bundleForm.name || !bundleForm.price) { toast.error('Nombre y precio son requeridos'); return }
    const payload = { name: bundleForm.name, description: bundleForm.description, price: parseFloat(bundleForm.price) || 0, active: bundleForm.active }
    if (editBundle) {
      const { error } = await supabase.from('bundles').update(payload).eq('id', editBundle.id)
      if (!error) setBundles(prev => prev.map(b => b.id === editBundle.id ? { ...b, ...payload } : b))
    } else {
      const { data, error } = await supabase.from('bundles').insert(payload).select().single()
      if (!error && data) setBundles(prev => [...prev, data])
    }
    setShowBundleForm(false)
    toast.success(editBundle ? 'Bundle actualizado' : 'Bundle creado')
  }

  const toggleBundle = async (id, active) => {
    await supabase.from('bundles').update({ active: !active }).eq('id', id)
    setBundles(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b))
  }

  const deleteBundle = async (id) => {
    if (!confirm('¿Eliminar este bundle?')) return
    await supabase.from('bundles').delete().eq('id', id)
    setBundles(prev => prev.filter(b => b.id !== id))
    toast.success('Bundle eliminado')
  }

  const activeOrders = orders.filter(o => o.status !== 'entregado')
  const todayRevenue = orders.filter(o => {
    const d = new Date(o.created_at); const now = new Date()
    return d.toDateString() === now.toDateString()
  }).reduce((s, o) => s + Number(o.total), 0)

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 0, maxWidth: 480, margin: '0 auto' }}>
      <AppHeader onBack backTo="/home" />

      {/* Tabs */}
      <div style={{ position: 'sticky', top: 90, zIndex: 40, background: 'rgba(7,7,14,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '10px 20px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: tab === id ? 'none' : '1px solid var(--border)',
              background: tab === id ? 'var(--grad)' : 'var(--card)',
              color: tab === id ? 'white' : 'var(--muted)',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px 32px', overflowY: 'auto' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div style={{ animation: 'fadeSlideUp 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                ['Ventas hoy', fmt(todayRevenue), 'Hoy', 'var(--purple)', '💰'],
                ['Pedidos activos', String(activeOrders.length), 'En proceso', 'var(--blue)', '📦'],
                ['Total pedidos', String(orders.length), 'Histórico', 'var(--success)', '📈'],
                ['Productos', String(products.length), 'En catálogo', 'var(--warn)', '🗃'],
              ].map(([label, val, sub, color, ic]) => (
                <div key={label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{ic}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, color, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
                  <div style={{ fontSize: 10, color, marginTop: 2, fontWeight: 600 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, marginBottom: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Ventas esta semana</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                {salesData.map(d => (
                  <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', background: 'var(--grad)', borderRadius: '4px 4px 0 0', height: `${(d.val / maxVal) * 70}px`, opacity: 0.7 }} />
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Pedidos recientes</div>
              {orders.slice(0, 3).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--purple)', fontWeight: 700 }}>{o.order_number}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(o.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} — {o.delivery_location || o.address || '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--blue)' }}>{fmt(o.total)}</div>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: 16 }}>Sin pedidos aún</div>}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div style={{ animation: 'fadeSlideUp 0.3s ease', display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Evidence Modal */}
            {evidenceModal && (() => {
              const o = evidenceModal
              const code = o.order_number.split('-')[1] || '####'
              return (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 80px' }}
                  onClick={e => { if (e.target === e.currentTarget) setEvidenceModal(null) }}>
                  <div style={{ width: '100%', maxWidth: 480, background: 'var(--surface)', borderRadius: '20px 20px 0 0', border: '1px solid var(--border)', padding: 20, animation: 'fadeSlideUp 0.25s ease' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>📤 Enviar evidencia</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
                      Pedido <span style={{ color: 'var(--purple)', fontWeight: 700 }}>{o.order_number}</span>
                      {' · '}Cliente: <span style={{ color: 'var(--blue)' }}>+52{o.phone}</span>
                    </div>

                    <div onClick={() => evidenceFileRef.current?.click()} style={{ border: `2px dashed ${evidenceImg ? 'var(--purple)' : 'var(--border)'}`, borderRadius: 14, padding: '20px', textAlign: 'center', cursor: 'pointer', background: evidenceImg ? 'rgba(139,92,246,0.08)' : 'var(--card)', marginBottom: 14 }}>
                      {evidenceImg ? (
                        <div><div style={{ fontSize: 28, marginBottom: 4 }}>📸</div><div style={{ fontSize: 12, color: 'var(--purple)', fontWeight: 700 }}>{evidenceImgName}</div></div>
                      ) : (
                        <div><div style={{ fontSize: 32, marginBottom: 4 }}>📷</div><div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Subir foto del drop</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>Foto del paquete en el punto de entrega</div></div>
                      )}
                      <input ref={evidenceFileRef} type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => {
                          const f = e.target.files?.[0]
                          if (f) { setEvidenceImg(URL.createObjectURL(f)); setEvidenceImgName(f.name) }
                        }} />
                    </div>

                    {evidenceImg && <img src={evidenceImg} alt="evidencia" style={{ width: '100%', borderRadius: 12, marginBottom: 14, maxHeight: 180, objectFit: 'cover' }} />}

                    <div style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 10, padding: '10px 12px', marginBottom: 16 }}>
                      <div style={{ fontSize: 10, color: '#25d366', fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>💬 MENSAJE WHATSAPP AL CLIENTE</div>
                      <div style={{ fontSize: 11, color: '#b0b0c8', lineHeight: 1.7, fontFamily: 'monospace' }}>
                        📦 Tu pedido <strong style={{ color: '#e0e0f5' }}>{o.order_number}</strong> ha sido entregado.<br />
                        📍 {o.delivery_location || 'Punto de entrega'}<br />
                        🔑 Código: <strong style={{ color: 'var(--purple)' }}>{code}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => sendEvidence(o)} style={{
                        flex: 1, background: 'linear-gradient(135deg,#25d366,#128c7e)', border: 'none',
                        borderRadius: 12, padding: '13px', color: 'white', fontFamily: 'Space Grotesk',
                        fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Enviar por WhatsApp
                      </button>
                      <button onClick={() => setEvidenceModal(null)} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 16px', color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                </div>
              )
            })()}

            {orders.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}><div style={{ fontSize: 32, marginBottom: 8 }}>📭</div><div style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Sin pedidos aún</div></div>}

            {orders.map(o => (
              <div key={o.id} style={{ background: 'var(--card)', borderRadius: 14, padding: 14, border: o.is_drop ? '1px solid rgba(139,92,246,0.35)' : '1px solid var(--border)' }}>
                {o.is_drop && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 6, padding: '2px 8px', fontSize: 9, color: '#a78bfa', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>📍 Drop Anónimo</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--purple)' }}>{o.order_number}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {new Date(o.created_at).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                      {' · '}{o.order_items?.length || 0} items
                      {' · '}{o.delivery_location || o.address || '—'}
                    </div>
                    {o.is_drop && o.phone && (
                      <div style={{ fontSize: 11, color: '#25d366', marginTop: 2 }}>📱 +52{o.phone}</div>
                    )}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 15, color: 'var(--blue)' }}>{fmt(o.total)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <StatusBadge status={o.status} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    {o.is_drop && o.status === 'en_proceso' && (
                      <button onClick={() => openEvidence(o)} style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)', border: 'none', borderRadius: 8, padding: '5px 12px', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>📤</span> Enviar evidencia
                      </button>
                    )}
                    <button onClick={() => advanceStatus(o)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 12px', color: 'var(--text)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      → Avanzar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── INVENTORY ── */}
        {tab === 'inventory' && (
          <div style={{ animation: 'fadeSlideUp 0.3s ease', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {products.map(p => (
              <div key={p.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 44, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                  <ProductImg product={p} h={44} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                    Stock: <span style={{ color: p.stock <= 5 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>{p.stock}</span>
                  </div>
                </div>
                {editingId === p.id ? (
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="Precio"
                      style={{ width: 64, background: 'var(--surface)', border: '1px solid var(--purple)', borderRadius: 6, padding: '4px 6px', color: 'var(--text)', fontSize: 12, textAlign: 'right', outline: 'none' }} />
                    <input value={editStock} onChange={e => setEditStock(e.target.value)} placeholder="Stock"
                      style={{ width: 48, background: 'var(--surface)', border: '1px solid var(--purple)', borderRadius: 6, padding: '4px 6px', color: 'var(--text)', fontSize: 12, textAlign: 'right', outline: 'none' }} />
                    <button onClick={() => saveProduct(p)} style={{ background: 'var(--success)', border: 'none', borderRadius: 6, padding: '4px 8px', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>✓</button>
                    <button onClick={() => setEditingId(null)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--muted)', fontSize: 11, cursor: 'pointer' }}>✕</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--blue)' }}>{fmt(p.price)}</span>
                    <button onClick={() => { setEditingId(p.id); setEditPrice(String(p.price)); setEditStock(String(p.stock)) }}
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', color: 'var(--muted)', fontSize: 10, cursor: 'pointer' }}>✎</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── BUNDLES ── */}
        {tab === 'bundles' && (
          <div style={{ animation: 'fadeSlideUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Bundles & Combos</div>
              <button onClick={() => openBundleForm()} style={{ background: 'var(--grad)', border: 'none', borderRadius: 10, padding: '8px 16px', color: 'white', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>+ Crear bundle</button>
            </div>

            {showBundleForm && (
              <div style={{ background: 'var(--card)', border: '1px solid var(--purple)', borderRadius: 14, padding: 16, marginBottom: 16, animation: 'fadeSlideUp 0.2s ease' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--purple)' }}>{editBundle ? '✏️ Editar bundle' : '➕ Nuevo bundle'}</div>
                {[['name', 'Nombre del bundle', 'Pack 3 Amigos'], ['description', 'Descripción', '3 vapes para compartir'], ['price', 'Precio ($)', '480']].map(([k, label, ph]) => (
                  <div key={k} style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginBottom: 4, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</label>
                    <input value={bundleForm[k] || ''} onChange={e => setBundleForm(p => ({ ...p, [k]: e.target.value }))}
                      placeholder={ph} type={k === 'price' ? 'number' : 'text'}
                      style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 13, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                      onBlur={e => e.target.style.borderColor = ''} />
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Estado:</label>
                  <button onClick={() => setBundleForm(p => ({ ...p, active: !p.active }))} style={{
                    background: bundleForm.active ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.1)',
                    border: `1px solid ${bundleForm.active ? '#10b981' : '#f43f5e'}`,
                    borderRadius: 8, padding: '4px 12px',
                    color: bundleForm.active ? '#10b981' : '#f43f5e', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}>{bundleForm.active ? '✓ Activo' : '✗ Inactivo'}</button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={saveBundle} style={{ flex: 1, background: 'var(--grad)', border: 'none', borderRadius: 10, padding: '10px', color: 'white', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    {editBundle ? 'Guardar cambios' : 'Crear bundle'}
                  </button>
                  <button onClick={() => setShowBundleForm(false)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bundles.map(b => (
                <div key={b.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, opacity: b.active ? 1 : 0.55 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{b.description}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 15, color: 'var(--blue)' }}>{fmt(b.price)}</span>
                      <span style={{ background: b.active ? 'rgba(16,185,129,0.15)' : 'rgba(90,90,128,0.2)', color: b.active ? '#10b981' : 'var(--muted)', border: `1px solid ${b.active ? '#10b98133' : 'transparent'}`, borderRadius: 6, padding: '2px 7px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>{b.active ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openBundleForm(b)} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px', color: 'var(--muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>✏️ Editar</button>
                    <button onClick={() => toggleBundle(b.id, b.active)} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px', color: b.active ? '#f43f5e' : '#10b981', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{b.active ? 'Desactivar' : 'Activar'}</button>
                    <button onClick={() => deleteBundle(b.id)} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, padding: '6px 10px', color: '#f43f5e', fontSize: 14, cursor: 'pointer' }}>🗑</button>
                  </div>
                </div>
              ))}
              {bundles.length === 0 && <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}><div style={{ fontSize: 32, marginBottom: 8 }}>📦</div><div style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>Sin bundles aún</div></div>}
            </div>
          </div>
        )}

        {/* ── REPORTS ── */}
        {tab === 'reports' && (
          <div style={{ animation: 'fadeSlideUp 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                ['Ingresos totales', fmt(orders.reduce((s, o) => s + Number(o.total), 0))],
                ['Pedidos totales', String(orders.length)],
                ['Ticket promedio', orders.length ? fmt(orders.reduce((s, o) => s + Number(o.total), 0) / orders.length) : '$0'],
                ['Tasa entrega', orders.length ? `${Math.round((orders.filter(o => o.status === 'entregado').length / orders.length) * 100)}%` : '0%'],
              ].map(([l, v]) => (
                <div key={l} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 18, color: 'var(--purple)', marginBottom: 4 }}>{v}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, marginBottom: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Ventas por día (demo)</div>
              {salesData.map(d => (
                <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ width: 20, fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{d.day}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--surface)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${(d.val / maxVal) * 100}%`, background: 'var(--grad)', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 700, width: 56, textAlign: 'right' }}>{fmt(d.val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
