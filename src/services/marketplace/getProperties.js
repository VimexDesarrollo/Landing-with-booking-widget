import { getMockProperties } from './mockProperties'

/**
 * Única función que la UI del marketplace debe importar para listar propiedades.
 * Hoy devuelve datos mock; la forma de la respuesta ya está alineada a un listing
 * real de Guesty PMS Open API para que reemplazar la implementación no requiera
 * tocar los componentes que la consumen.
 *
 * TODO(guesty-integration): reemplazar esta llamada mock por una llamada real a
 * Guesty PMS Open API (`open-api.guesty.com`, `GET /v1/listings`), usando
 * GUESTY_PMS_CLIENT_ID/GUESTY_PMS_CLIENT_SECRET (ya en .env.local, hoy solo usadas
 * por scripts/seed-listings.mjs). Como esa llamada necesita credenciales de servidor,
 * no puede hacerse directo desde el cliente: va a necesitar una API route (ej.
 * src/app/api/properties/route.js) que la envuelva, igual que src/app/api/search/route.js
 * envuelve hoy a src/lib/guesty.js para la búsqueda de disponibilidad (Booking Engine API).
 * Ese route + la llamada real a Guesty PMS quedan fuera de este cambio (solo mock por ahora).
 *
 * ⚠️ Este archivo hoy es importado por un hook 'use client' (useMarketplaceFeed.js),
 * o sea que termina en el bundle del navegador tal cual. NUNCA agregues aquí un
 * fetch directo a open-api.guesty.com ni references GUESTY_PMS_CLIENT_ID/SECRET
 * en este archivo — eso mandaría las credenciales al cliente. La integración real
 * va en la API route server-only (ver arriba); esta función solo debe llamar a
 * ese endpoint propio (fetch('/api/properties')) una vez que exista.
 */
export async function getProperties({ page = 1, pageSize = 12 } = {}) {
  return getMockProperties({ page, pageSize })
}
