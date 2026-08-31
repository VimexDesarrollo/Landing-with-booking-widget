import { useLang } from '@/context/LangContext'

export function OfferAmenities({ amenities }) {
  const { t } = useLang()

  return (
    <div className="featured-property__amenities">
      {amenities.map((a) => (
        <span key={a.es}>
          {a.Icon && <a.Icon aria-hidden="true" />}
          {t(a.en, a.es)}
        </span>
      ))}
    </div>
  )
}
