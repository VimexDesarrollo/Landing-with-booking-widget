import { useLang } from '@/context/LangContext'
import { EYEBROW } from './constants'
import { OfferAmenities } from './OfferAmenities'
import { OfferActions } from './OfferActions'

export function OfferDetails({ offer }) {
  const { t } = useLang()

  return (
    <div>
      <div className="section__eyebrow">{t(EYEBROW.en, EYEBROW.es)}</div>

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

      <OfferAmenities amenities={offer.amenities} />
      <OfferActions offer={offer} />
    </div>
  )
}
