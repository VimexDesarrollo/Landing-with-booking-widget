'use client'
import { useEffect, useRef } from 'react'
import { useLang } from '@/context/LangContext'

function useCounter(ref, target, decimals = 0) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const duration = 2000
          const start = performance.now()
          function tick(now) {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            const val = target * eased
            el.textContent = val.toFixed(decimals)
            if (t < 1) requestAnimationFrame(tick)
            else el.textContent = target.toFixed(decimals)
          }
          requestAnimationFrame(tick)
          io.unobserve(el)
        }
      })
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, target, decimals])
}

export default function FeelAtHome() {
  const { t } = useLang()
  const count20Ref = useRef(null)
  const countRatingRef = useRef(null)
  const mediaRef = useRef(null)

  useCounter(count20Ref, 20, 0)
  useCounter(countRatingRef, 4.9, 1)

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    const onScroll = () => {
      const rect = media.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      media.style.transform = `translateY(${-center * 0.07}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="feel" className="feel">
      <div className="feel__grid">
        <div className="feel__copy" data-reveal>
          <div className="section__eyebrow">{t('Your Home Away From Home', 'Tu Hogar Lejos de Casa')}</div>
          <h2>
            <span className="reveal-mask" style={{ display: 'block' }}>
              <span>{t('Feel at home in', 'Siéntete en casa en')}</span>
            </span>
            <span className="reveal-mask" style={{ display: 'block' }}>
              <em style={{ animationDelay: '0.14s' }}>{t('Playa del Carmen.', 'Playa del Carmen.')}</em>
            </span>
          </h2>
          <p className="feel__body reveal-up delay-1">
            {t(
              'We welcome everyone to what we truly feel is paradise — familiarizing you with your vacation home and its surroundings in Playa del Carmen, Tulum, and Akumal. Expect attentive bilingual service throughout your stay, and return home with beautiful memories of the Caribbean.',
              'Te damos la bienvenida a lo que consideramos un verdadero paraíso — familiarizándote con tu hogar vacacional y sus alrededores en Playa del Carmen, Tulum y Akumal. Espera de nosotros un servicio bilingüe y atento durante toda tu estancia, y regresa a casa con hermosos recuerdos del Caribe.'
            )}
          </p>

          <div className="feel__stats">
            <div className="feel__stat reveal-up delay-2">
              <span className="feel__stat-value">
                <span ref={count20Ref}>0</span>+
              </span>
              <span className="feel__stat-label">{t('Years of experience', 'Años de experiencia')}</span>
            </div>
            <div className="feel__stat reveal-up delay-3">
              <span className="feel__stat-value">100%</span>
              <span className="feel__stat-label">{t('Bilingual expert staff', 'Personal experto bilingüe')}</span>
            </div>
            <div className="feel__stat reveal-up delay-4">
              <span className="feel__stat-value">
                <em>★</em><span ref={countRatingRef}>0</span>
              </span>
              <span className="feel__stat-label">{t('Guest satisfaction', 'Satisfacción de huéspedes')}</span>
            </div>
          </div>
        </div>

        <div className="feel__media reveal-img-wrap" data-reveal ref={mediaRef}>
          <div
            className="bg"
            style={{ backgroundImage: "url('/assets/sirenas.png')" }}
          />
          <span className="feel__media-caption">Playa del Carmen · Quintana Roo</span>
        </div>
      </div>
    </section>
  )
}
