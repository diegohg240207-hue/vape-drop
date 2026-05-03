import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useOrders() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function createOrder({ customer, items, total, deliveryType, paymentMethod, shippingCost, dropPointId }) {
    // Backend validation: drop => no efectivo
    if (deliveryType === 'drop' && paymentMethod === 'efectivo') {
      return { order: null, error: 'El pago en efectivo no está disponible para Drop Anónimo.' }
    }
    setLoading(true); setError(null)
    try {
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          customer_name:    customer.name,
          customer_email:   customer.email,
          customer_phone:   customer.phone,
          customer_address: deliveryType === 'delivery' ? customer.address : '',
          delivery_type:    deliveryType,
          payment_method:   paymentMethod,
          shipping_cost:    shippingCost,
          drop_point_id:    dropPointId || null,
          total:            total + shippingCost,
          status: 'pending',
        })
        .select().single()
      if (orderErr) throw orderErr
      const { error: itemsErr } = await supabase.from('order_items').insert(
        items.map(i => ({ order_id: order.id, product_id: i.id, quantity: i.qty, unit_price: i.price }))
      )
      if (itemsErr) throw itemsErr
      return { order, error: null }
    } catch (e) {
      setError(e.message)
      return { order: null, error: e.message }
    } finally { setLoading(false) }
  }

  async function getOrder(id) {
    const { data, error } = await supabase.from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', id).single()
    return { data, error }
  }

  return { createOrder, getOrder, loading, error }
}
