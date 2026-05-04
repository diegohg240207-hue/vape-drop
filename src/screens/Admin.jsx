import { useState } from 'react'
import { useAdminProducts, useAdminOrders } from '../hooks/useAdmin'
import { useBundles } from '../hooks/useBundles'
import { useSettings } from '../hooks/useSettings'
import { useProducts } from '../hooks/useProducts'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input  from '../components/ui/Input'

const EMPTY_PRODUCT = { name:'', brand:'', flavor:'', puffs:'', price:'', stock:'', image_url:'', category:'', active:true }

const STATUS_COLORS = { nuevo:'#8b5cf6', en_proceso:'#06b6ff', drop_realizado:'#f59e0b', confirmado:'#10b981', entregado:'#22c55e' }
const STATUS_LABELS = { nuevo:'Nuevo', en_proceso:'En proceso', drop_realizado:'Drop realizado', confirmado:'Confirmado', entregado:'Entregado' }
const STATUS_OPTS   = ['nuevo','en_proceso','drop_realizado','confirmado','entregado']
const STATUS_CYCLE_NORMAL = { nuevo:'en_proceso', en_proceso:'entregado', entregado:'nuevo' }
const STATUS_CYCLE_DROP   = { nuevo:'en_proceso', en_proceso:'drop_realizado', drop_realizado:'confirmado', confirmado:'entregado', entregado:'nuevo' }

const DELIVERY_MAP = { delivery:'🚚 Domicilio', drop:'📦 Drop' }
const PAYMENT_MAP  = { tarjeta:'💳 Tarjeta', transferencia:'🏦 Transferencia', efectivo:'💵 Efectivo' }

const StatusBadge = ({ status }) => {
  const c = STATUS_COLORS[status] || '#8b5cf6'
  const l = STATUS_LABELS[status] || status
  return <span style={{ background:`${c}22`, color:c, border:`1px solid ${c}44`, borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:600, letterSpacing:0.5, textTransform:'uppercase', whiteSpace:'nowrap' }}>{l}</span>
}

function ProductForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  return (
    <form onSubmit={e=>{e.preventDefault(); onSave({...form,puffs:Number(form.puffs),price:Number(form.price),stock:Number(form.stock)})}} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <Input label="Nombre"    value={form.name}     onChange={e=>set('name',e.target.value)}     required />
        <Input label="Marca"     value={form.brand}    onChange={e=>set('brand',e.target.value)}    required />
        <Input label="Sabor"     value={form.flavor}   onChange={e=>set('flavor',e.target.value)}   />
        <Input label="Puffs"     type="number" value={form.puffs}    onChange={e=>set('puffs',e.target.value)}    required />
        <Input label="Precio"    type="number" value={form.price}    onChange={e=>set('price',e.target.value)}    required />
        <Input label="Stock"     type="number" value={form.stock}    onChange={e=>set('stock',e.target.value)}    required />
        <Input label="Categoria" value={form.category} onChange={e=>set('category',e.target.value)} />
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-muted)', letterSpacing:'.04em', textTransform:'uppercase' }}>Activo</label>
          <div style={{ display:'flex', gap:'.75rem', paddingTop:10 }}>
            {[true,false].map(v=>(
              <label key={String(v)} style={{ display:'flex', alignItems:'center', gap:'.4rem', cursor:'pointer', fontSize:'14px' }}>
                <input type="radio" checked={form.active===v} onChange={()=>set('active',v)}/> {v?'Si':'No'}
              </label>
            ))}
          </div>
        </div>
      </div>
      <Input label="URL Imagen" value={form.image_url} onChange={e=>set('image_url',e.target.value)} />
      <div style={{ display:'flex', gap:'1rem', justifyContent:'flex-end', marginTop:'.5rem' }}>
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" type="submit" loading={saving}>Guardar</Button>
      </div>
    </form>
  )
}

