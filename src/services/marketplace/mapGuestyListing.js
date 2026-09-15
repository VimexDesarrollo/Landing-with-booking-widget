import { BOOKING_URLS } from './bookingUrls'

// Función pura, sin secretos — normaliza un listing crudo de Guesty PMS al
// shape interno del Marketplace (el mismo que ya produce mockProperties.js),
// para que PropertyCard y compañía no necesiten saber si el dato viene de
// Guesty o del mock.
export function mapGuestyListingToProperty(listing) {
  const address = listing.address || {}

  return {
    _id: listing._id,
    nickname: listing.nickname || listing._id,
    title: listing.title || listing.nickname || 'Untitled',
    propertyType: listing.propertyType || listing.type || 'Property',
    roomType: listing.roomType || 'Entire home/apt',
    accommodates: listing.accommodates ?? 0,
    bedrooms: listing.bedrooms ?? 0,
    bathrooms: listing.bathrooms ?? 0,
    isListed: listing.active !== false,
    // Guesty PMS no trae un link al motor de reservas por listing — se cruza
    // por nickname contra bookingUrls.js (snapshot manual del CSV que dio el
    // equipo). Si no hay URL para esa propiedad, queda '' y PropertyCard.js
    // cae a '#' — no rompe nada, solo significa que aún no existe ese link.
    bookingUrl: BOOKING_URLS[listing.nickname] || '',
    address: {
      full: address.full || [address.city, address.state, address.country].filter(Boolean).join(', '),
      city: address.city || '',
      state: address.state || '',
      country: address.country || '',
      lat: address.lat ?? address.latitude ?? null,
      lng: address.lng ?? address.longitude ?? null,
    },
    prices: {
      currency: listing.prices?.currency || 'USD',
      basePrice: listing.prices?.basePrice ?? 0,
      cleaningFee: listing.prices?.cleaningFee ?? 0,
      guestsIncludedInRegularFee: listing.prices?.guestsIncludedInRegularFee ?? listing.accommodates ?? 1,
      extraPersonFee: listing.prices?.extraPersonFee ?? 0,
    },
    pictures: (listing.pictures || []).map((p) => ({
      original: p.original,
      thumbnail: p.thumbnail,
      caption: p.caption || '',
    })),
    amenities: listing.amenities || [],
  }
}
