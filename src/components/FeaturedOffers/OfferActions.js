import { useLang } from '@/context/LangContext'
import { buildWhatsAppUrl } from './utils/whatsapp'
import { IconArrowCTA, IconWhatsApp } from './ui/icons'

export function OfferActions({ offer }) {
  const { t, lang } = useLang()
  const waUrl = buildWhatsAppUrl(offer, lang)

  return (
    <div className="featured-property__actions">
      <a href={offer.bookingUrl} className="btn btn--primary reveal-up delay-2" data-magnetic>
        <span>{t('Book Now', 'Reservar Ahora')}</span>
        <IconArrowCTA />
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--ghost featured-property__wa reveal-up delay-3"
        data-magnetic
      >
        <IconWhatsApp />
        <span>{t('Chat on WhatsApp', 'Escríbenos por WhatsApp')}</span>
      </a>
    </div>
  )
}
