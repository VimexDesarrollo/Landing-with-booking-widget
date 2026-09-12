/**
 * Única función que la UI del marketplace debe importar para listar propiedades.
 * Llama a nuestra propia API route (src/app/api/properties/route.js), que es la
 * única que conoce las credenciales de Guesty PMS — este archivo corre en el
 * cliente (lo usa useMarketplaceFeed.js, 'use client') y por eso NUNCA debe
 * hacer fetch directo a open-api.guesty.com ni tocar GUESTY_PMS_CLIENT_ID/SECRET.
 *
 * Si Guesty PMS falla del lado del servidor, la API route responde igual (con
 * datos mock de respaldo y `_fallback: true`) — este archivo no necesita saber
 * la diferencia.
 */
export async function getProperties({ page = 1, pageSize = 12 } = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  const res = await fetch(`/api/properties?${params}`)
  if (!res.ok) throw new Error(`No se pudieron cargar propiedades: ${res.status}`)
  return res.json()
}
