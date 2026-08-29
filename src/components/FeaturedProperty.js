'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/context/LangContext'

const images = Array.from({ length: 23 }, (_, i) => `/assets/CARM-103/${String(i + 1).padStart(2, '0')}.jpg`)

const amenities = [
  { en: 'Shared pool', es: 'Alberca compartida' },
  { en: 'Jacuzzi', es: 'Jacuzzi' },
  { en: 'Tropical garden & lounge', es: 'Jardín y lounge tropical' },
  { en: 'A/C', es: 'Aire acondicionado' },
  { en: 'WiFi', es: 'WiFi' },
  { en: 'Equipped kitchen', es: 'Cocina equipada' },
  { en: 'Sofa bed', es: 'Sofá cama' },
  { en: 'Boutique building', es: 'Edificio boutique' },
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
    <section id="oferta-del-mes" className="section section--dark featured-property" data-reveal>
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
            <span>{t('Apartment in', 'Departamento en')}</span> <em>Tulum</em>
          </h2>

          <div className="featured-property__badge">
            {t('Monthly rental', 'Renta mensual')}
          </div>

          <div className="featured-property__price">
            $21,000 MXN <span>{t('/ month', '/ mes')}</span>
          </div>

          <div className="featured-property__specs">
            {t('2 Bedrooms + sofa bed · Up to 6 Guests · Tulum', '2 Recámaras + sofá cama · Hasta 6 Huéspedes · Tulum')}
          </div>

          <p className="featured-property__body">
            {t(
              'Inside a boutique building wrapped in tropical gardens in Tulum, this 2-bedroom condo comes with a sofa bed for up to 6 guests and access to a shared pool, jacuzzi, and lounge area under the trees. This month only, book at an exclusive monthly rate before it\'s gone.',
              'Dentro de un edificio boutique rodeado de jardines tropicales en Tulum, este condominio de 2 recámaras incluye sofá cama para hasta 6 huéspedes y acceso a alberca compartida, jacuzzi y área de lounge entre los árboles. Solo este mes, resérvalo a una tarifa mensual exclusiva antes de que se agote.'
            )}
          </p>

          <div className="featured-property__amenities">
            {amenities.map((a) => (
              <span key={a.es}>{t(a.en, a.es)}</span>
            ))}
          </div>

          <a href="#" className="btn btn--primary reveal-up delay-2" data-magnetic>
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
