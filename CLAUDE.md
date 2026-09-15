# New_Landing — Arquitectura y convenciones

Sitio de marketing bilingüe de Vimex Vacation Rentals + marketplace de propiedades.
Next.js 15 (App Router), React 19, **JavaScript, no TypeScript**. Este doc existe para
que un agente que trabaje solo en una parte del proyecto (marketplace, integración
Guesty, SEO, etc.) pueda ubicarse rápido sin releer todo el código.

## Qué es este proyecto

- Landing pública de Vimex (rentas vacacionales / administración de propiedades,
  Riviera Maya: Playa del Carmen, Tulum, Akumal).
- Home (`/`) = Hero + "Special Offers" (ofertas destacadas) + Marketplace (grid de
  propiedades con scroll infinito).
- `/acerca-de-vimex` = contenido institucional (quiénes somos, servicios, destinos,
  testimonios, FAQ, contacto).
- Es parte de un monorepo más grande (`~/vimex`) que también tiene `backend` (Django),
  `frontend` y `booking-engine` (ambos consumen `/api/residences/` del backend Django) —
  **New_Landing no usa ese backend**, es un proyecto aparte que habla directo con Guesty.

## Rutas (`src/app`)

```
src/app/
  layout.js                 # raíz: fuentes (Fraunces/Manrope/JetBrains Mono), <html lang="es">,
                             # LangProvider, metadata genérica (metadataBase + fallback)
  sitemap.js, robots.js     # SEO nativo de Next
  api/search/route.js       # único endpoint propio: proxy a Guesty Booking Engine (disponibilidad)
  (site)/                   # route group — sin segmento de URL, comparte Nav/Footer
    layout.js                # server component: <Loader/><Cursor/><Nav/>{children}<Footer/>
    page.js                  # "/" — server component, exporta metadata, renderiza <HomeClient/>
    HomeClient.js             # 'use client' — Hero + FeaturedOffers + Marketplace, hooks de reveal/anchor
    acerca-de-vimex/
      page.js                 # "/acerca-de-vimex" — server component, metadata propia
      AcercaDeVimexClient.js   # 'use client' — las 12 secciones institucionales
```

**Por qué el split page.js / *Client.js**: un client component (`'use client'`) no puede
exportar `metadata`. Cada ruta necesita su propio `<title>`/`<description>` para SEO, así
que `page.js` queda como server component solo para eso, y delega el contenido interactivo
(hooks, animaciones) a un componente client (`HomeClient` / `AcercaDeVimexClient`).

**Si agregas una tercera ruta** dentro de `(site)/`, sigue el mismo patrón (page.js server +
*Client.js), y si el boilerplate de `useReveal()`/`useMagnetic()`/anchor-effect se repite una
tercera vez, vale la pena extraerlo a un hook compartido (`useSiteEffects()`).

## Nav / Footer son compartidos

`Nav.js` y `Footer.js` viven en `src/components/` y se renderizan una sola vez en
`(site)/layout.js` — aparecen en **todas** las rutas del grupo. Sus links a secciones
institucionales (`#feel`, `#services`, `#dest`, `#contact`) apuntan siempre a
`/acerca-de-vimex#id` (con `next/link`), nunca a un `#id` desnudo — porque esas secciones
ya no viven en la home. Si agregas una sección institucional nueva con su propio `id`,
actualiza los `links` de Nav y la columna "Navigate" de Footer.

## Estilos

- **Un solo archivo**: `src/app/globals.css` (todo el CSS del sitio). **Sin Tailwind, sin
  CSS Modules** — no introducir ninguno de los dos.
- Naming BEM-ish: `.bloque__elemento`, `.bloque--modificador` (ej. `.marketplace__grid`,
  `.property-card--skeleton`).
- Design tokens en `:root` (`--navy`, `--teal`, `--cream`, `--ink`, `--line`, `--ease-out`,
  `--gutter`, etc.) — reusar, no inventar valores sueltos.
- Breakpoints reales usados en el archivo: `1400px · 1200px · 1024px · 900px · 768px · 480px`
  (hay un comentario "FULL BREAKPOINT SYSTEM" cerca del final del archivo). Los grids de
  sección (`.stats__grid`, `.marketplace__grid`) colapsan a 2 columnas en `900px` y a 1 en
  `480px` — sigue ese patrón para grids nuevos.

