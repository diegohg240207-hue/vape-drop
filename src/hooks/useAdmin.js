import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const upsert = async (product) => {
    const { error } = await supabase.from('products').upsert(product)
    if (!error) load()
    return error
  }

  const remove = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) load()
    return error
  }

  const toggleActive = async (id, active) => {
    await supabase.from('products').update({ active }).eq('id', id)
    load()
  }

  return { products, loading, upsert, remove, toggleActive, refetch: load }
}

export function useAdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(quantity, unit_price, products(name))')
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()

    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => { load() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    load()
  }

  return { orders, loading, updateStatus, refetch: load }
}
