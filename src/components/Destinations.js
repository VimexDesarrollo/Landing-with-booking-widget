'use client'
import { useRef } from 'react'
import { useLang } from '@/context/LangContext'

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
)
const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const ArrowDiag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 17 17 7M7 7h10v10"/>
  </svg>
)

const destinations = [
  {
    img: '/assets/Playa-de-Carmen-Riviera-Maya.png',
    num: '01 / 03',
    tag: { en: 'The Original', es: 'El Origen' },
    name: 'Playa del Carmen',
  },
  {
    img: '/assets/tulum.webp',
    num: '02 / 03',
    tag: { en: 'Bohemian Soul', es: 'Alma Bohemia' },
    name: 'Tulum',
  },
  {
    img: '/assets/akumal.webp',
    num: '03 / 03',
    tag: { en: 'Hidden Cove', es: 'Cala Secreta' },
    name: 'Akumal',
  },
]

export default function Destinations() {
  const { t } = useLang()
  const railRef = useRef(null)

  const scroll = (dir) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelector('.dest__card')
    rail.scrollBy({ left: dir * (card.offsetWidth + 32), behavior: 'smooth' })
  }

  return (
    <section id="dest" className="dest" data-reveal>
      <div className="dest__head">
        <div>
          <div className="section__eyebrow">{t('Popular Destinations', 'Destinos Populares')}</div>
          <h2 className="section__title reveal-up">
            <span>{t('Discover our', 'Descubre nuestros')}</span>
            <em>{t('destinations.', 'destinos.')}</em>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="why__arrow" onClick={() => scroll(-1)} aria-label="Previous">
            <ArrowLeft />
          </button>
          <button className="why__arrow" onClick={() => scroll(1)} aria-label="Next">
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className="dest__rail" ref={railRef}>
        {destinations.map((d) => (
          <div className="dest__card" key={d.name}>
            <div className="bg" style={{ backgroundImage: `url('${d.img}')` }} />
            <div className="dest__card-content">
              <span className="dest__card-num">{d.num}</span>
              <div>
                <div className="dest__card-tag">{t(d.tag.en, d.tag.es)}</div>
                <h3 className="dest__card-name">{d.name}</h3>
                <div className="dest__card-cta">
                  <span>{t('Explore', 'Explorar')}</span>
                  <span style={{ flex: 1 }} />
                  <span className="circle"><ArrowDiag /></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
