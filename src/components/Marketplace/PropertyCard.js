import { TbBed, TbBath, TbUsers, TbMapPin } from 'react-icons/tb'
import { useLang } from '@/context/LangContext'

export function PropertyCard({ property }) {
  const { t } = useLang()
  const image = property.pictures?.[0]?.original
  const price = property.prices?.basePrice
  const currency = property.prices?.currency || 'USD'

  return (
    <article className="property-card">
      <div className="property-card__image">
        {image && <img src={image} alt={property.title} loading="lazy" />}
        <span className="property-card__badge">{property.propertyType}</span>
      </div>
      <div className="property-card__body">
        <h3 className="property-card__title">{property.title}</h3>
        <div className="property-card__location">
          <TbMapPin size={14} />
          <span>{property.address?.city}, {property.address?.state}</span>
        </div>
        <div className="property-card__specs">
          <span><TbUsers size={14} /> {property.accommodates}</span>
          <span><TbBed size={14} /> {property.bedrooms}</span>
          <span><TbBath size={14} /> {property.bathrooms}</span>
        </div>
        <div className="property-card__price">
          <strong>{currency} ${price}</strong>
          <span>{t('/ night', '/ noche')}</span>
        </div>
      </div>
    </article>
  )
}
