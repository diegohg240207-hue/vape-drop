import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSettings() {
  const [settings, setSettings] = useState({ shipping_price: 50 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => supabase.from('settings').select('*').eq('id', 1).single()
    .then(({ data }) => { if (data) setSettings(data); setLoading(false) })

  useEffect(() => { load() }, [])

  const save = async (values) => {
    setSaving(true)
    const { error } = await supabase.from('settings').upsert({ id: 1, ...values })
    if (!error) setSettings(s => ({ ...s, ...values }))
    setSaving(false)
    return error
  }

  return { settings, loading, saving, save }
}
