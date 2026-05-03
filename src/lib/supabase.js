import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const fmt = n => `$${Number(n).toLocaleString('es-MX')}`

export const ADMIN_WA = import.meta.env.VITE_ADMIN_WA || '5215500000000'

export const adminWaLink = msg =>
  `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`

export const waLink = (phone, msg) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`

export const STATUS_CYCLE_NORMAL = {
  nuevo: 'en_proceso',
  en_proceso: 'entregado',
  entregado: 'nuevo',
}

export const STATUS_CYCLE_DROP = {
  nuevo: 'en_proceso',
  en_proceso: 'drop_realizado',
  drop_realizado: 'confirmado',
  confirmado: 'entregado',
  entregado: 'nuevo',
}

export const STATUS_LABEL = {
  nuevo: 'Nuevo',
  en_proceso: 'En proceso',
  drop_realizado: 'Drop realizado',
  confirmado: 'Confirmado',
  entregado: 'Entregado',
  pagado: 'Pagado',
}

export const STATUS_COLORS = {
  nuevo: '#8b5cf6',
  en_proceso: '#06b6ff',
  drop_realizado: '#f59e0b',
  confirmado: '#10b981',
  entregado: '#10b981',
  pagado: '#10b981',
}

export const DROP_ICONS = {
  'Unidad Deportiva Hugo Sánchez': '🏟️',
  'Unidad Deportiva': '⚽',
  'Biblioteca Pública Municipal Benemérito de Las Américas': '📚',
}