## i18n

No hay librería de i18n (ni next-intl, ni react-i18next) — **decisión deliberada**, no un
hueco por llenar. Una sola URL sirve ambos idiomas:

- `src/context/LangContext.js` — `useLang()` devuelve `{ lang, setLang, t(en, es) }`,
  default `'es'`, sin persistencia (se resetea a `'es'` en cada carga).
- Cada string se escribe inline: `t('English copy', 'Copy en español')`. No hay diccionario
  centralizado — es intencional, coherente con el resto del código existente.
- `<html lang="es">` está hardcodeado en el layout raíz (no cambia con el toggle).
- La metadata (`title`/`description`) de cada `page.js` está en español por default, igual
  que el resto del sitio — no necesita ser bilingüe.

## Hooks de interacción (`src/hooks/useReveal.js`)

- `useReveal()` — anima elementos `[data-reveal]` al entrar en viewport (IntersectionObserver
  nativo + fallback por scroll/resize). **Debe llamarse una vez por cada componente client de
  página** (hoy: `HomeClient.js` y `AcercaDeVimexClient.js`, cada uno el suyo) — no es un
  singleton global, si una página no lo llama sus `[data-reveal]` no animan.
- `useMagnetic()` — efecto de atracción al cursor en `[data-magnetic]`, mismo criterio.

## Integración con Guesty — dos APIs distintas, no confundir

| | Guesty Booking Engine API | Guesty PMS Open API |
|---|---|---|
| Base URL | `booking.guesty.com` | `open-api.guesty.com` |
| Credenciales | `GUESTY_CLIENT_ID/SECRET` | `GUESTY_PMS_CLIENT_ID/SECRET` |
| Uso hoy | `src/lib/guesty.js` → `/api/search` (búsqueda de disponibilidad por fechas) | `src/lib/guestyPms.js` → `/api/properties` (catálogo del Marketplace) + `scripts/seed-listings.mjs` |

El Marketplace (home) necesita "listar todo el catálogo", no "buscar disponibilidad por
fecha" — por eso está conectado contra **PMS Open API**, no Booking Engine.

**Estado de la integración PMS (2026-09-14): conectada y verificada contra datos reales.**
Las credenciales originales de `GUESTY_PMS_CLIENT_ID/SECRET` nunca funcionaron
(`invalid_client`) — eran de una app de Guesty distinta/nunca activada. Se
reemplazaron por las mismas credenciales que ya usa `contabilidadVimex` en
producción (`~/contabilidadVimex/backend/api/services/guesty_service.py`,
integración con Guesty verificada en vivo desde julio 2026) — mismo account de
Guesty de Vimex, ya confirmado funcionando. `/api/properties` ahora trae las 124
propiedades reales de la cuenta.

Dos cosas se corrigieron al verificar contra la respuesta real:
- El request de token **no manda `scope`** (el patrón de `contabilidadVimex` no lo
  usa y funciona igual — se quitó de `guestyPms.js`).
- El campo que marca "propiedad disponible" es **`active`**, no `isListed`: de 124
  listings reales, 123 tienen `active: true` pero solo 6 tienen `isListed: true`
  (`isListed` es otra cosa, probablemente distribución a canales/OTAs) —
  `route.js` filtra por `active !== false` únicamente.

`skip`/`limit` para paginación y la forma de la respuesta (`{results, count, ...}`)
quedaron confirmados correctos tal como estaban. Referencia completa de auth/listings:
[[reference_guesty_pms_open_api]] (docs oficiales, guardadas en memoria).

`/api/properties` conserva el fallback a mock si Guesty llega a fallar (red, rate
limit, etc.) — sigue siendo la red de seguridad, ya no el estado normal.

## Seguridad — credenciales de Guesty nunca al cliente

- `GUESTY_CLIENT_ID/SECRET` (Booking Engine) y `GUESTY_PMS_CLIENT_ID/SECRET` (PMS) viven
  **solo** en `.env.local` (gitignored, nunca en `.env.example` con valores reales, nunca
  con prefijo `NEXT_PUBLIC_`).
