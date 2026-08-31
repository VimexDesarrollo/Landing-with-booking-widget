'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/context/LangContext'

const tulumImages = Array.from({ length: 23 }, (_, i) => `/assets/CARM-103/${String(i + 1).padStart(2, '0')}.jpg`)

const tulumAmenities = [
  { en: 'Shared pool', es: 'Alberca compartida' },
  { en: 'Jacuzzi', es: 'Jacuzzi' },
  { en: 'Tropical garden & lounge', es: 'Jardín y lounge tropical' },
  { en: 'A/C', es: 'Aire acondicionado' },
  { en: 'WiFi', es: 'WiFi' },
  { en: 'Equipped kitchen', es: 'Cocina equipada' },
  { en: 'Sofa bed', es: 'Sofá cama' },
  { en: 'Boutique building', es: 'Edificio boutique' },
]

const tulumOffer = {
  id: 'tulum-carm-103',
  images: tulumImages,
  badge: { en: 'Monthly rental', es: 'Renta mensual' },
  titlePre: { en: 'Apartment in', es: 'Departamento en' },
  titleEm: 'Tulum',
  price: '$21,000 MXN',
  priceUnit: { en: '/ month', es: '/ mes' },
  specs: {
    en: '2 Bedrooms + sofa bed · Up to 6 Guests · Tulum',
    es: '2 Recámaras + sofá cama · Hasta 6 Huéspedes · Tulum',
  },
  body: {
    en: "Inside a boutique building wrapped in tropical gardens in Tulum, this 2-bedroom condo comes with a sofa bed for up to 6 guests and access to a shared pool, jacuzzi, and lounge area under the trees. This month only, book at an exclusive monthly rate before it's gone.",
    es: 'Dentro de un edificio boutique rodeado de jardines tropicales en Tulum, este condominio de 2 recámaras incluye sofá cama para hasta 6 huéspedes y acceso a alberca compartida, jacuzzi y área de lounge entre los árboles. Solo este mes, resérvalo a una tarifa mensual exclusiva antes de que se agote.',
  },
  amenities: tulumAmenities,
  bookingUrl: '#',
}

// TODO: ofertas 2 y 3 son placeholders (copia del Tulum). Reemplazar con el
// contenido real de cada oferta cuando el usuario lo proporcione, y añadir
// sus carpetas de imágenes en public/assets/.
const offers = [
  tulumOffer,
  { ...tulumOffer, id: 'oferta-2' },
  { ...tulumOffer, id: 'oferta-3' },
]

export default function FeaturedProperty() {
  const { t } = useLang()
  const [offerIdx, setOfferIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const totalOffers = offers.length

  // Auto-rotación del carrusel de ofertas
  useEffect(() => {
    if (totalOffers < 2) return
    const id = setInterval(() => {
      if (!document.hidden) setOfferIdx((i) => (i + 1) % totalOffers)
    }, 8000)
    return () => clearInterval(id)
  }, [totalOffers])

  // Galería de fotos interna de la oferta activa
  useEffect(() => {
    setImgIdx(0)
    const total = offers[offerIdx].images.length
    const id = setInterval(() => {
      if (!document.hidden) setImgIdx((i) => (i + 1) % total)
    }, 5000)
    return () => clearInterval(id)
  }, [offerIdx])

  const prevOffer = () => setOfferIdx((i) => (i - 1 + totalOffers) % totalOffers)
  const nextOffer = () => setOfferIdx((i) => (i + 1) % totalOffers)

  const activeImages = offers[offerIdx].images
  const prevImg = () => setImgIdx((i) => (i - 1 + activeImages.length) % activeImages.length)
  const nextImg = () => setImgIdx((i) => (i + 1) % activeImages.length)

  return (
    <section id="oferta-del-mes" className="section section--dark featured-property" data-reveal>
      <div className="featured-property__carousel">
        {totalOffers > 1 && (
          <button
            className="featured-property__nav featured-property__nav--prev"
            onClick={prevOffer}
            aria-label={t('Previous offer', 'Oferta anterior')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="featured-property__stage">
          {offers.map((offer, oi) => {
            const isActive = oi === offerIdx
            return (
              <div
                className={`featured-property__offer${isActive ? ' is-active' : ''}`}
                key={offer.id}
                aria-hidden={!isActive}
              >
                <div className="featured-property__grid">
                  <div className="featured-property__gallery">
                    {offer.images.map((src, i) => (
                      <div
                        className={`featured-property__slide${isActive && i === imgIdx ? ' is-active' : (!isActive && i === 0 ? ' is-active' : '')}`}
                        key={src}
                      >
                        <div className="bg" style={{ backgroundImage: `url('${src}')` }} />
                      </div>
                    ))}
                    <div className="featured-property__controls">
                      <button onClick={prevImg} aria-label="Previous photo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button onClick={nextImg} aria-label="Next photo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="section__eyebrow">{t('Monthly Offers', 'Ofertas del Mes')}</div>
                    <h2 className="section__title reveal-up">
                      <span>{t(offer.titlePre.en, offer.titlePre.es)}</span> <em>{offer.titleEm}</em>
                    </h2>

                    <div className="featured-property__badge">
                      {t(offer.badge.en, offer.badge.es)}
                    </div>

                    <div className="featured-property__price">
                      {offer.price} <span>{t(offer.priceUnit.en, offer.priceUnit.es)}</span>
                    </div>

                    <div className="featured-property__specs">
                      {t(offer.specs.en, offer.specs.es)}
                    </div>

                    <p className="featured-property__body">
                      {t(offer.body.en, offer.body.es)}
                    </p>

                    <div className="featured-property__amenities">
                      {offer.amenities.map((a) => (
                        <span key={a.es}>{t(a.en, a.es)}</span>
                      ))}
                    </div>

                    <a href={offer.bookingUrl} className="btn btn--primary reveal-up delay-2" data-magnetic>
                      <span>{t('Book Now', 'Reservar Ahora')}</span>
                      <span className="arrow">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {totalOffers > 1 && (
          <button
            className="featured-property__nav featured-property__nav--next"
            onClick={nextOffer}
            aria-label={t('Next offer', 'Siguiente oferta')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  )
}
