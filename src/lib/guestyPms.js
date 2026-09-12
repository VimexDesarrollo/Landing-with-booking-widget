// Módulo servidor — nunca importar desde componentes 'use client'.
import 'server-only'

const TOKEN_URL = 'https://open-api.guesty.com/oauth2/token'
const API_BASE  = 'https://open-api.guesty.com/v1'

// Cache en memoria del servidor para no pedir token en cada request.
// Guesty permite un máximo de 5 tokens por 24h por client_id — cachear es obligatorio,
// no solo una optimización.
let _token  = null
let _expiry = 0

async function getToken() {
  if (_token && Date.now() < _expiry) return _token

  const clientId = process.env.GUESTY_PMS_CLIENT_ID
  const clientSecret = process.env.GUESTY_PMS_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('Faltan GUESTY_PMS_CLIENT_ID / GUESTY_PMS_CLIENT_SECRET en el entorno')
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'open-api',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) throw new Error(`Guesty PMS auth falló: ${res.status}`)

  const data = await res.json()
  if (!data.access_token) throw new Error('Guesty PMS no devolvió access_token')

  _token  = data.access_token
  // expires_in son 24h; refrescamos 5 min antes por margen.
  _expiry = Date.now() + (data.expires_in - 300) * 1000
  return _token
}

async function guestyPmsFetch(path) {
  const token = await getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  })
  if (!res.ok) throw new Error(`Guesty PMS API error ${res.status}: ${path}`)
  return res.json()
}

/**
 * Trae listings de Guesty PMS Open API, paginado.
 *
 * ⚠️ skip/limit y el filtro `active=true` están implementados según la
 * convención más común de Guesty (paginación tipo Mongo + filtro simple por
 * query param), pero NO se pudieron verificar contra una respuesta real
 * (las credenciales configuradas devuelven "invalid_client" — ver CLAUDE.md).
 * En cuanto haya credenciales válidas, confirmar contra una respuesta real:
 * - que `skip`/`limit` sea el nombre correcto de los params de paginación
 * - que `active` sea el campo real que indica "propiedad listada"
 * - la forma exacta de la respuesta (¿array plano? ¿{results, count}?)
 * y ajustar este archivo + mapGuestyListing.js si hace falta.
 */
export async function getListings({ skip = 0, limit = 12 } = {}) {
  const params = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
    active: 'true',
  })
  return guestyPmsFetch(`/listings?${params}`)
}