function BundleForm({ initial, onSave, onCancel, saving, allProducts }) {
  const [form, setForm]   = useState(initial || { name:'', description:'', price:'', active:true })
  const [items, setItems] = useState(initial?.bundle_items?.map(i=>({product_id:i.products?.id||i.product_id, quantity:i.quantity, _name:i.products?.name})) || [])
  const [selProd, setSelProd] = useState('')
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const addItem = () => {
    if (!selProd) return
    const prod = allProducts.find(p=>p.id===selProd)
    if (!prod) return
    setItems(prev => {
      const ex = prev.find(i=>i.product_id===selProd)
      if (ex) return prev.map(i=>i.product_id===selProd ? {...i,quantity:i.quantity+1} : i)
      return [...prev, { product_id:selProd, quantity:1, _name:prod.name }]
    })
    setSelProd('')
  }
  return (
    <form onSubmit={e=>{e.preventDefault(); onSave({bundle:{...form,price:Number(form.price)}, items})}} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <Input label="Nombre del bundle" value={form.name} onChange={e=>set('name',e.target.value)} required />
        <Input label="Precio bundle" type="number" value={form.price} onChange={e=>set('price',e.target.value)} required />
      </div>
      <Input label="Descripcion" value={form.description} onChange={e=>set('description',e.target.value)} />
      <div>
        <label style={{ fontSize:'13px', fontWeight:600, color:'var(--text-muted)', letterSpacing:'.04em', textTransform:'uppercase', display:'block', marginBottom:'.5rem' }}>Productos del bundle</label>
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'.75rem' }}>
          <select value={selProd} onChange={e=>setSelProd(e.target.value)} style={{ flex:1, padding:'9px 12px', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius)', color:'var(--text)', fontSize:'13px' }}>
            <option value="">Seleccionar producto...</option>
            {allProducts.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Button variant="ghost" size="sm" type="button" onClick={addItem}>+ Agregar</Button>
        </div>
        {items.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
            {items.map((item,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.5rem .75rem', background:'var(--bg3)', borderRadius:8, fontSize:'13px' }}>
                <span>{item._name || item.product_id}</span>
                <div style={{ display:'flex', gap:'.5rem', alignItems:'center' }}>
                  <button type="button" onClick={()=>setItems(p=>p.map((it,j)=>j===i?{...it,quantity:Math.max(1,it.quantity-1)}:it))} style={{ width:22,height:22,borderRadius:4,background:'rgba(255,255,255,.08)',border:'1px solid var(--border)',color:'var(--text)',cursor:'pointer' }}>−</button>
                  <span style={{ minWidth:20, textAlign:'center', fontWeight:700 }}>{item.quantity}</span>
                  <button type="button" onClick={()=>setItems(p=>p.map((it,j)=>j===i?{...it,quantity:it.quantity+1}:it))} style={{ width:22,height:22,borderRadius:4,background:'rgba(255,255,255,.08)',border:'1px solid var(--border)',color:'var(--text)',cursor:'pointer' }}>+</button>
                  <button type="button" onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{ background:'none',border:'none',color:'#f87171',cursor:'pointer',fontSize:'12px',marginLeft:4 }}>Quitar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display:'flex', gap:'1rem', justifyContent:'flex-end', marginTop:'.5rem' }}>
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" type="submit" loading={saving}>Guardar bundle</Button>
      </div>
    </form>
  )
}

export default function Admin() {
  const { products: adminProds, loading:pLoading, upsert, remove, toggleActive } = useAdminProducts()
  const { orders, loading:oLoading, updateStatus } = useAdminOrders()
  const { bundles, loading:bLoading, upsert:upsertBundle, remove:removeBundle, toggleActive:toggleBundle, setBundleItems } = useBundles(true)
  const { products: allProducts } = useProducts()
  const { settings, saving:settSaving, save:saveSettings } = useSettings()

  const [tab, setTab]         = useState('products')
  const [modal, setModal]     = useState(null)
  const [saving, setSaving]   = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch]   = useState('')
  const [shippingInput, setShippingInput] = useState('')

  const openNew  = ()  => setModal({ mode:'create', data:{...EMPTY_PRODUCT} })
  const openEdit = (p) => setModal({ mode:'edit',   data:{...p} })
  const closeModal = () => { setModal(null); setSaving(false) }

  const handleSaveProd = async (data) => {
    setSaving(true)
    const err = await upsert(data)
    setSaving(false)
    if (err) { alert('Error: '+err.message); return }
    closeModal()
  }

  const handleSaveBundle = async ({ bundle, items }) => {
    setSaving(true)
    const id = modal.data?.id
    const payload = id ? { id, ...bundle } : bundle
    const err = await upsertBundle(payload)
    if (err) { alert('Error: '+err.message); setSaving(false); return }
    if (items.length && modal.data?.id) {
      await setBundleItems(id, items)
    }
    setSaving(false)
    closeModal()
  }

  const handleSaveSettings = async () => {
    const err = await saveSettings({ shipping_price: Number(shippingInput) })
    if (err) alert('Error: '+err.message)
    else setShippingInput('')
  }

  const filtered = adminProds.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()))

  const tabS = (t) => ({
    padding:'.55rem 1.1rem', border:'none', cursor:'pointer', fontFamily:"'Space Grotesk'",
    background: tab===t ? 'var(--bg3)' : 'transparent',
    color: tab===t ? 'var(--purple-l)' : 'var(--text-muted)',
    borderBottom: tab===t ? '2px solid var(--purple)' : '2px solid transparent',
    fontWeight:600, fontSize:'13px', transition:'all var(--transition)',
  })

  const thS = { padding:'.65rem 1rem', textAlign:'left', fontSize:'11px', fontWeight:700, color:'var(--text-muted)', letterSpacing:'.06em', textTransform:'uppercase', whiteSpace:'nowrap' }
  const tdS = { padding:'.55rem 1rem', fontSize:'13px' }

  return (
    <div style={{ minHeight:'100dvh', background:'var(--bg)', maxWidth:480, margin:'0 auto' }}>
      {/* Topbar */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:28, height:28, borderRadius:8, background:'var(--grad)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>VD</span>
          <span style={{ fontFamily:"'Space Grotesk'", fontWeight:700, fontSize:14 }}>VAPE DROP Admin</span>
        </div>
        <a href="/home" style={{ fontSize:12, color:'var(--muted)', textDecoration:'none' }}>Ver tienda</a>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, padding:'12px 20px 0', borderBottom:'1px solid var(--border)', overflowX:'auto', scrollbarWidth:'none' }}>
        {[['products',`📦 Productos`],['orders',`🚚 Pedidos (${orders.length})`],['bundles',`🏷 Bundles`],['config','⚙️ Config']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, whiteSpace:'nowrap', cursor:'pointer', transition:'all 0.2s', border:'none',
            background: tab===id ? 'var(--grad)' : 'var(--card)',
            color: tab===id ? '#fff' : 'var(--muted)',
            ...(tab!==id && { border:'1px solid var(--border)' }),
            marginBottom:12,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding:'16px 20px 88px' }}>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div>
            <div style={{ display:'flex', gap:'1rem', marginBottom:'1.25rem', alignItems:'center', flexWrap:'wrap' }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{ flex:1, minWidth:180, padding:'9px 14px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', color:'var(--text)', fontSize:'13px', outline:'none' }}/>
              <Button variant="primary" size="sm" onClick={openNew}>+ Nuevo producto</Button>
            </div>
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Imagen','Nombre','Marca','Puffs','Precio','Stock','Estado','Acciones'].map(h=><th key={h} style={thS}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filtered.map(p=>(
                    <tr key={p.id} style={{ borderBottom:'1px solid var(--border)', transition:'background var(--transition)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={tdS}><div style={{ width:40,height:40,background:'var(--bg3)',borderRadius:6,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center' }}>
                        {p.image_url?<img src={p.image_url} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}}/>:<span style={{opacity:.3}}>💨</span>}
                      </div></td>
                      <td style={tdS}><div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:160,fontWeight:600}}>{p.name}</div>
                        {p.flavor&&<div style={{fontSize:'11px',color:'var(--text-muted)'}}>{p.flavor}</div>}</td>
                      <td style={{...tdS,color:'var(--text-muted)'}}>{p.brand}</td>
                      <td style={tdS}><Badge color="blue">{p.puffs?.toLocaleString()}</Badge></td>
                      <td style={{...tdS,fontWeight:700}}>${p.price?.toLocaleString('es-MX')}</td>
                      <td style={tdS}><span style={{color:p.stock===0?'#f87171':p.stock<5?'#fb923c':'#4ade80'}}>{p.stock}</span></td>
                      <td style={tdS}><button onClick={()=>toggleActive(p.id,!p.active)} style={{background:'none',border:'none',cursor:'pointer'}}><Badge color={p.active?'green':'gray'}>{p.active?'Activo':'Inactivo'}</Badge></button></td>
                      <td style={tdS}><div style={{display:'flex',gap:'.4rem'}}>
                        <Button variant="ghost"  size="sm" onClick={()=>openEdit(p)}>Editar</Button>
                        <Button variant="danger" size="sm" onClick={()=>setConfirm({type:'product',id:p.id})}>Borrar</Button>
                      </div></td>
                    </tr>
                  ))}
                  {filtered.length===0&&<tr><td colSpan={8} style={{padding:'3rem',textAlign:'center',color:'var(--text-muted)'}}>Sin productos</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {orders.length === 0 && (
              <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)', background:'var(--bg2)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)' }}>Sin órdenes</div>
            )}
            {orders.map(o => {
              const isDrop = o.delivery_type === 'drop'
              const cycle = isDrop ? STATUS_CYCLE_DROP : STATUS_CYCLE_NORMAL
              const nextStatus = cycle[o.status]
              return (
                <div key={o.id} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, padding:14, position:'relative' }}>
                  {isDrop && (
                    <span style={{ position:'absolute', top:10, right:10, background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.25)', borderRadius:6, padding:'2px 8px', fontSize:9, color:'#a78bfa', textTransform:'uppercase', fontWeight:700 }}>DROP ANÓNIMO</span>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <div>
                      <p style={{ fontFamily:"'Space Grotesk'", fontWeight:700, fontSize:13, color:'var(--purple)' }}>{o.id?.slice(0,8).toUpperCase()}</p>
                      <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>
                        {new Date(o.created_at).toLocaleDateString('es-MX')} · {o.customer_name}
                      </p>
                      {isDrop && o.customer_phone && (
                        <p style={{ fontSize:10, color:'#25d366', marginTop:2 }}>📱 +52{o.customer_phone}</p>
                      )}
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <p style={{ fontFamily:"'Space Grotesk'", fontWeight:800, fontSize:14, color:'var(--blue)' }}>${o.total?.toLocaleString('es-MX')}</p>
                      <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>{DELIVERY_MAP[o.delivery_type]||'🚚'} · {PAYMENT_MAP[o.payment_method]||o.payment_method}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <StatusBadge status={o.status} />
                    <div style={{ display:'flex', gap:6 }}>
                      {nextStatus && (
                        <button
                          onClick={() => updateStatus(o.id, nextStatus)}
                          style={{ padding:'5px 12px', borderRadius:8, background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)', fontSize:11, fontWeight:600, cursor:'pointer' }}
                        >→ {STATUS_LABELS[nextStatus]}</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* BUNDLES TAB */}
        {tab === 'bundles' && (
          <div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1.25rem' }}>
              <Button variant="primary" size="sm" onClick={()=>setModal({mode:'bundle',data:null})}>+ Nuevo bundle</Button>
            </div>
            {bundles.length === 0 ? (
              <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)', background:'var(--bg2)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)' }}>
                <p style={{ fontSize:'1.1rem', marginBottom:'1rem' }}>Sin bundles creados</p>
                <Button variant="ghost" size="sm" onClick={()=>setModal({mode:'bundle',data:null})}>Crear primer bundle</Button>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
                {bundles.map(b=>(
                  <div key={b.id} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'1.25rem', display:'flex', flexDirection:'column', gap:'.75rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <h3 style={{ fontWeight:700, fontSize:'.95rem' }}>{b.name}</h3>
                        {b.description&&<p style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:2 }}>{b.description}</p>}
                      </div>
                      <button onClick={()=>toggleBundle(b.id,!b.active)} style={{background:'none',border:'none',cursor:'pointer'}}>
                        <Badge color={b.active?'green':'gray'}>{b.active?'Activo':'Inactivo'}</Badge>
                      </button>
                    </div>
                    {b.bundle_items?.length>0&&(
                      <div style={{ fontSize:'12px', color:'var(--text-muted)', display:'flex', flexDirection:'column', gap:'.2rem' }}>
                        {b.bundle_items.map((it,i)=><span key={i}>x{it.quantity} {it.products?.name}</span>)}
                      </div>
                    )}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border)', paddingTop:'.6rem' }}>
                      <span style={{ fontWeight:800, fontFamily:"'Space Grotesk'" }}>${b.price?.toLocaleString('es-MX')}</span>
                      <div style={{ display:'flex', gap:'.4rem' }}>
                        <Button variant="ghost"  size="sm" onClick={()=>setModal({mode:'bundle',data:b})}>Editar</Button>
                        <Button variant="danger" size="sm" onClick={()=>setConfirm({type:'bundle',id:b.id})}>Borrar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONFIG TAB */}
        {tab === 'config' && (
          <div style={{ maxWidth:480 }}>
            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'2rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              <div>
                <h2 style={{ fontSize:'1.05rem', fontWeight:700, marginBottom:'.25rem' }}>Precio de Envio</h2>
                <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>Se aplica cuando el pedido es menor a 3 piezas. Si son 3 o mas, el envio es GRATIS automaticamente.</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                <div style={{ padding:'.9rem 1.25rem', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:'var(--radius)', fontSize:'1.3rem', fontWeight:800, fontFamily:"'Space Grotesk'", minWidth:120 }}>
                  ${settings.shipping_price} <span style={{ fontSize:'12px', fontWeight:400, color:'var(--text-muted)' }}>MXN actual</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:'.75rem', alignItems:'flex-end' }}>
                <div style={{ flex:1 }}>
                  <Input label="Nuevo precio de envio (MXN)" type="number" placeholder={String(settings.shipping_price)} value={shippingInput} onChange={e=>setShippingInput(e.target.value)} />
                </div>
                <Button variant="primary" onClick={handleSaveSettings} loading={settSaving} disabled={!shippingInput}>
                  Guardar
                </Button>
              </div>
              <div style={{ padding:'1rem', background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.2)', borderRadius:'var(--radius)', fontSize:'13px', color:'#4ade80' }}>
                Envio GRATIS automatico para pedidos de 3+ piezas
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product modal */}
      <Modal open={!!modal && modal.mode!=='bundle'} onClose={closeModal} title={modal?.mode==='create'?'Nuevo producto':'Editar producto'} width="620px">
        {modal && modal.mode!=='bundle' && <ProductForm initial={modal.data} onSave={handleSaveProd} onCancel={closeModal} saving={saving} />}
      </Modal>

      {/* Bundle modal */}
      <Modal open={!!modal && modal.mode==='bundle'} onClose={closeModal} title={modal?.data?.id?'Editar bundle':'Nuevo bundle'} width="620px">
        {modal?.mode==='bundle' && <BundleForm initial={modal.data} onSave={handleSaveBundle} onCancel={closeModal} saving={saving} allProducts={allProducts} />}
      </Modal>

      {/* Confirm delete */}
      <Modal open={!!confirm} onClose={()=>setConfirm(null)} title="Confirmar eliminacion" width="380px">
        <p style={{ color:'var(--text-muted)', marginBottom:'1.5rem', fontSize:'14px' }}>Esta accion no se puede deshacer.</p>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'flex-end' }}>
          <Button variant="ghost"  onClick={()=>setConfirm(null)}>Cancelar</Button>
          <Button variant="danger" onClick={async()=>{ if(confirm.type==='product') await remove(confirm.id); else await removeBundle(confirm.id); setConfirm(null) }}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  )
}
