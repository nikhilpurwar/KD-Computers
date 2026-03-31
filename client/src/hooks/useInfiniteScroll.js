import { useState, useEffect, useRef } from 'react'
import api from '../API/index'

export function useInfiniteScroll({ endpoint, params = {}, limit = 15 }) {
  const [items, setItems]     = useState([])
  const [total, setTotal]     = useState(0)
  const [page, setPage]       = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initial, setInitial] = useState(true)
  const sentinelRef           = useRef(null)
  const paramsKey             = JSON.stringify(params)

  // reset on param change (search/filter)
  useEffect(() => {
    setItems([])
    setPage(1)
    setHasMore(true)
    setInitial(true)
  }, [paramsKey])

  // fetch current page
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(endpoint, { params: { ...params, page, limit } })
        if (cancelled) return
        setItems(prev => page === 1 ? data.data : [...prev, ...data.data])
        setTotal(data.total)
        setHasMore(page < data.pages)
        setInitial(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [page, paramsKey])

  // observe sentinel to trigger next page
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) setPage(p => p + 1)
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, initial])

  return { items, setItems, total, loading, initial, sentinelRef }
}
