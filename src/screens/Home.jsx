import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '../hooks/useProducts'
import { useBundles } from '../hooks/useBundles'
import { useCart } from '../hooks/useCart'
import ProductCard from '../components/ProductCard'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function Home() {
  const { products, loading } = useFeaturedProducts(8)
  const { bundles } = useBundles(false)
  const { addItem } = useCart()

  const addBundle = (bundle) => {
    bundle.bundle_items?.forEach(item => {
      if (item.products) {
        for (let i = 0; i < item.quantity; i++) addItem(item.products)
      }
    })
  }

  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight:'calc(100dvh - 64px)', display:'flex', alignItems:'center', padding:'4rem 1.25rem', position:'relative', overflow:'hidden', background:'linear-gradient(180deg,rgba(139,92,246,.07) 0%,transparent 60%)' }}>
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,.12) 0%,transparent 70%)', top:'-10%', right:'-10%', filter:'blur(80px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,255,.08) 0%,transparent 70%)', bottom:'5%', left:'-5%', filter:'blur(60px)', pointerEvents:'none' }}/>
        <div className="container" style={{ zIndex:1 }}>
          <div style={{ maxWidth:680, animation:'fadeUp .8s ease both' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(139,92,246,.12)', border:'1px solid rgba(139,92,246,.3)', borderRadius:99, padding:'.35rem 1rem', fontSize:'12px', fontWeight:600, color:'var(--purple-l)', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:'1.5rem' }}>
              Nueva coleccion disponible
            </div>
            <h1 style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', fontWeight:800, lineHeight:1.05, letterSpacing:'-.03em', marginBottom:'1.25rem' }}>
              El vape que siempre<br/><span className="gradient-text">quisiste</span>
            </h1>
            <p style={{ fontSize:'1.1rem', color:'var(--text-muted)', maxWidth:500, lineHeight:1.7, marginBottom:'2rem' }}>
              La mejor seleccion de vapeadores desechables. Envio gratis en compras de 3 o mas piezas.
            </p>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center' }}>
              <Link to="/catalog"><Button variant="primary" size="lg">Ver catalogo</Button></Link>
              <Link to="/catalog"><Button variant="ghost" size="lg">Explorar sabores</Button></Link>
            </div>
            <div style={{ marginTop:'1.5rem', display:'inline-flex', alignItems:'center', gap:'.5rem', fontSize:'13px', color:'#4ade80', background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.2)', borderRadius:99, padding:'.35rem 1rem' }}>
              🚚 Envio GRATIS comprando 3 o mas piezas
            </div>
          </div>
        </div>
      </section>

      {/* Bundles section — only shown if bundles exist */}
      {bundles.length > 0 && (
        <section style={{ padding:'4rem 1.25rem', background:'linear-gradient(135deg,rgba(139,92,246,.06) 0%,rgba(6,182,255,.04) 100%)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
              <div>
                <h2 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:800 }}>Combos y Promociones</h2>
                <p style={{ color:'var(--text-muted)', fontSize:'14px', marginTop:'.25rem' }}>Packs con precio especial — ahorra mas comprando junto</p>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
              {bundles.map(bundle => (
                <div key={bundle.id} style={{ background:'var(--bg2)', border:'1px solid rgba(139,92,246,.25)', borderRadius:'var(--radius-lg)', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem', transition:'all var(--transition)', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 12px 35px rgba(139,92,246,.2)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,var(--purple),var(--blue))' }}/>
                  <div>
                    <Badge color="purple">COMBO</Badge>
                    <h3 style={{ fontSize:'1.05rem', fontWeight:700, marginTop:'.6rem', marginBottom:'.3rem' }}>{bundle.name}</h3>
                    {bundle.description && <p style={{ fontSize:'13px', color:'var(--text-muted)', lineHeight:1.5 }}>{bundle.description}</p>}
                  </div>
                  {bundle.bundle_items?.length > 0 && (
                    <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
                      {bundle.bundle_items.map((item,i) => (
                        <div key={i} style={{ display:'flex', gap:'.4rem', alignItems:'center', fontSize:'12px', color:'var(--text-muted)' }}>
                          <span style={{ color:'var(--purple-l)', fontWeight:700 }}>x{item.quantity}</span>
                          <span>{item.products?.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', paddingTop:'.5rem', borderTop:'1px solid var(--border)' }}>
                    <span style={{ fontFamily:"'Space Grotesk'", fontSize:'1.35rem', fontWeight:800, background:'linear-gradient(135deg,var(--purple-l),var(--blue))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                      ${bundle.price?.toLocaleString('es-MX')}
                    </span>
                    <Button variant="primary" size="sm" onClick={() => addBundle(bundle)}>
                      Agregar combo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features strip */}
      <section style={{ padding:'3.5rem 1.25rem', background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.25rem' }}>
            {[
              {icon:'⚡', t:'Entrega rapida',   d:'24-48h a todo el pais'},
              {icon:'🔋', t:'Alta duracion',    d:'Hasta 25.000 puffs'},
              {icon:'✅', t:'Calidad premium',  d:'Marcas originales verificadas'},
              {icon:'🚚', t:'Envio gratis',     d:'En compras de 3 o mas piezas'},
            ].map(f=>(
              <div key={f.t} style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'1.25rem', background:'var(--bg3)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)' }}>
                <span style={{ fontSize:'1.75rem', marginBottom:'.6rem' }}>{f.icon}</span>
                <h3 style={{ fontSize:'.9rem', fontWeight:700, marginBottom:'.3rem' }}>{f.t}</h3>
                <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section style={{ padding:'5rem 1.25rem' }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <h2 style={{ fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:800 }}>Productos destacados</h2>
              <p style={{ color:'var(--text-muted)', fontSize:'14px', marginTop:'.25rem' }}>Los mas elegidos</p>
            </div>
            <Link to="/catalog"><Button variant="ghost" size="sm">Ver todos</Button></Link>
          </div>
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:'1.25rem' }}>
              {Array(4).fill(0).map((_,i)=><div key={i} style={{ height:340, background:'var(--bg2)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', opacity:.4 }}/>)}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
              <p>Conecta Supabase para ver productos.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:'1.25rem' }}>
              {products.map(p=><ProductCard key={p.id} product={p}/>)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
