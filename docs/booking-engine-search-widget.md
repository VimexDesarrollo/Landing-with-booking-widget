# El widget de búsqueda de booking-engine

> Investigación hecha el 2026-09-14. Cubre el widget de destino + fechas + huéspedes que
> aparece en el home de booking-engine. Para el calendario en sí (usado adentro de este
> widget) ver [booking-engine-calendar.md](booking-engine-calendar.md) — no se repite aquí.

## Dónde vive y cómo se arma

`src/components/home/SearchWidget.tsx`, renderizado desde `HomePage.tsx` justo debajo del
Hero, superpuesto visualmente encima de él con márgenes negativos (`-mt-14`/`md:-mt-16`) —
el clásico "panel flotante sobre la imagen del hero". Envuelto en un `GlassPanel` (efecto
vidrio esmerilado).

Toda la lógica de estado/navegación está delegada a un hook:
**`useSearchWidgetNavigation`** (`src/hooks/useSearchWidgetNavigation.ts`) — el componente en
sí es solo layout + los campos.

Es un `<form role="search">` en grid (`md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`), en
este orden:
1. Selects primarios: **destino**, **categoría** (`GlassSelect`)
2. Selects de capacidad: **beds** (`GlassSelect`)
3. **Huéspedes** — `GuestDetailsPicker` (no un select; ver abajo)
4. **Fechas** — `DateRangePicker`
5. Botón submit ("Search", con ícono de lupa)

Debajo del formulario hay un link "helper" (ej. "Ver todas las residencias") que además
reutiliza la misma URL destino que usa el submit.

## Campo de destino

Es un **dropdown** (`GlassSelect`, un listbox custom accesible), **no** texto libre ni
autocomplete. Las opciones salen de contenido mock/CMS hardcodeado
(`src/services/mocks/home.mock.ts`):

```ts
select_fields: [
  { id: 'destination', placeholder: 'All Destination', options: ['Playa del Carmen', 'Tulum', 'Akumal'] },
  { id: 'category',    placeholder: 'All Category',    options: ['Oceanfront Villa', 'Penthouse', 'Family Home'] },
  { id: 'beds',        placeholder: 'Beds',            options: ['1+', '2+', '3+', '4+'] },
  { id: 'guests',      placeholder: 'Guests',          options: ['2+', '4+', '6+', '8+'] },  // ← existe en el content pero NO se renderiza como select, ver abajo
],
date_range_field: { id: 'stayDates', placeholder: 'Select stay dates', start_field_name: 'checkin', end_field_name: 'checkout' },
```

Validado con Zod (`.min(1)` en cada array de opciones) al adaptarlo de snake_case a
camelCase. Es decir: hoy es mock, pero con la forma exacta que tendría una respuesta real de
API — conectar un backend real solo significa devolver el mismo shape.

**Detalle importante**: el content trae un campo `guests` como si fuera un select más, pero
el widget lo **excluye explícitamente** al renderizar (`PRIMARY_FIELD_IDS`/filtrado) y al
armar la URL (`if (field.id === GUEST_FIELD_ID) return`) — el control real de huéspedes es
el `GuestDetailsPicker`, no ese select.

## Huéspedes — `GuestDetailsPicker`

`src/design-system/components/GuestDetailsPicker.tsx`. Categorías:
```ts
{ key: 'adults',   label: 'Adults',   hint: 'Ages 13 or above', min: 1 },
{ key: 'children', label: 'Children', hint: 'Ages 2-12',        min: 0 },
{ key: 'infants',  label: 'Infants',  hint: 'Under 2',          min: 0 },
```
más un toggle booleano de `pets` (no es un contador).

Es un **componente totalmente controlado** — no tiene estado interno de conteos, solo
`isOpen`. Cada +/- llama `onChange({ ...valorNormalizado, [key]: siguienteValor })` con
`Math.max(min, actual + delta)`. El botón trigger muestra un resumen tipo
`"3 guests - with pets"` (o el placeholder si está en default).

## Serialización a URL — `src/lib/guestDetails.ts`

Esta es la pieza que define cómo el estado de huéspedes viaja por la URL, útil si se porta:

