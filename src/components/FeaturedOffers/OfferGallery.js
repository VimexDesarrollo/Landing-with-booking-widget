import { IconArrowLeft, IconArrowRight } from './ui/icons'

/**
 * Slideshow de fotos de una oferta. El índice activo lo controla el padre
 * (solo la oferta activa avanza; las inactivas reciben activeIndex = 0).
 */
export function OfferGallery({ images, activeIndex, onPrev, onNext }) {
  return (
    <div className="featured-property__gallery">
      {images.map((src, i) => (
        <div
          key={src}
          className={`featured-property__slide${i === activeIndex ? ' is-active' : ''}`}
        >
          <div className="bg" style={{ backgroundImage: `url('${src}')` }} />
        </div>
      ))}

      <div className="featured-property__controls">
        <button type="button" onClick={onPrev} aria-label="Previous photo">
          <IconArrowLeft size={18} />
        </button>
        <button type="button" onClick={onNext} aria-label="Next photo">
          <IconArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
