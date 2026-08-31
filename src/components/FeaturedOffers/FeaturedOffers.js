'use client'

import { OFFERS } from './data'
import { SECTION_ID } from './constants'
import { OfferCarousel } from './OfferCarousel'

export default function FeaturedOffers() {
  return (
    <section
      id={SECTION_ID}
      className="section section--dark featured-property"
      data-reveal
    >
      <OfferCarousel offers={OFFERS} />
    </section>
  )
}
