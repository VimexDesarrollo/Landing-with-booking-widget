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
| Uso hoy | `src/lib/guesty.js` → `/api/search` (búsqueda de disponibilidad por fechas) | solo `scripts/seed-listings.mjs` (script suelto, no corre en la app) |
| Uso futuro | igual (disponibilidad/cotización) | **fuente real del catálogo del Marketplace** (`GET /v1/listings`) |

El Marketplace (home) necesita "listar todo el catálogo", no "buscar disponibilidad por
fecha" — por eso la integración real futura es contra **PMS Open API**, no Booking Engine.

## Seguridad — credenciales de Guesty nunca al cliente

- `GUESTY_CLIENT_ID/SECRET` (Booking Engine) y `GUESTY_PMS_CLIENT_ID/SECRET` (PMS) viven
  **solo** en `.env.local` (gitignored, nunca en `.env.example` con valores reales, nunca
  con prefijo `NEXT_PUBLIC_`).
- `src/lib/guesty.js` importa `server-only` (paquete de Vercel) — si algún día algo lo
  importa desde un componente `'use client'`, el build de Next **falla** en vez de empacar
  las credenciales en el bundle del navegador en silencio. Cualquier módulo nuevo que
  toque credenciales de Guesty debe llevar el mismo `import 'server-only'` al inicio.
- `src/services/marketplace/getProperties.js` hoy es client-safe (solo mock, sin
  secretos) pero **lo importa un hook `'use client'`** — por eso NO puede tener
  `server-only` todavía. Cuando se conecte Guesty PMS real ahí, la llamada con
  credenciales tiene que vivir en una API route server-only (ver TODO en ese archivo)
  y `getProperties()` pasa a hacer `fetch('/api/properties')`, nunca un fetch directo a
  `open-api.guesty.com` desde ese archivo.
- Antes de commitear, verificar que `.env.local` siga en `.gitignore` y que
  `git ls-files | grep env` solo devuelva `.env.example`.

## Marketplace — capa de datos (`src/services/marketplace/`)

- `getProperties.js` — **única función que la UI debe importar**:
  `getProperties({ page, pageSize })` → `{ items, page, pageSize, total, hasMore }`.
- Hoy `getProperties` llama a `mockProperties.js` (123 propiedades deterministas, con la
  misma forma que un listing real de Guesty PMS: `_id, nickname, title, propertyType,
  roomType, accommodates, bedrooms, bathrooms, address, prices, pictures, amenities`).
- **TODO marcado en el código**: reemplazar la implementación mock por una llamada real a
  Guesty PMS (`GET /v1/listings`). Como esa llamada necesita credenciales de servidor, la
  real tendrá que pasar por una API route (`src/app/api/properties/route.js` o similar),
  igual que `/api/search` envuelve hoy a `src/lib/guesty.js` — **no se puede llamar a Guesty
  directo desde el cliente**.
- `src/components/Marketplace/useMarketplaceFeed.js` — hook que pagina sobre
  `getProperties` con `IntersectionObserver` (mismo patrón nativo que `useReveal`, sin
  librerías de virtualización/scroll-infinito). Tamaño de página: 12.
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
- `src/services/marketplace/` — capa de datos del Marketplace (mock hoy, Guesty PMS después).
- `src/lib/guesty.js` — cliente server-only de Guesty Booking Engine API.
- `src/hooks/useReveal.js` — `useReveal()` / `useMagnetic()`.
- `src/context/LangContext.js` — `useLang()` / `LangProvider`.
- `scripts/seed-listings.mjs` — script suelto para poblar Guesty PMS con propiedades de
  prueba (no es parte de la app en runtime, referencia útil de forma de datos PMS).
