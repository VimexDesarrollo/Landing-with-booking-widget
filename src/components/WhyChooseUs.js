'use client'
import { useLang } from '@/context/LangContext'

const ArrowDiag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 17 17 7M7 7h10v10"/>
  </svg>
)

const reasons = [
  {
    num: '— 01',
    title: { en: '20+ Years of Experience', es: '20+ Años de Experiencia' },
    body: { en: 'Two decades of trusted operations in Playa del Carmen, Tulum, and Akumal — we know every community, every property, and every nuance of the local market.', es: 'Dos décadas de operaciones de confianza en Playa del Carmen, Tulum y Akumal — conocemos cada comunidad, cada propiedad y cada matiz del mercado local.' },
    img: 'https://images.unsplash.com/photo-1521540216272-a50305cd4421?w=600&q=85',
  },
  {
    num: '— 02',
    title: { en: 'Bilingual Team', es: 'Equipo Bilingüe' },
    body: { en: 'Our fully bilingual English-Spanish staff ensures seamless communication for guests and owners from North America and Mexico alike.', es: 'Nuestro personal completamente bilingüe en inglés y español garantiza una comunicación fluida para huéspedes y propietarios de Norteamérica y México.' },
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=85',
  },
  {
    num: '— 03',
    title: { en: 'Vetted Properties', es: 'Propiedades Verificadas' },
    body: { en: "Every property in our portfolio is personally inspected and maintained to meet Vimex's strict quality standards — before any guest arrives.", es: 'Cada propiedad en nuestro portafolio es inspeccionada y mantenida personalmente bajo los estrictos estándares de calidad de Vimex — antes de cualquier llegada.' },
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=85',
  },
  {
    num: '— 04',
    title: { en: 'Local Experts', es: 'Expertos Locales' },
    body: { en: 'From the best cenotes to the hidden restaurants, our concierge knowledge makes your experience in Playa del Carmen, Tulum, and Akumal truly unforgettable.', es: 'Desde los mejores cenotes hasta los restaurantes ocultos, nuestro conocimiento de concierge hace que tu experiencia en Playa del Carmen, Tulum y Akumal sea verdaderamente inolvidable.' },
    img: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&q=85',
  },
  {
    num: '— 05',
    title: { en: 'Full Transparency', es: 'Total Transparencia' },
    body: { en: 'Property owners receive detailed financial reports, real-time updates, and direct communication — no surprises, ever.', es: 'Los propietarios reciben reportes financieros detallados, actualizaciones en tiempo real y comunicación directa — sin sorpresas, nunca.' },
    img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=85',
  },
]

export default function WhyChooseUs() {
  const { t } = useLang()
  return (
    <section className="why" data-reveal>
      <div className="why__head">
        <div>
          <div className="section__eyebrow">{t('Five Reasons', 'Cinco Razones')}</div>
          <h2 className="section__title reveal-up">
            <span>{t('Why choose', '¿Por qué elegir')}</span>
            <em> Vimex</em>
          </h2>
        </div>
        <p className="services__sub reveal-up delay-1">
          {t(
            'Five reasons thousands of guests and property owners have trusted us for over two decades in Playa del Carmen, Tulum, and Akumal.',
            'Cinco razones por las que miles de huéspedes y propietarios nos han confiado su experiencia durante más de dos décadas en Playa del Carmen, Tulum y Akumal.'
          )}
        </p>
      </div>

      <div className="why__list">
        {reasons.map((r) => (
          <div className="why__row" key={r.num}>
            <span className="why__num">{r.num}</span>
            <h3 className="why__title">{t(r.title.en, r.title.es)}</h3>
            <p className="why__body">{t(r.body.en, r.body.es)}</p>
            <span className="why__arrow"><ArrowDiag /></span>
            <div className="why__media" style={{ backgroundImage: `url('${r.img}')` }} />
          </div>
        ))}
      </div>
    </section>
  )
}
