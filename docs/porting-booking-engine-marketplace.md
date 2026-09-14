# Porting: marketplace de `booking-engine` → Marketplace de New_Landing

`booking-engine` (`~/vimex/booking-engine`, puerto 3002) ya tiene un marketplace maduro en
`/residences?destination=Playa+del+Carmen`: grid de cards con galería de fotos + mapa Leaflet
sincronizado por viewport. Este doc registra qué se portó de ahí al Marketplace de
New_Landing, qué se adaptó y por qué, y qué queda pendiente — para que un agente futuro no
tenga que releer todo `booking-engine` desde cero.

## Qué se portó: la galería de cada card

Fuente: `booking-engine/src/components/home/ResidenceCard.tsx` (líneas ~63-139 y ~192-230).

Mecanismo (100% lógica de React, no depende de Tailwind ni de ninguna librería de carrusel):
- Dos `<img>` apiladas con `position: absolute` sobre el mismo contenedor: la **actual**
  (`activeImageIndex`) y la **anterior** (`previousImage`), que se desvanece con
  `transition: opacity` mientras la actual ya está debajo, lista.
- `transitionToImage(index)`: guarda la imagen visible como `previousImage`, cambia el índice
  activo, y en el siguiente frame (`requestAnimationFrame`) fuerza la opacidad de
  `previousImage` a 0 para que el CSS anime el fade. Un `setTimeout` (280ms en el original)
  limpia `previousImage` cuando termina la transición.
- Flechas prev/next: solo se muestran si `pictures.length > 1`.
- Puntos de paginación (dots) debajo, clickeables, resaltan el índice activo.
- **No hay auto-cycle en hover** — el hover en booking-engine solo hace un zoom leve de la
  imagen (`scale`); el cambio de foto siempre es un click explícito (flecha o dot).
- Respeta reduced-motion: si el usuario prefiere menos movimiento, salta directo al índice
  sin animar el fade.

Puerto a New_Landing:
- `src/components/Marketplace/PropertyCard.js` — mismo estado (`activeImageIndex`,
  `previousImage`, `isPreviousImageVisible`) y las mismas funciones
  (`transitionToImage`/`showPreviousImage`/`showNextImage`), reescritas en JS plano.
- CSS nuevo en `src/app/globals.css` bajo `.property-card__gallery*` — mismo efecto visual,
  clases propias en vez de utilidades de Tailwind.
- El "reduced motion" se resuelve con el media query nativo `@media (prefers-reduced-motion:
  reduce)` en CSS (desactiva la transición de opacidad ahí) en vez del contexto `useUI()` que
  usa booking-engine (New_Landing no tiene ese contexto ni falta hacerlo por esto).

## Qué NO se portó tal cual (adaptado a las convenciones de New_Landing)

| booking-engine | New_Landing | Por qué |
|---|---|---|
| Tailwind + `class-variance-authority` | CSS plano en `globals.css`, BEM-ish | New_Landing no usa Tailwind (ver `CLAUDE.md`) — decisión ya tomada, no se introduce aquí. |
| GSAP (para el ícono de favoritos) | No se portó | Solo se pidió portar la galería, no el sistema de favoritos. |
| `ResidenceListing` (`id, name, location, nightlyRateUsd, imageGallery: string[]`) | Shape propio de New_Landing, forma Guesty PMS (`_id, nickname, title, prices.basePrice, pictures: [{original, caption}]`) | Son proyectos distintos con distinta fuente de datos (Django vs Guesty) — no se cambia el shape de New_Landing, la galería simplemente lee `property.pictures`. |
| `useUI().prefersReducedMotion` (contexto propio) | `@media (prefers-reduced-motion: reduce)` en CSS | Evita crear un contexto nuevo solo para esto. |

## Mock data

`src/services/marketplace/mockProperties.js` generaba **una sola foto** por propiedad. Se
amplió a varias (mismo generador determinista `picsum.photos/seed/<nickname>-N`) para que la
galería tenga contenido real que ciclar. Cuando se conecte Guesty PMS real, `pictures` ya
viene como array de varias fotos de forma nativa (ver `mapGuestyListing.js`), así que este
cambio es solo para que el mock sea representativo — no afecta la integración real.

## Pendiente / futuro: el mapa

**No se portó en esta pasada** — quedó fuera de alcance a propósito. Cuando se retome, esto
es lo que hay que traer de `booking-engine`:

- **Librería**: `leaflet` + `react-leaflet` (v5) — ninguna de las dos está instalada en
  New_Landing hoy, hay que agregarlas.
- **Carga**: el mapa necesita `window`, así que se monta con
  `next/dynamic(() => import(...), { ssr: false })` con un fallback de loading mientras carga
  el chunk (`booking-engine/src/routes/ResidencesPage.tsx` y
  `booking-engine/src/components/residences/ResidencesMapPanel.tsx`).
- **Tiles**: CARTO light basemap (`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`)
  — no requiere API key, a diferencia de Mapbox/Google Maps.
- **Markers**: custom "price pill" vía `L.divIcon` (`booking-engine/src/components/residences/map.utils.ts`),
  no los pines default de Leaflet. Jitter determinista en lat/lng para no solapar pines de
  propiedades muy cercanas.
- **Sync mapa → grid** (un solo sentido, booking-engine tampoco tiene el sentido inverso
  card→pin): un estado `visibleResidenceIds` vive en el componente de página, se actualiza con
  `useMapEvents` (`moveend`/`zoomend`) calculando qué propiedades caen dentro de
  `map.getBounds()`, y ese estado filtra la grid. Distingue movimientos programáticos
  (`fitBounds` automático al cambiar filtros) de movimientos del usuario para no pisarse.
- **⚠️ El choque real a resolver cuando se retome**: booking-engine puede hacer este filtro
  porque carga **todo** el dataset filtrado de una vez (paginación Prev/Next, no scroll
  infinito) — el mapa necesita conocer todas las propiedades para saber cuáles caen en el
  viewport. El Marketplace de New_Landing usa **scroll infinito** (carga de a 12,
  `useMarketplaceFeed.js`) — con datos parciales, el mapa no puede filtrar la grid de forma
  confiable hasta que todo esté cargado. No se resolvió en este porting; hay que decidirlo
  explícitamente antes de implementar el mapa (opciones: mapa solo muestra pines de lo ya
  cargado sin filtrar grid, o cambiar a paginación como booking-engine, u otra alternativa).
- No hay hover-card↔highlight-pin ni click-pin↔scroll-to-card en booking-engine tampoco — si
  se quiere esa sincronización bidireccional, hay que diseñarla desde cero, no hay nada que
  copiar para eso.

## Archivos de referencia en booking-engine (solo lectura, no tocar desde New_Landing)

- `src/components/home/ResidenceCard.tsx` — la card + galería (la pieza portada).
- `src/components/residences/ResidencesMapPanel.tsx`, `map.utils.ts` — el mapa (pendiente).
- `src/routes/ResidencesPage.tsx` — cómo se orquesta todo junto (filtros en URL, mapa↔grid,
  paginación).
- `src/hooks/useResidences.ts`, `src/services/residenceService.ts` — patrón de fetch con
  mock/real por env var (`NEXT_PUBLIC_USE_MOCKS`), equivalente al patrón ya usado en
  New_Landing (`src/services/marketplace/getProperties.js` + `/api/properties`).
- `src/services/mocks/residences.mock.ts` — mock de referencia (otro shape de datos, Django).
