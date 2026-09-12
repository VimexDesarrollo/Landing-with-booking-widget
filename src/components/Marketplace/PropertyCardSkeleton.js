export function PropertyCardSkeleton() {
  return (
    <div className="property-card property-card--skeleton" aria-hidden="true">
      <div className="property-card__image" />
      <div className="property-card__body">
        <div className="property-card__skeleton-line property-card__skeleton-line--title" />
        <div className="property-card__skeleton-line property-card__skeleton-line--sub" />
        <div className="property-card__skeleton-line property-card__skeleton-line--sub" />
      </div>
    </div>
  )
}
