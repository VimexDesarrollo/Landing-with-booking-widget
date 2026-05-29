'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/context/LangContext'

const testimonials = [
  {
    img: 'https://images.unsplash.com/photo-1602002418679-2a30f6d31de6?w=1200&q=85',
    quote: {
      en: 'Vimex made our family vacation completely seamless. The villa was exactly as described and the team was reachable every time we needed them. We\'ll be back next year.',
      es: 'Vimex hizo que nuestras vacaciones familiares fueran completamente perfectas. La villa era exactamente como la describían y el equipo estuvo disponible cada vez que los necesitamos. Volveremos el próximo año.',
    },
    author: 'Sarah M.',
    sub: 'California, USA · Villa Brianna',
  },
  {
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85',
    quote: {
      en: "After 10 years vacationing in Playa del Carmen, Vimex is hands-down the most professional rental team we've worked with. Their local knowledge and attention to detail is unmatched.",
      es: 'Después de 10 años vacacionando en Playa del Carmen, Vimex es sin duda el equipo de rentas más profesional con el que hemos trabajado. Su conocimiento local y atención al detalle son inigualables.',
    },
    author: 'Carlos & Ana R.',
    sub: { en: 'Mexico City · Aldea Thai Studio', es: 'Ciudad de México · Aldea Thai Studio' },
  },
  {
    img: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1200&q=85',
    quote: {
      en: 'The property management service they provide for my condo has exceeded every expectation — transparent reporting, great guests, and absolutely zero headaches on my end.',
      es: 'El servicio de administración de propiedades que brindan para mi condominio ha superado cada expectativa — reportes transparentes, excelentes huéspedes y absolutamente cero dolores de cabeza.',
    },
    author: 'David L.',
    sub: { en: 'Toronto, Canada · Property Owner', es: 'Toronto, Canadá · Propietario' },
  },
]

export default function Testimonials() {
  const { t } = useLang()
  const [idx, setIdx] = useState(0)
  const total = testimonials.length

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setIdx((i) => (i + 1) % total)
    }, 7000)
    return () => clearInterval(id)
  }, [total])

  const prev = () => setIdx((i) => (i - 1 + total) % total)
  const next = () => setIdx((i) => (i + 1) % total)

  return (
    <section className="testimonials" data-reveal>
      <div className="testimonials__head">
        <div>
          <div className="section__eyebrow" style={{ color: 'var(--teal)' }}>
            {t('Guest Reviews', 'Opiniones de Huéspedes')}
          </div>
          <h2 className="section__title reveal-up" style={{ color: '#fff' }}>
            <span>{t('What our', 'Lo que dicen')}</span>
            <em>{t('guests say.', 'nuestros huéspedes.')}</em>
          </h2>
        </div>
        <div className="testimonials__controls">
          <button onClick={prev} aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button onClick={next} aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="testimonials__stage">
        {testimonials.map((item, i) => (
          <div className={`testimonial${i === idx ? ' is-active' : ''}`} key={i}>
            <div className="testimonial__media">
              <div className="bg" style={{ backgroundImage: `url('${item.img}')` }} />
            </div>
            <div>
              <blockquote className="testimonial__quote">
                {t(item.quote.en, item.quote.es)}
              </blockquote>
              <div className="testimonial__author">
                <strong>{item.author}</strong>
                <span>{typeof item.sub === 'string' ? item.sub : t(item.sub.en, item.sub.es)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonials__indicator">
        <span className="count">
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span
          className="bar"
          style={{ '--p': (idx + 1) / total }}
        />
        <span>{t('Read more reviews', 'Más reseñas')}</span>
      </div>
    </section>
  )
}
