import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yegaevgtjsevslgtkuqt.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZ2Fldmd0anNldnNsZ3RrdXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjg4OTcsImV4cCI6MjA5MjgwNDg5N30.eou-e9T5btCgdsHTPVXzUjoJ5Dyelqg3--LeRR_2fwI'

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
