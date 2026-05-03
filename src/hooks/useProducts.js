import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let q = supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (filters.category) q = q.eq('category', filters.category)
      if (filters.brand)    q = q.eq('brand', filters.brand)
      if (filters.minPuffs) q = q.gte('puffs', filters.minPuffs)
      if (filters.maxPuffs) q = q.lte('puffs', filters.maxPuffs)
      if (filters.search)   q = q.ilike('name', )

      const { data, error: err } = await q
      if (err) throw err
      setProducts(data ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { fetch() }, [fetch])

  return { products, loading, error, refetch: fetch }
}

export function useFeaturedProducts(limit = 8) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .limit(limit)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data ?? [])
        setLoading(false)
      })
  }, [limit])

  return { products, loading }
}
