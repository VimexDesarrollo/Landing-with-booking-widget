'use client'
import { useLang } from '@/context/LangContext'
import { PropertyCard } from './PropertyCard'
import { PropertyCardSkeleton } from './PropertyCardSkeleton'
import { useMarketplaceFeed } from './useMarketplaceFeed'

export default function Marketplace() {
  const { t } = useLang()
  const { items, isLoading, hasMore, error, sentinelRef, pageSize } = useMarketplaceFeed()

  return (
    <section id="marketplace" className="marketplace" data-reveal>
      <div className="marketplace__head">
        <div className="section__eyebrow">{t('Explore Our Properties', 'Explora Nuestras Propiedades')}</div>
        <h2 className="section__title reveal-up">
          <span>{t('Find your', 'Encuentra tu')}</span> <em>{t('perfect stay', 'estancia perfecta')}</em>
        </h2>
      </div>

      <div className="marketplace__grid">
        {items.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
        {isLoading && Array.from({ length: pageSize }, (_, i) => (
          <PropertyCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>

      {error && (
        <p className="marketplace__error">
          {t('Something went wrong loading more properties.', 'Ocurrió un error al cargar más propiedades.')}
        </p>
      )}

      {hasMore && <div ref={sentinelRef} className="marketplace__sentinel" />}
    </section>
  )
}
