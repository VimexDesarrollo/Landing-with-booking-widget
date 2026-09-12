import { NextResponse } from 'next/server'
import { getListings } from '@/lib/guestyPms'
import { mapGuestyListingToProperty } from '@/services/marketplace/mapGuestyListing'
import { getMockProperties } from '@/services/marketplace/mockProperties'

// Único punto donde se llama a Guesty PMS con credenciales de servidor.
// El cliente (useMarketplaceFeed.js) solo conoce esta ruta, nunca a Guesty
// directo — así el Client ID/Secret nunca llegan al navegador.
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 12)
  const skip = (page - 1) * pageSize

  try {
    const data = await getListings({ skip, limit: pageSize })
    const rawListings = Array.isArray(data) ? data : data.results || []

    // Filtro de seguridad además del `active=true` que ya mandamos en la query:
    // nunca mostrar una propiedad no listada aunque Guesty no respete el filtro.
    const listed = rawListings.filter((l) => l.active !== false)
    const items = listed.map(mapGuestyListingToProperty)

    const total = typeof data.count === 'number' ? data.count
      : typeof data.total === 'number' ? data.total
      : null
    const hasMore = total != null ? skip + items.length < total : items.length === pageSize

    return NextResponse.json({ items, page, pageSize, total: total ?? items.length, hasMore })
  } catch (err) {
    // Guesty PMS no responde o las credenciales fallan (ver CLAUDE.md) —
    // en vez de romper el Marketplace, servimos el mock para que el sitio
    // siga funcionando en desarrollo. Queda bien visible en el log del server.
    console.error('[/api/properties] Guesty PMS falló, sirviendo mock de respaldo:', err.message)
    const mock = getMockProperties({ page, pageSize })
    return NextResponse.json({ ...mock, _fallback: true })
  }
}
