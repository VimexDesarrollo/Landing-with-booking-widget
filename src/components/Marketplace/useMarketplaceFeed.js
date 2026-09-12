'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { getProperties } from '@/services/marketplace/getProperties'

const PAGE_SIZE = 12

export function useMarketplaceFeed() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sentinelRef = useRef(null)
  const isLoadingRef = useRef(false)
  const hasMoreRef = useRef(true)

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return
    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)
    try {
      const nextPage = page + 1
      const res = await getProperties({ page: nextPage, pageSize: PAGE_SIZE })
      setItems((prev) => [...prev, ...res.items])
      setPage(nextPage)
      setHasMore(res.hasMore)
      hasMoreRef.current = res.hasMore
    } catch (err) {
      setError(err)
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Carga la primera página al montar.
  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Observa el sentinel; mientras isLoading es true el sentinel queda "empujado"
  // hacia abajo por los skeletons, así que no se vuelve a disparar hasta que
  // realmente entra en viewport de nuevo.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadMore()
        })
      },
      { threshold: 0, rootMargin: '400px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loadMore])

  return { items, isLoading, hasMore, error, sentinelRef, pageSize: PAGE_SIZE }
}
