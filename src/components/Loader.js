'use client'
import { useEffect, useRef, useState } from 'react'

export default function Loader() {
  const loaderRef = useRef(null)
  const [isDone, setIsDone] = useState(false)
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const hero = document.querySelector('.hero')
    const timer1 = setTimeout(() => {
      setIsDone(true)
    }, 600)
    const timer2 = setTimeout(() => {
      hero?.classList.add('is-ready')
    }, 2400)
    const timer3 = setTimeout(() => {
      // Dejamos que React desmonte el nodo (setState), nunca loader.remove() a
      // mano: Loader vive en el layout compartido de (site)/, y si se saca el
      // nodo del DOM por fuera de React, la siguiente reconciliación (ej. al
      // navegar entre "/" y "/acerca-de-vimex") revienta con
      // "Failed to execute 'insertBefore'..." porque React todavía cree que
      // ese nodo sigue siendo hijo de su padre.
      setIsMounted(false)
      document.body.style.overflow = ''
      // Si se entró con un anchor (ej. /#oferta-del-mes), el navegador intenta
      // saltar ahí antes de que el overflow:hidden de arriba se lo permita —
      // se pierde. Una vez liberado el scroll, lo reintentamos a mano.
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash)
        target?.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
    }, 3600)
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3) }
  }, [])

  if (!isMounted) return null

  return (
    <div className={`loader${isDone ? ' is-done' : ''}`} ref={loaderRef} aria-hidden="true">
      <img className="loader__brand" src="/assets/vimex-logo-white.png" alt="Vimex Vacation Rentals" />
      <div className="loader__sub">
        <span>Playa del Carmen</span>
        <span>·</span>
        <span>Tulum</span>
        <span>·</span>
        <span>Akumal</span>
      </div>
      <div className="loader__progress"></div>
    </div>
  )
}