- `src/lib/guesty.js` importa `server-only` (paquete de Vercel) — si algún día algo lo
  importa desde un componente `'use client'`, el build de Next **falla** en vez de empacar
  las credenciales en el bundle del navegador en silencio. Cualquier módulo nuevo que
  toque credenciales de Guesty debe llevar el mismo `import 'server-only'` al inicio.
- `src/services/marketplace/getProperties.js` corre en el cliente (lo importa un
  hook `'use client'`) y por eso **nunca** toca credenciales — solo hace
  `fetch('/api/properties')`. Las credenciales de Guesty PMS viven exclusivamente
  en `src/lib/guestyPms.js` (con `import 'server-only'`) y se usan únicamente
  dentro de `src/app/api/properties/route.js` (route handler, siempre server-only
  en Next). Si algún día alguien mueve la llamada a Guesty fuera de esa route hacia
  `getProperties.js` o cualquier archivo importado por un client component, está
  rompiendo esta regla — no hacerlo.
- Antes de commitear, verificar que `.env.local` siga en `.gitignore` y que
  `git ls-files | grep env` solo devuelva `.env.example`.

## Marketplace — capa de datos (`src/services/marketplace/` + `src/app/api/properties/`)

- `getProperties.js` — **única función que la UI debe importar**:
  `getProperties({ page, pageSize })` → `{ items, page, pageSize, total, hasMore }`.
  Hace `fetch('/api/properties?page=&pageSize=')`, nada más — no sabe si la respuesta
  viene de Guesty real o del mock de respaldo.
- `src/app/api/properties/route.js` — route handler (server-only por naturaleza):
  llama a `getAllListings()` de `src/lib/guestyPms.js` (trae **todo** el catálogo,
  paginando internamente contra Guesty y cacheado 60s — necesario porque filtramos
  después, no se puede pedir "solo TOTAL" a la API de Guesty), filtra por
  `active !== false` **y** por nickname no excluido (`excludedNicknames.js` — ver
  abajo), mapea cada listing con `mapGuestyListing.js` al shape interno del
  Marketplace, y recién ahí pagina (`skip`/`pageSize`) sobre el resultado ya
  filtrado — así `total`/`hasMore` reflejan el catálogo real que se muestra, no el
  crudo de Guesty. **Si Guesty PMS falla** (credenciales, red, lo que sea) cae
  automáticamente a `mockProperties.js` y agrega `_fallback: true` a la respuesta —
  el Marketplace nunca se rompe visualmente por un problema de Guesty.
- `excludedNicknames.js` — lista de nicknames a excluir del Marketplace, tomada de
  la clasificación de negocio de Vimex (**TOTAL** / SIN RESERVAS / HOMEWATCH / PRUEBA
  — Guesty no tiene esto nativo). Fuente: pestaña "Tipo de Propiedad" del panel
  unificado de Guesty (artifact `Gs2moutHKxez9GhKzrTfyq`), snapshot 2026-09-14. Solo
  **TOTAL** (reserva total, Vimex la administra de punta a punta) se muestra en
  New_Landing — SIN RESERVAS (dueño administra directo), HOMEWATCH (ya no recibe
  reservas) y PRUEBA (listings de prueba en Guesty) quedan fuera. ⚠️ Es un snapshot
  puntual, no se sincroniza solo — si la clasificación cambia en el artifact, hay
  que actualizar esta lista a mano.
- `mockProperties.js` — 123 propiedades deterministas, mismo shape que un listing
  real de Guesty PMS (`_id, nickname, title, propertyType, roomType, accommodates,
  bedrooms, bathrooms, address, prices, pictures, amenities`). Se usa como
  respaldo automático, no hace falta activarlo a mano.
- `mapGuestyListing.js` — función pura (sin secretos) que traduce el shape crudo
  de Guesty al shape interno — punto único para ajustar si el nombre real de un
  campo de Guesty difiere de lo asumido (ver nota de "sin verificar" arriba).
- `src/components/Marketplace/useMarketplaceFeed.js` — hook que pagina sobre
  `getProperties` con `IntersectionObserver` (mismo patrón nativo que `useReveal`, sin
  librerías de virtualización/scroll-infinito). Tamaño de página: 12.
