import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useBundles(adminMode = false) {
  const [bundles, setBundles] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    let q = supabase.from('bundles')
      .select('*, bundle_items(quantity, products(id,name,price,image_url))')
      .order('created_at', { ascending: false })
    if (!adminMode) q = q.eq('active', true)
    const { data } = await q
    setBundles(data ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [adminMode])

  const upsert = async (bundle) => {
    const { error } = await supabase.from('bundles').upsert(bundle)
    if (!error) load()
    return error
  }

  const remove = async (id) => {
    const { error } = await supabase.from('bundles').delete().eq('id', id)
    if (!error) load()
    return error
  }

  const toggleActive = async (id, active) => {
    await supabase.from('bundles').update({ active }).eq('id', id)
    load()
  }

  const setBundleItems = async (bundleId, items) => {
    await supabase.from('bundle_items').delete().eq('bundle_id', bundleId)
    if (items.length) await supabase.from('bundle_items').insert(items.map(i => ({ bundle_id: bundleId, ...i })))
    load()
  }

  return { bundles, loading, upsert, remove, toggleActive, setBundleItems, refetch: load }
}
