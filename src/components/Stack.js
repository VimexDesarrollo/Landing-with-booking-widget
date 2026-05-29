'use client'
import { useEffect } from 'react'
import { useLang } from '@/context/LangContext'

const panels = [
  {
    num: '01 — Playa del Carmen',
    name: 'Playa del Carmen',
    img: '/assets/Playa-de-Carmen-Riviera-Maya.png',
    body: { en: 'Vibrant beach city with world-famous 5th Avenue, iconic beach clubs, and a cosmopolitan dining scene — the perfect base for Caribbean living.', es: 'Vibrante ciudad costera con la mundialmente famosa Quinta Avenida, beach clubs icónicos y una escena gastronómica cosmopolita — la base perfecta para vivir el Caribe.' },
    tags: ['Beach Clubs', 'Dining', 'Nightlife', 'Family'],
    reverse: false,
  },
  {
    num: '02 — Tulum',
    name: 'Tulum',
    img: '/assets/tulum.webp',
    body: { en: 'Bohemian-chic paradise where ancient Mayan ruins meet world-class wellness retreats, crystalline cenotes, and the most breathtaking jungle coastline in the Caribbean.', es: 'Paraíso bohemio-chic donde las ruinas mayas milenarias se encuentran con retiros de bienestar de clase mundial, cenotes cristalinos y la costa selvática más impresionante del Caribe.' },
    tags: ['Eco-Chic', 'Wellness', 'Cenotes', 'Ruins'],
    reverse: true,
  },
  {
    num: '03 — Akumal',
    name: 'Akumal',
    img: '/assets/akumal.webp',
    body: { en: 'A protected bay beloved by families — swim with sea turtles, snorkel a living coral reef, and enjoy the most tranquil stretch of turquoise Caribbean coastline.', es: 'Una bahía protegida amada por las familias — nada con tortugas marinas, haz snorkel en un arrecife de coral vivo y disfruta del tramo más tranquilo de la costa turquesa del Caribe.' },
    tags: ['Snorkeling', 'Sea Turtles', 'Family', 'Tranquil'],
    reverse: false,
  },
]

export default function Stack() {
  const { t } = useLang()

  useEffect(() => {
    const stackPanels = document.querySelectorAll('.stack__panel')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('is-active', e.isIntersecting))
    }, { threshold: 0.4 })
    stackPanels.forEach((p) => io.observe(p))
    return () => io.disconnect()
  }, [])

  return (
    <section className="stack">
      <div className="stack__intro" data-reveal>
        <div className="section__eyebrow" style={{ color: 'var(--teal)' }}>
          {t('Our Destinations', 'Nuestros Destinos')}
        </div>
        <h2 className="section__title reveal-up">
          <span>{t('Three destinations,', 'Tres destinos,')}</span>
          <em>{t('one Vimex.', 'un Vimex.')}</em>
        </h2>
        <p className="reveal-up delay-1">
          {t(
            'Playa del Carmen, Tulum, and Akumal — each with its own soul, united by the same turquoise sea. We curate exceptional properties across all three so you can live each one to the fullest.',
            'Playa del Carmen, Tulum y Akumal — cada uno con su propio alma, unidos por el mismo mar turquesa. Seleccionamos propiedades excepcionales en los tres para que puedas vivirlos al máximo.'
          )}
        </p>
      </div>

      <div className="stack__sticky">
        {panels.map((p) => (
          <div className="stack__panel" key={p.name}>
            <div className="stack__panel-inner">
              {p.reverse ? (
                <>
                  <div className="stack__panel-info">
                    <span className="stack__panel-num">{p.num}</span>
                    <h3 className="stack__panel-name">{p.name}</h3>
                    <p className="stack__panel-body">{t(p.body.en, p.body.es)}</p>
                    <div className="stack__panel-tags">
                      {p.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                  <div className="stack__panel-media">
                    <div className="bg" style={{ backgroundImage: `url('${p.img}')` }} />
                  </div>
                </>
              ) : (
                <>
                  <div className="stack__panel-media">
                    <div className="bg" style={{ backgroundImage: `url('${p.img}')` }} />
                  </div>
                  <div className="stack__panel-info">
                    <span className="stack__panel-num">{p.num}</span>
                    <h3 className="stack__panel-name">{p.name}</h3>
                    <p className="stack__panel-body">{t(p.body.en, p.body.es)}</p>
                    <div className="stack__panel-tags">
                      {p.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
