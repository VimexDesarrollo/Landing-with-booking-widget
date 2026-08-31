import { WHATSAPP_NUMBER } from '../constants'

/**
 * Arma el enlace wa.me con un mensaje prellenado sobre la oferta.
 * @param {object} offer  Oferta (usa titlePre, titleEm, price, priceUnit)
 * @param {'es'|'en'} lang Idioma activo
 */
export function buildWhatsAppUrl(offer, lang) {
  const msg = lang === 'en'
    ? `Hi Vimex! I'm interested in the monthly offer: ${offer.titlePre.en} ${offer.titleEm} (${offer.price} ${offer.priceUnit.en}).`
    : `¡Hola Vimex! Me interesa la oferta del mes: ${offer.titlePre.es} ${offer.titleEm} (${offer.price} ${offer.priceUnit.es}).`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}
