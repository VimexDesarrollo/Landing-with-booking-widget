// Genera un catálogo mock de propiedades con la MISMA forma que un listing real
// de Guesty PMS Open API (ver scripts/seed-listings.mjs para la forma de referencia
// que ya se usa para poblar Guesty PMS). Determinista: mismo input -> mismo output,
// para que la paginación sea estable entre llamadas.

const DESTINATIONS = [
  { city: 'Playa del Carmen', state: 'Quintana Roo', lat: 20.6296, lng: -87.0739 },
  { city: 'Tulum', state: 'Quintana Roo', lat: 20.2114, lng: -87.4654 },
  { city: 'Akumal', state: 'Quintana Roo', lat: 20.3966, lng: -87.3170 },
]

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Condo', 'House', 'Penthouse']
const ROOM_TYPE = 'Entire home/apt'

const AMENITY_POOL = [
  'Pool', 'Wifi', 'Kitchen', 'Air conditioning', 'Free parking',
  'Beach access', 'Gym', 'Rooftop terrace', 'Washer', 'Pet friendly',
]

const NAME_PARTS = [
  'Villa', 'Casa', 'Departamento', 'Penthouse', 'Loft', 'Residencia',
]

const NAME_SUFFIX = [
  'Frente al Mar', 'Vista Laguna', 'Jardín Maya', 'Punta Coco',
  'Selva Blanca', 'Sol Naciente', 'Arrecife', 'Luna Azul', 'Palmar', 'Costa Alta',
]

const TOTAL_MOCK_PROPERTIES = 123

// Pequeño generador pseudo-aleatorio con seed fija -> determinista entre llamadas.
function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function buildProperty(index) {
  const rnd = seededRandom(index * 7919 + 13)
  const destination = DESTINATIONS[index % DESTINATIONS.length]
  const propertyType = PROPERTY_TYPES[index % PROPERTY_TYPES.length]
  const namePart = NAME_PARTS[index % NAME_PARTS.length]
  const nameSuffix = NAME_SUFFIX[index % NAME_SUFFIX.length]
  const bedrooms = 1 + (index % 5)
  const bathrooms = Math.max(1, Math.round(bedrooms * 0.75))
  const accommodates = bedrooms * 2
  const basePrice = 80 + Math.round(rnd() * 420)
  const amenitiesCount = 4 + (index % 4)
  const amenities = Array.from({ length: amenitiesCount }, (_, i) => AMENITY_POOL[(index + i) % AMENITY_POOL.length])

  const id = `mock-${String(index).padStart(6, '0')}`
  const nickname = `${propertyType.toLowerCase()}-${destination.city.toLowerCase().replace(/\s+/g, '-')}-${String(index).padStart(3, '0')}`

  return {
    _id: id,
    nickname,
    title: `${namePart} ${nameSuffix} — ${destination.city}`,
    propertyType,
    roomType: ROOM_TYPE,
    accommodates,
    bedrooms,
    bathrooms,
    isListed: true,
    address: {
      full: `${destination.city}, ${destination.state}, México`,
      city: destination.city,
      state: destination.state,
      country: 'Mexico',
      lat: destination.lat + (rnd() - 0.5) * 0.05,
      lng: destination.lng + (rnd() - 0.5) * 0.05,
    },
    prices: {
      currency: 'USD',
      basePrice,
      cleaningFee: 60 + Math.round(rnd() * 80),
      guestsIncludedInRegularFee: Math.max(2, Math.round(accommodates / 2)),
      extraPersonFee: 15 + Math.round(rnd() * 20),
    },
    // picsum.photos/seed/<seed> siempre resuelve a la misma imagen para el mismo seed
    // (útil para mock determinista); en la integración real esto viene de Guesty
    // (`pictures[].original`), que también trae varias fotos por propiedad — por eso
    // el mock genera varias en vez de una sola (la galería de PropertyCard.js necesita
    // más de una para tener algo que ciclar).
    pictures: Array.from({ length: 3 + (index % 3) }, (_, i) => ({
      original: `https://picsum.photos/seed/${nickname}-${i}/1200/800`,
      caption: i === 0 ? 'Exterior' : `Foto ${i + 1}`,
    })),
    amenities,
  }
}

let _cache = null

function getAllMockProperties() {
  if (!_cache) {
    _cache = Array.from({ length: TOTAL_MOCK_PROPERTIES }, (_, i) => buildProperty(i))
  }
  return _cache
}

export function getMockProperties({ page = 1, pageSize = 12 } = {}) {
  const all = getAllMockProperties()
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const items = all.slice(start, end)
  const total = all.length
  const hasMore = end < total

  return { items, page, pageSize, total, hasMore }
}
