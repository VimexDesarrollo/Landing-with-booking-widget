'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/context/LangContext'

const images = Array.from({ length: 11 }, (_, i) => `/assets/huay-102/${String(i + 1).padStart(2, '0')}.jpg`)

const amenities = [
  { en: 'A/C', es: 'Aire acondicionado' },
  { en: 'WiFi', es: 'WiFi' },
  { en: 'Equipped kitchen', es: 'Cocina equipada' },
  { en: 'Washer & dryer', es: 'Lavadora y secadora' },
  { en: 'Elevator', es: 'Elevador' },
  { en: 'Balcony', es: 'Balcón' },
  { en: 'Cable TV', es: 'TV por cable' },
  { en: 'Linens included', es: 'Ropa de cama' },
  { en: 'Hair dryer', es: 'Secador de pelo' },
  { en: 'Iron', es: 'Plancha' },
]

export default function FeaturedProperty() {
  const { t } = useLang()
  const [idx, setIdx] = useState(0)
  const total = images.length

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setIdx((i) => (i + 1) % total)
    }, 5000)
    return () => clearInterval(id)
  }, [total])

  const prev = () => setIdx((i) => (i - 1 + total) % total)
  const next = () => setIdx((i) => (i + 1) % total)

  return (
    <section className="section section--dark featured-property" data-reveal>
      <div className="featured-property__grid">
        <div className="featured-property__gallery">
          {images.map((src, i) => (
            <div className={`featured-property__slide${i === idx ? ' is-active' : ''}`} key={src}>
              <div className="bg" style={{ backgroundImage: `url('${src}')` }} />
            </div>
          ))}
          <div className="featured-property__controls">
            <button onClick={prev} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button onClick={next} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <div>
          <div className="section__eyebrow">{t('Property of the Month', 'Oferta del Mes')}</div>
          <h2 className="section__title reveal-up">
            <span>{t('Huay', 'Huay')}</span> <em>102</em>
          </h2>

          <div className="featured-property__badge">
            {t('Minimum stay: 30 nights', 'Estancia mínima: 30 noches')}
          </div>

          <div className="featured-property__price">
            $800 MXN <span>{t('/ night', '/ noche')}</span>
          </div>

          <div className="featured-property__specs">
            {t('Studio · 3 Guests · Downtown Playa del Carmen', 'Estudio · 3 Huéspedes · Centro, Playa del Carmen')}
          </div>

          <p className="featured-property__body">
            {t(
              'Steps from 5th Avenue, Huay 102 is a fully-equipped studio designed for extended stays — the perfect base for digital nomads and long-term guests who want to live the Caribbean lifestyle without giving up comfort. This month only, book at an exclusive monthly rate before it\'s gone.',
              'A pasos de la Quinta Avenida, Huay 102 es un estudio totalmente equipado y pensado para estancias largas — la base perfecta para nómadas digitales y huéspedes de mediano plazo que quieren vivir el Caribe sin renunciar a la comodidad. Solo este mes, resérvalo a una tarifa mensual exclusiva antes de que se agote.'
            )}
          </p>

          <div className="featured-property__amenities">
            {amenities.map((a) => (
              <span key={a.es}>{t(a.en, a.es)}</span>
            ))}
          </div>

          <a href="https://vimexmx.guestybookings.com/es/properties/6a43e39a9ec77f0013eea387" className="btn btn--primary reveal-up delay-2" data-magnetic>
            <span>{t('Book Now', 'Reservar Ahora')}</span>
            <span className="arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
