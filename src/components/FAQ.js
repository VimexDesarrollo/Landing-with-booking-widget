'use client'
import { useState } from 'react'
import { useLang } from '@/context/LangContext'

const faqs = [
  {
    q: { en: 'How do I book a vacation rental with Vimex?', es: '¿Cómo reservo una renta vacacional con Vimex?' },
    a: { en: 'Simply contact us directly via WhatsApp, phone, or the form on this page. Our bilingual team will confirm availability, walk you through the details of your chosen property, and coordinate everything — from the booking confirmation to a seamless arrival.', es: 'Simplemente contáctanos directamente por WhatsApp, teléfono o el formulario de esta página. Nuestro equipo bilingüe confirmará disponibilidad, te explicará los detalles de la propiedad elegida y coordinará todo — desde la confirmación de reserva hasta una llegada sin contratiempos.' },
  },
  {
    q: { en: 'What is included in a Vimex vacation rental?', es: '¿Qué incluye una renta vacacional de Vimex?' },
    a: { en: 'All our properties come fully furnished with kitchen essentials, linens, and towels. Many feature private pools, air conditioning, and high-speed Wi-Fi. Each listing clearly states what is provided so you can plan your stay with complete confidence.', es: 'Todas nuestras propiedades vienen completamente amuebladas con artículos de cocina, ropa de cama y toallas. Muchas cuentan con alberca privada, aire acondicionado y Wi-Fi de alta velocidad. Cada listado indica claramente qué se proporciona para que puedas planificar tu estancia con total confianza.' },
  },
  {
    q: { en: 'What destinations do you serve?', es: '¿Qué destinos atienden?' },
    a: { en: 'We specialize exclusively in three destinations: Playa del Carmen, Tulum, and Akumal. This focused approach allows us to offer deep local knowledge, hand-picked properties, and truly personalized service in each location.', es: 'Nos especializamos exclusivamente en tres destinos: Playa del Carmen, Tulum y Akumal. Este enfoque concentrado nos permite ofrecer un profundo conocimiento local, propiedades cuidadosamente seleccionadas y un servicio verdaderamente personalizado en cada lugar.' },
  },
  {
    q: { en: 'Do you offer property management services?', es: '¿Ofrecen servicios de administración de propiedades?' },
    a: { en: 'Yes. We offer full-service property management including guest communications, maintenance coordination, professional marketing, dynamic pricing strategy, and detailed financial reporting — all designed to maximize your rental income while you enjoy completely stress-free ownership.', es: 'Sí. Ofrecemos administración de propiedades integral que incluye comunicación con huéspedes, coordinación de mantenimiento, marketing profesional, estrategia de precios dinámicos y reportes financieros detallados — todo diseñado para maximizar tus ingresos mientras disfrutas de una propiedad sin complicaciones.' },
  },
  {
    q: { en: 'What is your cancellation policy?', es: '¿Cuál es su política de cancelación?' },
    a: { en: 'Cancellation terms vary by property and are clearly disclosed before any booking is confirmed. We strongly encourage guests to review the specific policy for their rental and to contact our team with any questions before finalizing a reservation.', es: 'Los términos de cancelación varían según la propiedad y se informan claramente antes de confirmar cualquier reserva. Recomendamos encarecidamente a los huéspedes revisar la política específica de su renta y contactar a nuestro equipo con cualquier duda antes de finalizar la reserva.' },
  },
  {
    q: { en: 'What languages does the Vimex team speak?', es: '¿Qué idiomas habla el equipo de Vimex?' },
    a: { en: 'Our entire staff is fully bilingual in English and Spanish, ensuring clear and friendly communication for guests and property owners from both North America and Mexico.', es: 'Todo nuestro personal es completamente bilingüe en inglés y español, garantizando una comunicación clara y amistosa para huéspedes y propietarios de Norteamérica y México.' },
  },
  {
    q: { en: 'How do I get from the airport to my rental?', es: '¿Cómo llego del aeropuerto a mi renta?' },
    a: { en: 'Playa del Carmen is about 45 minutes from the international airport, Tulum is around 90 minutes, and Akumal falls in between at roughly 60 minutes. We can recommend trusted private transportation services to get you to your rental safely and comfortably.', es: 'Playa del Carmen está a unos 45 minutos del aeropuerto internacional, Tulum a aproximadamente 90 minutos y Akumal a unos 60 minutos. Podemos recomendar servicios de transporte privado de confianza para llevarte a tu renta de forma segura y cómoda.' },
  },
]

export default function FAQ() {
  const { t } = useLang()
  const [open, setOpen] = useState(null)

  const toggle = (i) => setOpen(open === i ? null : i)

  return (
    <section className="faq" data-reveal>
      <div className="faq__head">
        <div>
          <div className="section__eyebrow">{t('Got Questions?', '¿Tienes Preguntas?')}</div>
          <h2 className="section__title reveal-up">
            <span>{t('Frequently asked', 'Preguntas')}</span>
            {' '}
            <em>{t('questions.', 'frecuentes.')}</em>
          </h2>
        </div>
        <p className="services__sub reveal-up delay-1">
          {t(
            "Everything you need to know before you book a stay or trust us with your property. Don't see your question? Reach out — we love a good conversation.",
            'Todo lo que necesitas saber antes de reservar una estancia o confiarnos tu propiedad. ¿No ves tu pregunta? Escríbenos — nos encanta una buena conversación.'
          )}
        </p>
      </div>

      <div className="faq__list">
        {faqs.map((faq, i) => (
          <div className={`faq__item${open === i ? ' is-open' : ''}`} key={i}>
            <button className="faq__q" onClick={() => toggle(i)}>
              <span className="faq__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="faq__q-text">{t(faq.q.en, faq.q.es)}</span>
              <span className="faq__toggle" />
            </button>
            <div className="faq__a">
              <div className="faq__a-inner">{t(faq.a.en, faq.a.es)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
