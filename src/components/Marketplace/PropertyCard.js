'use client'
import { useEffect, useRef, useState } from 'react'
import {
  TbBed, TbBath, TbUsers, TbMapPin, TbChevronLeft, TbChevronRight,
  TbBrandWhatsapp, TbCalendarCheck,
} from 'react-icons/tb'
import { useLang } from '@/context/LangContext'
import { WHATSAPP_NUMBER } from './constants'

function buildWhatsAppUrl(property, lang) {
  const msg = lang === 'en'
    ? `Hi Vimex! I'm interested in ${property.title}.`
    : `¡Hola Vimex! Me interesa ${property.title}.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

// Galería con crossfade — mismo mecanismo que ResidenceCard.tsx de booking-engine
// (dos <img> apiladas, la anterior se desvanece mientras la nueva ya está debajo),
// portado a JS plano sin Tailwind. Ver docs/porting-booking-engine-marketplace.md.
export function PropertyCard({ property }) {
  const { t, lang } = useLang()
  const price = property.prices?.basePrice
  const currency = property.prices?.currency || 'USD'
  const waUrl = buildWhatsAppUrl(property, lang)

  const images = property.pictures?.length ? property.pictures : []
  const hasMultipleImages = images.length > 1

  const [activeIndex, setActiveIndex] = useState(0)
  const [previousImage, setPreviousImage] = useState(null)
  const [isPreviousVisible, setIsPreviousVisible] = useState(false)
  const transitionTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [])

  const transitionToImage = (nextIndex) => {
    if (nextIndex === activeIndex) return

    const activeImage = images[activeIndex]?.original
    setPreviousImage(activeImage)
    setIsPreviousVisible(true)
    setActiveIndex(nextIndex)

    requestAnimationFrame(() => {
      setIsPreviousVisible(false)
    })

    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    transitionTimeoutRef.current = setTimeout(() => {
      setPreviousImage(null)
      transitionTimeoutRef.current = null
    }, 300)
  }

  const showPreviousImage = (e) => {
    e.preventDefault()
    transitionToImage((activeIndex - 1 + images.length) % images.length)
  }

  const showNextImage = (e) => {
    e.preventDefault()
    transitionToImage((activeIndex + 1) % images.length)
  }

  const currentImage = images[activeIndex]?.original

  return (
    <article className="property-card">
      <div className="property-card__image">
        {currentImage && (
          <img
            className="property-card__gallery-img"
            src={currentImage}
            alt={property.title}
            loading="lazy"
          />
        )}
        {previousImage && (
          <img
            className={`property-card__gallery-img property-card__gallery-img--previous${isPreviousVisible ? ' is-visible' : ''}`}
            src={previousImage}
            alt=""
            aria-hidden="true"
          />
        )}

        <span className="property-card__badge">{property.propertyType}</span>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              className="property-card__gallery-nav property-card__gallery-nav--prev"
              aria-label={t('Previous photo', 'Foto anterior')}
              onClick={showPreviousImage}
            >
              <TbChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="property-card__gallery-nav property-card__gallery-nav--next"
              aria-label={t('Next photo', 'Foto siguiente')}
              onClick={showNextImage}
            >
              <TbChevronRight size={18} />
            </button>
            <div className="property-card__dots" aria-label={t('Photo pagination', 'Paginación de fotos')}>
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`property-card__dot${i === activeIndex ? ' is-active' : ''}`}
                  aria-label={t(`Show photo ${i + 1}`, `Ver foto ${i + 1}`)}
                  aria-pressed={i === activeIndex}
                  onClick={(e) => { e.preventDefault(); transitionToImage(i) }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="property-card__body">
        <h3 className="property-card__title">{property.title}</h3>
        <div className="property-card__location">
          <TbMapPin size={14} />
          <span>{property.address?.city}, {property.address?.state}</span>
        </div>
        <div className="property-card__specs">
          <span><TbUsers size={14} /> {property.accommodates}</span>
          <span><TbBed size={14} /> {property.bedrooms}</span>
          <span><TbBath size={14} /> {property.bathrooms}</span>
        </div>
        <div className="property-card__price">
          <strong>{currency} ${price}</strong>
          <span>{t('/ night', '/ noche')}</span>
        </div>

        <div className="property-card__actions">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="property-card__action property-card__action--whatsapp"
          >
            <TbBrandWhatsapp size={16} />
            <span>WhatsApp</span>
          </a>
          {/* bookingUrl viene vacío hasta que exista un motor de reservas real
              por propiedad (ver mockProperties.js / mapGuestyListing.js) —
              placeholder a '#' a propósito, no un link roto por accidente.
              target="_blank" SOLO cuando hay URL real: con href="#" abrir
              pestaña nueva navega a about:blank (pestaña en blanco), justo lo
              que no queremos — sin bookingUrl, el link se queda igual que
              antes (sin abrir nada nuevo). */}
          <a
            href={property.bookingUrl || '#'}
            {...(property.bookingUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="property-card__action property-card__action--book"
          >
            <TbCalendarCheck size={16} />
            <span>{t('Book Now', 'Reservar Ahora')}</span>
          </a>
        </div>
      </div>
    </article>
  )
}
