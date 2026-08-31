import { useState, useEffect, useRef, useCallback } from 'react'
import { OFFER_ROTATE_MS, SWIPE_THRESHOLD_PX } from '../constants'

/**
 * Carrusel de ofertas: índice activo, navegación con wrap-around,
 * auto-rotación cada OFFER_ROTATE_MS (se pausa con la pestaña oculta) y
 * handlers de swipe táctil para móvil.
 *
 * @param {number} total  Número de ofertas.
 */
export function useOfferCarousel(total) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total])
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])

  useEffect(() => {
    if (total < 2) return
    const id = setInterval(() => {
      if (!document.hidden) next()
    }, OFFER_ROTATE_MS)
    return () => clearInterval(id)
  }, [total, next])

  // Swipe horizontal sobre la card (móvil). No hace preventDefault para no
  // romper el scroll vertical.
  const touchStart = useRef(null)

  const onTouchStart = (e) => {
    const p = e.touches[0]
    touchStart.current = { x: p.clientX, y: p.clientY }
  }

  const onTouchEnd = (e) => {
    if (!touchStart.current || total < 2) return
    const p = e.changedTouches[0]
    const dx = p.clientX - touchStart.current.x
    const dy = p.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next()
      else prev()
    }
  }

  return { index, next, prev, swipeHandlers: { onTouchStart, onTouchEnd } }
}
