'use client'
import { useEffect, useRef } from 'react'
import { useLang } from '@/context/LangContext'
import SearchWidget from '@/components/SearchWidget'

function Words({ text }) {
  const words = text.split(' ')
  return words.map((w, i) => (
    <span key={i} className="word">
      <span>{w}</span>
      {i < words.length - 1 ? ' ' : null}
    </span>
  ))
}

export default function Hero() {
  const { t } = useLang()
  const heroImgRef = useRef(null)
  const heroInnerRef = useRef(null)

  useEffect(() => {
    const heroImg = heroImgRef.current
    const heroInner = heroInnerRef.current
    const onScroll = () => {
      const y = window.scrollY
      if (heroImg && y < window.innerHeight) {
        heroImg.style.transform = `scale(${1.1 + y * 0.0004}) translateY(${y * 0.3}px)`
      }
      if (heroInner && y < window.innerHeight) {
        heroInner.style.transform = `translateY(${y * 0.2}px)`
        heroInner.style.opacity = String(1 - (y / window.innerHeight) * 1.5)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="hero">
      <div className="hero__media">
        <div
          className="hero__img"
          ref={heroImgRef}
          style={{ backgroundImage: "url('/assets/akumal.webp')" }}
        />
        <div className="hero__gradient" />
        <div className="hero__grain" />
      </div>

      <div className="hero__inner" ref={heroInnerRef}>
        <div className="hero__eyebrow">Vimex Vacation Rentals · Playa del Carmen · Tulum · Akumal</div>
        <h1 className="hero__title">
          <span className="line"><Words text={t('Enjoy the Caribbean', 'Disfruta el Caribe')} /></span>
          <em><span className="line"><Words text={t('like home.', 'como en casa.')} /></span></em>
        </h1>

        <div className="hero__bottom">
          <p className="hero__sub">
            {t(
              'Let our family show your family the way home — luxury villas, beachfront condos, and concierge service across the Mexican Caribbean.',
              'Deja que nuestra familia le muestre a la tuya el camino a casa — villas de lujo, condominios frente al mar y servicio de concierge en todo el Caribe Mexicano.'
            )}
          </p>
          <div className="hero__scroll">
            <span>{t('Scroll to explore', 'Desliza para explorar')}</span>
            <span className="hero__scroll-line" />
          </div>
        </div>
      </div>

      {/* Oculto temporalmente: widget de reservas */}
      {/* <SearchWidget /> */}
    </section>
  )
}
