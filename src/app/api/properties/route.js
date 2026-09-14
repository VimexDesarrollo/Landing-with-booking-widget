import { NextResponse } from 'next/server'
import { getAllListings } from '@/lib/guestyPms'
import { mapGuestyListingToProperty } from '@/services/marketplace/mapGuestyListing'
import { getMockProperties } from '@/services/marketplace/mockProperties'
import { EXCLUDED_NICKNAMES } from '@/services/marketplace/excludedNicknames'

// Único punto donde se llama a Guesty PMS con credenciales de servidor.
// El cliente (useMarketplaceFeed.js) solo conoce esta ruta, nunca a Guesty
// directo — así el Client ID/Secret nunca llegan al navegador.
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 12)
  const skip = (page - 1) * pageSize

  try {
    // Traemos TODO el catálogo (cacheado 60s, ver getAllListings) y paginamos
    // nosotros mismos DESPUÉS de filtrar — si filtráramos página por página
    // de Guesty, el conteo de total/hasMore quedaría mal (una página de
    // Guesty puede tener menos "TOTAL" reales que pageSize).
    const rawListings = await getAllListings()

    // Verificado contra datos reales (2026-09-14, cuenta Vimex): de 124
    // listings, 123 tienen active=true pero solo 6 tienen isListed=true —
    // isListed es otra cosa (probablemente distribución a canales/OTAs), no
    // "está disponible en nuestro catálogo". El campo correcto es `active`.
    //
    // Además del estado en Guesty, Vimex clasifica cada propiedad por
    // nickname como TOTAL / SIN RESERVAS / HOMEWATCH / PRUEBA (ver
    // excludedNicknames.js) — solo TOTAL debe verse en el Marketplace.
    const listed = rawListings.filter(
      (l) => l.active !== false && !EXCLUDED_NICKNAMES.has(l.nickname)
    )

    const total = listed.length
    const items = listed.slice(skip, skip + pageSize).map(mapGuestyListingToProperty)
    const hasMore = skip + items.length < total

    return NextResponse.json({ items, page, pageSize, total, hasMore })
  } catch (err) {
    // Guesty PMS no responde o las credenciales fallan (ver CLAUDE.md) —
    // en vez de romper el Marketplace, servimos el mock para que el sitio
    // siga funcionando en desarrollo. Queda bien visible en el log del server.
    console.error('[/api/properties] Guesty PMS falló, sirviendo mock de respaldo:', err.message)
    const mock = getMockProperties({ page, pageSize })
    return NextResponse.json({ ...mock, _fallback: true })
  }
}