- `normalizeGuestDetails` — clampa mínimos (`adults ≥ 1`, resto `≥ 0`).
- `getGuestTotal` — suma `adults + children + infants`.
- `isGuestDetailsDefault` — compara contra `{ adults: 1, children: 0, infants: 0, pets: false }`.
- `parseGuestDetailsFromSearchParams` — lee `adults`/`children`/`infants`/`pets`
  estructurados; si no existen, cae a un param **legacy** `guests` (ej. `"4+"`, sin el `+`)
  tratado como `adults`; si tampoco existe, usa el default.
- `writeGuestDetailsToSearchParams` — si está en default, **borra** todos los params de
  huéspedes de la URL (URL limpia). Si no, escribe **ambos a la vez**: los tres campos
  estructurados (`adults`, `children`, `infants`) **y** un espejo legacy `guests=N+` (para
  compatibilidad con cualquier consumidor viejo que solo lea `guests`). `pets=true` solo si
  es true, si no se borra.

## Qué pasa al enviar el formulario

`buildSearchWidgetQuery` arma el query string y `router.push` navega — **sin validación
previa**: no exige destino, no exige fechas completas, no exige rango cronológico. Cualquier
campo vacío simplemente se omite de la URL (nunca aparece como `undefined`).

**Nombres exactos de query params generados** (confirmado cruzando con lo que lee
`ResidencesPage.tsx` — coinciden sin discrepancias):
```
destination, category, beds       ← de los selects, solo si el usuario eligió algo
checkin, checkout                 ← YYYY-MM-DD, todo minúscula, sin guión ni camelCase
adults, children, infants, guests ← huéspedes (guests es el espejo legacy)
pets                              ← solo si es true
```

Estos son los mismos nombres que ya usa el `getProperties()`/`/api/properties` de New_Landing
para `page`/`pageSize` — si se agregan filtros de destino/fechas al Marketplace de
New_Landing más adelante, conviene adoptar esta misma convención de nombres
(`destination`/`checkin`/`checkout`) para que cualquier código o documentación que se porte
de aquí siga siendo válido sin traducir nombres de parámetros.

## Reuso

No hay un componente `SearchWidget` compartido literal en otro lado — solo se renderiza en el
home. Pero `ResidencesResultsToolbar` (la barra de filtros del listado) **sí reutiliza los
mismos átomos** `GuestDetailsPicker` y `DateRangePicker` directamente del design system (con
su propio manejo de estado/URL, no a través de `useSearchWidgetNavigation`). Para destino, el
toolbar usa otro componente distinto (`ResidencesLocationQuickFilter`, chips en vez de
dropdown) — la selección de destino **no** es UI compartida entre el widget del home y el
toolbar del listado, solo huéspedes y fechas lo son.

## Responsive

Sin modal/drawer para mobile — es puramente un grid de Tailwind que colapsa a 1 columna por
debajo de `md`, apilando todos los campos verticalmente a ancho completo. No hay un botón
compacto tipo "Buscar" que abra una hoja aparte en mobile, es el mismo formulario, solo
apilado.

## Estilo / animación

- Sin animación de entrada propia (el timeline GSAP del hero no toca el widget, aparece
  instantáneo).
- El botón de submit sí tiene el efecto **"liquid-click"** (una onda radial al hacer click o
  presionar Enter/Espacio) — definido en `src/lib/liquidClick.ts` + `effects.css`, viene de
  serie en todo `Button` del design system vía `buttonVariants`. Los triggers de
  `GlassSelect`/`GuestDetailsPicker` NO tienen este efecto, solo el botón de búsqueda final.

## Accesibilidad

- Form: `role="search"`, widget con `aria-label="Search stays widget"`.
- Cada trigger de dropdown/popover: `aria-expanded`, `aria-controls`, `aria-haspopup`
  (`"listbox"` en `GlassSelect`, `"dialog"` en `GuestDetailsPicker`), cierre por click-afuera
  y Escape en ambos.
- `GlassSelect` además renderiza un `<input type="hidden">` para semántica de formulario
  nativo, y cada botón +/- de huéspedes tiene `aria-label` explícito
  (`"Increase/Decrease {label}"`) y se deshabilita al llegar al mínimo.
- Sin navegación por flechas dentro de las listas (son botones en orden de Tab normal, no
  roving-tabindex) — suficiente pero no es un listbox ARIA "completo" en el sentido estricto.
