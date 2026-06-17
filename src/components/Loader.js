'use client'
import { useEffect, useRef } from 'react'

export default function Loader() {
  const loaderRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const loader = loaderRef.current
    const hero = document.querySelector('.hero')
    const timer1 = setTimeout(() => {
      loader?.classList.add('is-done')
    }, 600)
    const timer2 = setTimeout(() => {
      hero?.classList.add('is-ready')
    }, 2400)
    const timer3 = setTimeout(() => {
      loader?.remove()
      document.body.style.overflow = ''
    }, 3600)
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3) }
  }, [])

  return (
    <div className="loader" ref={loaderRef} aria-hidden="true">
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
