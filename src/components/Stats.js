'use client'
import { useEffect, useRef } from 'react'
import { useLang } from '@/context/LangContext'

function Counter({ target, decimals = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const duration = 2000
          const start = performance.now()
          function tick(now) {
            const progress = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - progress, 3)
            el.textContent = (target * eased).toFixed(decimals)
            if (progress < 1) requestAnimationFrame(tick)
            else el.textContent = target.toFixed(decimals)
          }
          requestAnimationFrame(tick)
          io.unobserve(el)
        }
      })
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [target, decimals])

  return <span ref={ref}>0</span>
}

export default function Stats() {
  const { t } = useLang()
  return (
    <section className="stats" data-reveal>
      <div className="stats__bg" />
      <div className="stats__inner">
        <div className="section__eyebrow" style={{ color: 'var(--teal)' }}>
          {t('By the Numbers', 'En Números')}
        </div>
        <h2 className="section__title reveal-up" style={{ color: '#fff', maxWidth: '22ch' }}>
          <span>{t('Two decades of trusted service in', 'Dos décadas de servicio de confianza en')}</span>
          {' '}
          <em>{t('Playa del Carmen, Tulum & Akumal.', 'Playa del Carmen, Tulum y Akumal.')}</em>
        </h2>

        <div className="stats__grid">
          <div className="stats__item reveal-up">
            <span className="stats__val"><Counter target={20} /><em>+</em></span>
            <span className="stats__label">{t('Years serving our destinations', 'Años sirviendo nuestros destinos')}</span>
          </div>
          <div className="stats__item reveal-up delay-1">
            <span className="stats__val"><Counter target={150} /><em>+</em></span>
            <span className="stats__label">{t('Properties under management', 'Propiedades en gestión')}</span>
          </div>
          <div className="stats__item reveal-up delay-2">
            <span className="stats__val"><Counter target={10000} /><em>+</em></span>
            <span className="stats__label">{t('Happy guests served', 'Huéspedes satisfechos')}</span>
          </div>
          <div className="stats__item reveal-up delay-3">
            <span className="stats__val"><Counter target={4.9} decimals={1} /><em>★</em></span>
            <span className="stats__label">{t('Average guest rating', 'Calificación promedio')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
