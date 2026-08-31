import { OfferGallery } from './OfferGallery'
import { OfferDetails } from './OfferDetails'

/**
 * Una oferta del carrusel. Solo la activa es visible / interactiva
 * (el cross-fade lo maneja `.featured-property__offer.is-active` en CSS).
 */
export function OfferCard({ offer, isActive, galleryIndex, onPrevImage, onNextImage }) {
  return (
    <div
      className={`featured-property__offer${isActive ? ' is-active' : ''}`}
      aria-hidden={!isActive}
    >
      <div className="featured-property__grid">
        <OfferGallery
          images={offer.images}
          activeIndex={galleryIndex}
          onPrev={onPrevImage}
          onNext={onNextImage}
        />
        <OfferDetails offer={offer} />
      </div>
    </div>
  )
}
