/**
 * Crea propiedades de prueba en Guesty PMS para probar el booking engine.
 * Uso: node --env-file=.env.local scripts/seed-listings.mjs
 */

const PMS_TOKEN_URL = 'https://open-api.guesty.com/oauth2/token'
const PMS_API_BASE  = 'https://open-api.guesty.com/v1'

async function getToken() {
  const clientId     = process.env.GUESTY_PMS_CLIENT_ID
  const clientSecret = process.env.GUESTY_PMS_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Faltan GUESTY_PMS_CLIENT_ID o GUESTY_PMS_CLIENT_SECRET en .env.local')
  }

  const res = await fetch(PMS_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     clientId,
      client_secret: clientSecret,
      scope:         'open-api',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Auth fallida (${res.status}): ${body}`)
  }

  const data = await res.json()
  if (!data.access_token) {
    throw new Error(`Token no recibido. Respuesta: ${JSON.stringify(data)}`)
  }
  return data.access_token
}

async function createListing(token, listing) {
  const res = await fetch(`${PMS_API_BASE}/listings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(listing),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Error creando "${listing.nickname}" (${res.status}): ${body}`)
  }

  return res.json()
}

// Fotos genéricas de propiedades en el Caribe (Unsplash, dominio público)
const PICS = [
  { original: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80', caption: 'Pool view' },
  { original: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80', caption: 'Exterior' },
  { original: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80', caption: 'Living room' },
  { original: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80', caption: 'Bedroom' },
  { original: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80', caption: 'Kitchen' },
]

const LISTINGS = [
  {
    nickname: 'test-playa-01',
    title: 'Condo Frente al Mar — Playa del Carmen',
    type: 'TEST_SINGLE',
    propertyType: 'Apartment',
    roomType: 'Entire home/apt',
    accommodates: 4,
    isListed: true,
    timezone: 'America/Cancun',
    defaultCheckInTime: '15:00',
    defaultCheckoutTime: '11:00',
    address: {
      full: 'Playa del Carmen, Quintana Roo, Mexico',
      city: 'Playa del Carmen',
      state: 'Quintana Roo',
      country: 'Mexico',
      lat: 20.6296,
      lng: -87.0739,
    },
    prices: {
      currency: 'USD',
      basePrice: 180,
      cleaningFee: 60,
      guestsIncludedInRegularFee: 2,
      extraPersonFee: 20,
    },
    terms: { minNights: 3, maxNights: 30 },
    pictures: PICS,
  },
  {
    nickname: 'test-tulum-01',
    title: 'Villa Selva — Tulum',
    type: 'TEST_SINGLE',
    propertyType: 'Villa',
    roomType: 'Entire home/apt',
    accommodates: 6,
    isListed: true,
    timezone: 'America/Cancun',
    defaultCheckInTime: '15:00',
    defaultCheckoutTime: '11:00',
    address: {
      full: 'Tulum, Quintana Roo, Mexico',
      city: 'Tulum',
      state: 'Quintana Roo',
      country: 'Mexico',
      lat: 20.2115,
      lng: -87.4654,
    },
    prices: {
      currency: 'USD',
      basePrice: 320,
      cleaningFee: 100,
      guestsIncludedInRegularFee: 4,
      extraPersonFee: 25,
    },
    terms: { minNights: 3, maxNights: 30 },
    pictures: PICS,
  },
  {
    nickname: 'test-akumal-01',
    title: 'Studio Arrecife — Akumal',
    type: 'TEST_SINGLE',
    propertyType: 'Apartment',
    roomType: 'Entire home/apt',
    accommodates: 2,
    isListed: true,
    timezone: 'America/Cancun',
    defaultCheckInTime: '15:00',
    defaultCheckoutTime: '11:00',
    address: {
      full: 'Akumal, Quintana Roo, Mexico',
      city: 'Akumal',
      state: 'Quintana Roo',
      country: 'Mexico',
      lat: 20.3939,
      lng: -87.3153,
    },
    prices: {
      currency: 'USD',
      basePrice: 110,
      cleaningFee: 40,
      guestsIncludedInRegularFee: 2,
      extraPersonFee: 0,
    },
    terms: { minNights: 3, maxNights: 30 },
    pictures: PICS,
  },
]

async function main() {
  console.log('Autenticando con Guesty PMS Open API...')
  const token = await getToken()
  console.log('Autenticado correctamente.\n')

  for (const listing of LISTINGS) {
    try {
      const created = await createListing(token, listing)
      const id = created._id || created.id || '(sin id en respuesta)'
      console.log(`Creado: ${listing.nickname}  →  id: ${id}`)
    } catch (err) {
      console.error(`FALLO [${listing.nickname}]: ${err.message}`)
    }
  }

  console.log('\nScript completado.')
}

main().catch(err => {
  console.error('Error fatal:', err.message)
  process.exit(1)
})
