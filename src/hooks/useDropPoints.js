import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDropPoints() {
  const [dropPoints, setDropPoints] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('drop_points').select('*').eq('active', true).order('name')
      .then(({ data }) => { setDropPoints(data ?? []); setLoading(false) })
  }, [])
  return { dropPoints, loading }
}
