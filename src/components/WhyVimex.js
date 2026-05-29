'use client'
import { useLang } from '@/context/LangContext'

export default function WhyVimex() {
  const { t } = useLang()
  return (
    <section className="why-vimex" data-reveal>
      <div className="why-vimex__grid">
        <div>
          <div className="section__eyebrow">{t('The Vimex Difference', 'La Diferencia Vimex')}</div>
          <h2 className="why-vimex__title reveal-up">
            <span>{t('Why', '¿Por qué')}</span>
            <em> Vimex?</em>
          </h2>
          <p className="why-vimex__body reveal-up delay-1">
            {t(
              'With over 20 years of trusted service in Playa del Carmen, Vimex has built a reputation for excellence, integrity, and genuine care. Our bilingual team treats every property like their own and every guest like family.',
              'Con más de 20 años de servicio de confianza en Playa del Carmen, Vimex ha construido una reputación de excelencia, integridad y cuidado genuino. Nuestro equipo bilingüe trata cada propiedad como propia y cada huésped como familia.'
            )}
          </p>
          <a href="#contact" className="btn btn--primary reveal-up delay-2" data-magnetic>
            <span>{t('Get in Touch', 'Escríbenos')}</span>
            <span className="arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </span>
          </a>
        </div>
        <div className="reveal-img-wrap" style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
          <div
            className="bg"
            style={{
              position: 'absolute', inset: 0,
              backgroundSize: 'cover', backgroundPosition: 'center',
              backgroundImage: "url('https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=1200&q=85')"
            }}
          />
        </div>
      </div>
    </section>
  )
}
