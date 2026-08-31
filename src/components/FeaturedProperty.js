'use client'
import { useState, useEffect, useRef } from 'react'
import {
  TbPool, TbBath, TbPlant2, TbAirConditioning, TbWifi, TbToolsKitchen2,
  TbSofa, TbBuildingStore, TbBed, TbWashTumbleDry, TbElevator, TbSparkles,
  TbWind, TbHanger, TbWorldWww, TbIroning, TbDeviceTv, TbWashMachine,
  TbBarbell, TbKayak, TbSunset, TbTrees, TbFence, TbGolf, TbBriefcase,
} from 'react-icons/tb'
import { useLang } from '@/context/LangContext'

const WHATSAPP_NUMBER = '529842031391'

const tulumImages = Array.from({ length: 23 }, (_, i) => `/assets/CARM-103/${String(i + 1).padStart(2, '0')}.jpg`)

const tulumAmenities = [
  { en: 'Shared pool', es: 'Alberca compartida', Icon: TbPool },
  { en: 'Jacuzzi', es: 'Jacuzzi', Icon: TbBath },
  { en: 'Tropical garden & lounge', es: 'Jardín y lounge tropical', Icon: TbPlant2 },
  { en: 'A/C', es: 'Aire acondicionado', Icon: TbAirConditioning },
  { en: 'WiFi', es: 'WiFi', Icon: TbWifi },
  { en: 'Equipped kitchen', es: 'Cocina equipada', Icon: TbToolsKitchen2 },
  { en: 'Sofa bed', es: 'Sofá cama', Icon: TbSofa },
  { en: 'Boutique building', es: 'Edificio boutique', Icon: TbBuildingStore },
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

// ─── Oferta 2: ZILHA3 (Depto en Playa del Carmen, cerca de Playa Mamitas) ───
// Fotos en public/assets/ZILHA3/ (portada: ZILHA-MAIN-PICTURE.jpg).
// PENDIENTE del usuario: precio real, priceUnit (/mes o /noche), tipo de renta
// (badge), nº de recámaras/huéspedes y el link de reserva (Guesty).
const zilhaImages = [
  '/assets/ZILHA3/ZILHA-MAIN-PICTURE.jpg',
  '/assets/ZILHA3/ai6j0p4qdcvxu03ncrwv.jpg',
  '/assets/ZILHA3/c63j1mwnalutie6fd4s5.jpg',
  '/assets/ZILHA3/ghqblejczp7yav4s2pm1.jpg',
  '/assets/ZILHA3/h34kan64uxp82av1y1me.jpg',
  '/assets/ZILHA3/jsvdquvhc8gi1zvgga2l.jpg',
  '/assets/ZILHA3/kxiz7qpvxrmjao4afuic.jpg',
  '/assets/ZILHA3/q0zwschtcqalurxfjsa8.jpg',
  '/assets/ZILHA3/qcczf76wimetob8y2j2b.jpg',
  '/assets/ZILHA3/rkdrsp99tncnhftwspv3.jpg',
  '/assets/ZILHA3/ry5g1fwwa3lvviiiqwwb.jpg',
  '/assets/ZILHA3/sn1staxke1llwzr8ya04.jpg',
  '/assets/ZILHA3/tptoy8qtbzabr4ytgr5m.jpg',
  '/assets/ZILHA3/tuzftnhgvekepzlyzbp6.jpg',
  '/assets/ZILHA3/twvbvfaomya83sjxpf4u.jpg',
  '/assets/ZILHA3/vdfwxhwk8gjm01ujvbp1.jpg',
  '/assets/ZILHA3/wcvznb3judzwmlarxrml.jpg',
  '/assets/ZILHA3/zee6ri0avzkf0qpfedgv.jpg',
]

const zilhaAmenities = [
  { en: 'Bed linen', es: 'Ropa de cama', Icon: TbBed },
  { en: 'Dryer', es: 'Secadora', Icon: TbWashTumbleDry },
  { en: 'Elevator', es: 'Ascensor', Icon: TbElevator },
  { en: 'Essentials', es: 'Artículos básicos', Icon: TbSparkles },
  { en: 'Hair dryer', es: 'Secador de pelo', Icon: TbWind },
  { en: 'Hangers', es: 'Perchas', Icon: TbHanger },
  { en: 'Internet', es: 'Internet', Icon: TbWorldWww },
  { en: 'Iron', es: 'Plancha', Icon: TbIroning },
  { en: 'Kitchen', es: 'Cocina', Icon: TbToolsKitchen2 },
  { en: 'TV', es: 'TV', Icon: TbDeviceTv },
  { en: 'Washer', es: 'Lavadora', Icon: TbWashMachine },
  { en: 'Wi-Fi', es: 'Wi-Fi', Icon: TbWifi },
]

const zilhaOffer = {
  id: 'zilha3',
  images: zilhaImages,
  badge: { en: 'Monthly rental', es: 'Renta mensual' }, // TODO: confirmar tipo de renta
  titlePre: { en: 'Apartment in', es: 'Departamento en' },
  titleEm: 'Playa del Carmen',
  price: '$14,000 MXN',
  priceUnit: { en: '/ month', es: '/ mes' }, // TODO: confirmar (/mes o /noche)
  specs: {
    en: 'Loft · Near Mamitas Beach · Playa del Carmen',
    es: 'Loft · Cerca de Playa Mamitas · Playa del Carmen',
  },
  body: {
    en: "Ground-floor loft with private patio, plunge pool, and rooftop terrace, 4 blocks from the beach and 3 from 5th Avenue. Fully-equipped kitchen and perfect for families or friends who want everything walkable — Mamitas Beach, dining, and nightlife — without a car.",
    es: 'Loft en planta baja con patio privado, alberca chica y terraza en la azotea, a 4 cuadras de la playa y 3 de la Quinta Avenida. Cocina totalmente equipada, ideal para familias o amigos que quieren todo a pie —Playa Mamitas, restaurantes y vida nocturna— sin necesidad de auto.',
  },
  amenities: zilhaAmenities,
  bookingUrl: '#', // TODO: link de Guesty
}

// ─── Oferta 3: LAG505E (Depto en Lagunas de Mayakoba, Playa del Carmen) ─────
// Fotos en public/assets/LAG505E/ (portada: MAIN-LAG505E.jpg).
// PENDIENTE del usuario: precio real, priceUnit (/mes o /noche), tipo de renta
// (badge) y el link de reserva (Guesty).
const lagImages = [
  '/assets/LAG505E/MAIN-LAG505E.jpg',
  '/assets/LAG505E/a073iryzheafs5nou5kk.jpg',
  '/assets/LAG505E/b0n6hleins6aolpg1yth.jpg',
  '/assets/LAG505E/cznyeggohfx1k7ixomoh.jpg',
  '/assets/LAG505E/dmkzuqvowkqj2zbvdvh7.jpg',
  '/assets/LAG505E/dvuxzluunw8kg0ldj9rn.jpg',
  '/assets/LAG505E/egk0ojzg4jqfkorii3ck.jpg',
  '/assets/LAG505E/ek1ip0rf9japsfwbcirn.jpg',
  '/assets/LAG505E/frcezhwommydj76s8rgi.jpg',
  '/assets/LAG505E/gef85g10qvnk1ffsht8k.jpg',
  '/assets/LAG505E/gtmzjp3f01bc5s4qgr7h.jpg',
  '/assets/LAG505E/i4ytix6kypuomulixl06.jpg',
  '/assets/LAG505E/jfxyevqo6bribekp1jzf.jpg',
  '/assets/LAG505E/jjmesqi4crubjjab6scm.jpg',
  '/assets/LAG505E/ludcgdkwelckmsdrihag.jpg',
  '/assets/LAG505E/muolsffiv8hrenu4hcil.jpg',
  '/assets/LAG505E/ofhiqpcsxwbpdlkgme6z.jpg',
  '/assets/LAG505E/ooj3ndikhqbwsk26wmia.jpg',
  '/assets/LAG505E/uk54fef2sj4bun5dipfa.jpg',
  '/assets/LAG505E/vasag24rhunopjixafwv.jpg',
  '/assets/LAG505E/wxqgvqvqam3o6ggolr9j.jpg',
  '/assets/LAG505E/zfgi9wuxia3cpexgf29d.jpg',
  '/assets/LAG505E/zgyzhhxovrjog5i29ita.jpg',
]

const lagAmenities = [
  { en: 'Infinity pools', es: 'Albercas infinity', Icon: TbPool },
  { en: 'Gym', es: 'Gimnasio', Icon: TbBarbell },
  { en: 'Kayakable lagoon', es: 'Laguna para kayak', Icon: TbKayak },
  { en: 'Private terrace', es: 'Terraza privada', Icon: TbSunset },
  { en: 'Jungle setting', es: 'Entorno de selva', Icon: TbTrees },
  { en: 'Gated community', es: 'Comunidad privada', Icon: TbFence },
  { en: 'Near El Camaleón Golf', es: 'Cerca del golf El Camaleón', Icon: TbGolf },
  { en: 'Dedicated workspace', es: 'Espacio de trabajo', Icon: TbBriefcase },
  { en: 'Washer', es: 'Lavadora', Icon: TbWashMachine },
  { en: 'Dryer', es: 'Secadora', Icon: TbWashTumbleDry },
  { en: 'Wi-Fi', es: 'Wi-Fi', Icon: TbWifi },
]

const lagOffer = {
  id: 'lag505e',
  images: lagImages,
  badge: { en: 'Monthly rental', es: 'Renta mensual' }, // TODO: confirmar tipo de renta
  titlePre: { en: 'Apartment in', es: 'Departamento en' },
  titleEm: 'Mayakoba PDC',
  subtitle: 'Lagunas de Mayakoba',
  price: '$22,000 MXN',
  priceUnit: { en: '/ month', es: '/ mes' }, // TODO: confirmar (/mes o /noche)
  specs: {
    en: 'Apartment · Up to 4 Guests · Lagunas de Mayakoba',
    es: 'Departamento · Hasta 4 Huéspedes · Lagunas de Mayakoba',
  },
  body: {
    en: "Contemporary condo inside the jungle-wrapped Lagunas de Mayakoba gated community — kayakable lagoon, infinity pools, and a private 5th-floor terrace over native vegetation. Two miles from Xcalacoco Beach and next to El Camaleón Golf Course (PGA Tour). Washer, dryer, and a dedicated workspace included — built for families and groups exploring the Riviera Maya from a quiet jungle setting.",
    es: 'Condominio contemporáneo dentro de Lagunas de Mayakoba, comunidad privada rodeada de selva, con laguna navegable en kayak, albercas infinity y terraza privada en el 5º piso sobre la vegetación nativa. A 3 km de Playa Xcalacoco y junto al campo de golf El Camaleón (PGA Tour). Incluye lavadora, secadora y espacio de trabajo — ideal para familias y grupos que exploran la Riviera Maya desde un entorno tranquilo.',
  },
  amenities: lagAmenities,
  bookingUrl: '#', // TODO: link de Guesty
}

const offers = [
  tulumOffer,
  zilhaOffer,
  lagOffer,
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

  // Swipe táctil entre ofertas (móvil)
  const touchStart = useRef(null)
  const onTouchStart = (e) => {
    const p = e.touches[0]
    touchStart.current = { x: p.clientX, y: p.clientY }
  }
  const onTouchEnd = (e) => {
    if (!touchStart.current || totalOffers < 2) return
    const p = e.changedTouches[0]
    const dx = p.clientX - touchStart.current.x
    const dy = p.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? nextOffer() : prevOffer()
    }
  }

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

        <div
          className="featured-property__stage"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {offers.map((offer, oi) => {
            const isActive = oi === offerIdx
            const waText = encodeURIComponent(
              t(
                `Hi Vimex! I'm interested in the monthly offer: ${offer.titlePre.en} ${offer.titleEm} (${offer.price} ${offer.priceUnit.en}).`,
                `¡Hola Vimex! Me interesa la oferta del mes: ${offer.titlePre.es} ${offer.titleEm} (${offer.price} ${offer.priceUnit.es}).`
              )
            )
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`
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
                    {offer.subtitle && (
                      <div className="featured-property__subtitle">{offer.subtitle}</div>
                    )}

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
                        <span key={a.es}>
                          {a.Icon && <a.Icon aria-hidden="true" />}
                          {t(a.en, a.es)}
                        </span>
                      ))}
                    </div>

                    <div className="featured-property__actions">
                      <a href={offer.bookingUrl} className="btn btn--primary reveal-up delay-2" data-magnetic>
                        <span>{t('Book Now', 'Reservar Ahora')}</span>
                        <span className="arrow">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                        </span>
                      </a>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--ghost featured-property__wa reveal-up delay-3"
                        data-magnetic
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.9 9.825 9.825 0 012.892 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                        </svg>
                        <span>{t('Chat on WhatsApp', 'Escríbenos por WhatsApp')}</span>
                      </a>
                    </div>
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