- `PropertyCard.js` tiene galería con crossfade (flechas + dots, sin auto-cycle en hover) —
  patrón portado de `booking-engine/src/components/home/ResidenceCard.tsx`, adaptado a CSS
  plano. Ver **[docs/porting-booking-engine-marketplace.md](docs/porting-booking-engine-marketplace.md)**
  para el detalle completo de qué se portó y cómo. Ese mismo doc deja anotado **el mapa como
  feature pendiente** (Leaflet + sync viewport↔grid) — no está implementado todavía, y su
  implementación choca con el scroll infinito actual (hay que resolverlo antes de construirlo).
- Cada card tiene botones de **WhatsApp** (`529842031391`, en `Marketplace/constants.js` —
  mismo número que `FeaturedOffers/constants.js`, duplicado a propósito, no importado
  cruzado) y **Reservar Ahora** (`property.bookingUrl`). En el mock (`mockProperties.js`)
  sigue vacío a propósito (nicknames sintéticos, nunca coinciden con nada real) — cae a `#`.
  En Guesty real, `mapGuestyListing.js` cruza `listing.nickname` contra
  `bookingUrls.js` (snapshot manual de un CSV que dio el equipo, 2026-09-15, con el formato
  de nickname real de Guesty — sin guiones, ej. `LAGV5`, distinto al formato con guiones de
  `excludedNicknames.js`). De las 95 propiedades TOTAL, 74 ya tienen URL ahí; las ~21 que no
  siguen cayendo a `#` hasta que exista ese link — no es un bug, es que todavía no hay dato.
- **[docs/README.md](docs/README.md)** es el índice de toda la documentación de porting desde
  booking-engine (arquitectura completa, widget de búsqueda, calendario a detalle) — empezar
  ahí antes de portar cualquier otra pieza de ese proyecto.
- Si el catálogo real crece a miles de propiedades, revisar si hace falta virtualización
  (hoy no hay `react-window` ni similar instalado — 123-ish items renderizados
  progresivamente es seguro, miles ya no).

## Testing

- Vitest (`vitest.config.js`), tests colocados en `__tests__/` junto al código que prueban
  (ver `FeaturedOffers/__tests__`, `SearchWidget/__tests__`).
- `npm run test` / `npm run test:watch`.

## Deploy — gotchas ya conocidos

- **No correr `npm run build` con `next dev` (turbopack) corriendo** — clobberea `.next` y
  el dev server empieza a tirar 500. Fix: parar el dev server, `rm -rf .next`, `npm run dev`
  de nuevo.
- **`docker-compose up -d` (v1.29.2) falla con `KeyError: 'ContainerConfig'`** al recrear el
  contenedor desde una imagen nueva — correr `docker-compose down` primero, luego `up -d`.
- **Variables `NEXT_PUBLIC_*` se inyectan en build time, no en runtime.** Si agregas una
  nueva (ej. algo para el Marketplace o la integración Guesty real), tiene que ir tanto como
  `ARG`/`ENV` en el `Dockerfile` como en `build.args` de `docker-compose.yml` — si solo la
  pones en `.env`/`env_file`, queda vacía en la imagen ya compilada.
- Verificar siempre contra `npm run build && npm run start` antes de dar un cambio por listo
  para deploy — `next dev` (turbopack) no es 100% representativo del build de producción
  (`output: 'standalone'`).

## Mapa rápido de carpetas

- `src/app/` — rutas (App Router), ver arriba.
- `src/components/` — un componente por sección de la home/about, más
  `FeaturedOffers/`, `SearchWidget/` (armado pero no montado en ninguna página hoy) y
  `Marketplace/` (grid + card + hook de scroll infinito).
- `src/services/marketplace/` — capa de datos del Marketplace (fetch a `/api/properties` +
  mapper + mock de respaldo).
- `src/lib/guesty.js` — cliente server-only de Guesty Booking Engine API.
- `src/lib/guestyPms.js` — cliente server-only de Guesty PMS Open API (catálogo).
- `src/hooks/useReveal.js` — `useReveal()` / `useMagnetic()`.
- `src/context/LangContext.js` — `useLang()` / `LangProvider`.
- `scripts/seed-listings.mjs` — script suelto para poblar Guesty PMS con propiedades de
  prueba (no es parte de la app en runtime, referencia útil de forma de datos PMS).
