'use client'
import { useEffect, useRef } from 'react'
import { useLang } from '@/context/LangContext'

export default function RivieraMaya() {
  const { t } = useLang()
  const bgRef = useRef(null)

  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return
    const onScroll = () => {
      const rect = bg.parentElement.getBoundingClientRect()
      const center = rect.top + rect.height / 2 - window.innerHeight / 2
      bg.style.transform = `scale(1.15) translateY(${-center * 0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="riviera">
      <div className="riviera__hero" data-reveal>
        <div
          className="riviera__bg"
          ref={bgRef}
          style={{ backgroundImage: "url('/assets/Playa-de-Carmen-Riviera-Maya.png')" }}
        />
        <div className="riviera__overlay">
          <div className="riviera__meta">Playa del Carmen, MX · 20°37′N 87°04′W</div>
          <h2 className="riviera__title">
            <span className="reveal-mask"><span>Riviera Maya.</span></span>
          </h2>
        </div>
      </div>

      <div className="riviera__body-wrap" data-reveal>
        <div className="riviera__caption reveal-up">
          {t(
            'Three destinations. One Caribbean soul.',
            'Tres destinos. Un alma caribeña.'
          )}
        </div>
        <div className="riviera__body reveal-up delay-1">
          <p>
            {t(
              'Playa del Carmen, Tulum, and Akumal each offer a distinct flavor of Caribbean living — from the cosmopolitan energy of La Quinta Avenida to the bohemian serenity of Tulum\'s jungle coastline and the peaceful turquoise bay of Akumal.',
              'Playa del Carmen, Tulum y Akumal ofrecen cada uno un sabor distinto de vida caribeña — desde la energía cosmopolita de la Quinta Avenida hasta la serenidad bohemia de la costa selvática de Tulum y la tranquila bahía turquesa de Akumal.'
            )}
          </p>
          <p>
            {t(
              'Together, these three destinations form the heart of what Vimex calls home — where over 20 years of family-run hospitality meet the warmth of the Mexican Caribbean.',
              'Juntos, estos tres destinos conforman el corazón de lo que Vimex llama hogar — donde más de 20 años de hospitalidad familiar se encuentran con la calidez del Caribe Mexicano.'
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
