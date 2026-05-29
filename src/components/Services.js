'use client'
import { useLang } from '@/context/LangContext'

const ArrowDiag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 17 17 7M7 7h10v10"/>
  </svg>
)

export default function Services() {
  const { t } = useLang()

  const services = [
    {
      num: '01',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>
        </svg>
      ),
      title: t('Property Maintenance', 'Mantenimiento de Propiedades'),
      body: t(
        'Proactive upkeep, preventative measures, and rapid response to all maintenance needs — preserving your property\'s value year after year.',
        'Mantenimiento proactivo, medidas preventivas y respuesta rápida a todas las necesidades, preservando el valor de tu propiedad año tras año.'
      ),
    },
    {
      num: '02',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
        </svg>
      ),
      title: t('Guest Management', 'Gestión de Huéspedes'),
      body: t(
        'From booking inquiries to seamless check-ins and personalized support, we ensure every guest enjoys a memorable, frictionless stay.',
        'Desde consultas de reserva hasta check-ins sin contratiempos y atención personalizada, garantizamos que cada huésped disfrute de una estancia memorable y sin contratiempos.'
      ),
    },
    {
      num: '03',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 20V8l9-5 9 5v12"/><path d="M9 22V12h6v10"/>
        </svg>
      ),
      title: t('Marketing & Booking', 'Marketing y Reservas'),
      body: t(
        'Strategic listing optimization, professional photography, and dynamic pricing to achieve maximum occupancy and revenue.',
        'Optimización estratégica de anuncios, fotografía profesional y precios dinámicos para lograr la máxima ocupación e ingresos.'
      ),
    },
    {
      num: '04',
      icon: (
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 6-6"/>
        </svg>
      ),
      title: t('Financial Reporting', 'Reportes Financieros'),
      body: t(
        'Clear, transparent financial statements, detailed performance insights, and easy access to all your property\'s data — anytime.',
        'Estados financieros claros y transparentes, información detallada del rendimiento y acceso fácil a todos los datos de tu propiedad — en cualquier momento.'
      ),
    },
  ]

  return (
    <section id="services" className="services" data-reveal>
      <div className="services__head">
        <div>
          <div className="section__eyebrow">{t('What We Do', 'Lo Que Hacemos')}</div>
          <h2 className="section__title reveal-up">
            <span>{t('Our comprehensive', 'Nuestros servicios')}</span><br/>
            <em>{t('services.', 'integrales.')}</em>
          </h2>
        </div>
        <div className="right">
          <p className="services__sub reveal-up delay-1">
            {t(
              "A full suite of services designed to maximize your property's potential and ensure a superior experience for every guest who walks through the door.",
              'Una gama completa de servicios diseñados para maximizar el potencial de tu propiedad y garantizar una experiencia superior para cada huésped que cruza la puerta.'
            )}
          </p>
          <a href="#contact" className="btn btn--primary reveal-up delay-2" data-magnetic>
            <span>{t('Contact Us', 'Escríbenos')}</span>
            <span className="arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </span>
          </a>
        </div>
      </div>

      <div className="services__list">
        {services.map((s) => (
          <div className="service" key={s.num}>
            <span className="service__num">{s.num}</span>
            <div>
              <span className="service__icon">{s.icon}</span>
              <h3 className="service__title">{s.title}</h3>
              <p className="service__body">{s.body}</p>
            </div>
            <span className="service__arrow"><ArrowDiag /></span>
          </div>
        ))}
      </div>
    </section>
  )
}
