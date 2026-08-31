'use client'

import { useLang } from '@/context/LangContext'
import { useOfferCarousel } from './hooks/useOfferCarousel'
import { useImageGallery } from './hooks/useImageGallery'
import { OfferCard } from './OfferCard'
import { IconArrowLeft, IconArrowRight } from './ui/icons'

export function OfferCarousel({ offers }) {
  const { t } = useLang()
  const hasMultiple = offers.length > 1

  const { index, next, prev, swipeHandlers } = useOfferCarousel(offers.length)
  const activeOffer = offers[index]
  const gallery = useImageGallery(activeOffer.images.length, activeOffer.id)

  return (
    <div className="featured-property__carousel">
      {hasMultiple && (
        <button
          type="button"
          className="featured-property__nav featured-property__nav--prev"
          onClick={prev}
          aria-label={t('Previous offer', 'Oferta anterior')}
        >
          <IconArrowLeft />
        </button>
      )}

      <div className="featured-property__stage" {...swipeHandlers}>
        {offers.map((offer, i) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            isActive={i === index}
            galleryIndex={i === index ? gallery.index : 0}
            onPrevImage={gallery.prev}
            onNextImage={gallery.next}
          />
        ))}
      </div>

      {hasMultiple && (
        <button
          type="button"
          className="featured-property__nav featured-property__nav--next"
          onClick={next}
          aria-label={t('Next offer', 'Siguiente oferta')}
        >
          <IconArrowRight />
        </button>
      )}
    </div>
  )
}
