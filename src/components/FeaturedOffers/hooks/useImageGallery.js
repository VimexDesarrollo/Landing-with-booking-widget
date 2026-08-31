import { useState, useEffect, useCallback } from 'react'
import { GALLERY_ROTATE_MS } from '../constants'

/**
 * Galería de fotos de la oferta activa: índice con wrap-around y
 * auto-avance cada GALLERY_ROTATE_MS. Se reinicia a la foto 0 cada vez que
 * cambia `resetKey` (el id de la oferta activa).
 *
 * @param {number} total     Número de fotos de la oferta activa.
 * @param {string} resetKey  Id de la oferta activa.
 */
export function useImageGallery(total, resetKey) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total])
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])

  useEffect(() => {
    setIndex(0)
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % total)
    }, GALLERY_ROTATE_MS)
    return () => clearInterval(id)
  }, [total, resetKey])

  return { index, next, prev }
}
