import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useOrders() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function createOrder({ customer, items, total, deliveryType, paymentMethod, shippingCost, dropPointId }) {
    // Backend validations
    if (deliveryType === 'drop' && paymentMethod === 'efectivo') {
      return { order: null, error: 'El pago en efectivo no está disponible para Drop Anónimo.' }
    }
    if (!customer.phone || customer.phone.replace(/\D/g, '').length < 8) {
      return { order: null, error: 'El teléfono / WhatsApp es requerido.' }
    }
    if (deliveryType === 'delivery' && !customer.address?.trim()) {
      return { order: null, error: 'La dirección de entrega es requerida.' }
    }
    if (deliveryType === 'drop' && !dropPointId) {
      return { order: null, error: 'Selecciona un punto de Drop.' }
    }
    setLoading(true); setError(null)
    try {
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          customer_name:    customer.name,
          customer_email:   customer.email,
          customer_phone:   customer.phone,
          customer_address: customer.address || '',
          total:            total,
          status:           'nuevo',
          delivery_type:    deliveryType,
          payment_method:   paymentMethod,
          shipping_cost:    shippingCost,
          drop_point_id:    dropPointId || null,
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

export function useOrder(orderId) {
  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!orderId) return
    setLoading(true)
    supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', orderId)
      .single()
      .then(({ data, error: err }) => {
        setOrder(data ?? null)
        setError(err ? err.message : null)
        setLoading(false)
      })
  }, [orderId])

  return { order, loading, error }
}
