// Módulo servidor — nunca importar desde componentes 'use client'

const TOKEN_URL = 'https://booking.guesty.com/oauth2/token'
const API_BASE  = 'https://booking.guesty.com/api'

// Cache en memoria del servidor para no pedir token en cada request
let _token  = null
let _expiry = 0

async function getToken() {
  if (_token && Date.now() < _expiry) return _token

  const credentials = Buffer.from(
    `${process.env.GUESTY_CLIENT_ID}:${process.env.GUESTY_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })

  if (!res.ok) throw new Error(`Guesty auth failed: ${res.status}`)

  const data = await res.json()
  _token  = data.access_token
  _expiry = Date.now() + (data.expires_in - 60) * 1000  // 1 min de margen
  return _token
}

async function guestyFetch(path, options = {}) {
  const token = await getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`Guesty API error ${res.status}: ${path}`)
  return res.json()
}

// ─── Endpoints que usa el widget ────────────────────────────────────────────

export async function searchListings({ checkIn, checkOut }) {
  const params = new URLSearchParams({ checkIn, checkOut })
  return guestyFetch(`/listings?${params}`)
}

export async function getListing(id) {
  return guestyFetch(`/listings/${id}`)
}

export async function getQuote({ listingId, checkIn, checkOut, guests = 1 }) {
  return guestyFetch('/reservations/quote', {
    method: 'POST',
    body: JSON.stringify({ listingId, checkIn, checkOut, guestsCount: guests }),
  })
}
