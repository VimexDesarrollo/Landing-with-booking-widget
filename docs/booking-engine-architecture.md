# Arquitectura completa de booking-engine

> Investigación hecha el 2026-09-14 sobre `~/vimex/booking-engine` (Next.js 15 App Router,
> React 19, TypeScript strict, Tailwind 3, puerto 3002). Es el "proyecto avanzado" que se
> está usando como referencia para construir New_Landing — este doc es el mapa completo de
> cómo está armado. Para el widget de búsqueda ver
> [booking-engine-search-widget.md](booking-engine-search-widget.md); para el calendario,
> [booking-engine-calendar.md](booking-engine-calendar.md) (mucho más detallado, es la parte
> más delicada); para el grid + galería del marketplace,
> [porting-booking-engine-marketplace.md](porting-booking-engine-marketplace.md).

## ⚠️ Antes que nada: el `CLAUDE.md` de booking-engine no coincide 100% con el código real

Vale la pena saberlo antes de portar nada:
- Dice "Next.js 14" / React Query (TanStack Query) / Framer Motion → el código real usa
  **Next 15, React 19, hooks propios con `fetch` (sin React Query) y GSAP (no Framer Motion)**.
- Dice que hay CSP y headers de seguridad (`X-Frame-Options`, etc.) configurados desde el
  inicio → `next.config.ts` **no tiene ningún `headers()`** — es una regla documentada que
  nunca se implementó.
- Hay código completo pero **no conectado a nada**: `ContentProvider`/`ContentContext`
  (contexto de contenido, nadie lo consume), y `src/routes/BookingCheckoutPage.tsx` (un
  checkout de un solo paso, reemplazado por el stepper de 4 pasos pero nunca borrado).

Ninguno de estos tres puntos es "correcto por ser lo documentado" — son discrepancias reales
entre lo que dice el CLAUDE.md de ese proyecto y lo que hace el código. Al portar, guiarse por
el código, no por su CLAUDE.md.

## 1. Rutas (`app/`)

Patrón: `app/*/page.tsx` son wrappers delgados; la implementación real vive en
`src/routes/*Page.tsx`. Mismo patrón que ya usa New_Landing con `(site)/page.js` +
`HomeClient.js`/`AcercaDeVimexClient.js` (ver `New_Landing/CLAUDE.md`) — booking-engine lo
lleva más lejos, con un archivo `*Page.tsx` por cada ruta, no solo dos.

| Ruta | Implementación | Qué hace |
|---|---|---|
| `/` | `HomePage.tsx` | Hero + SearchWidget + destacados, contenido server-side |
| `/residences` | `ResidencesPage.tsx` | Grid + mapa + filtros (ver doc de marketplace) |
| `/residences/[slug]` | `ResidenceDetailPage.tsx` | Galería grande, ficha, panel de reserva con calendario real |
| `/residences/[slug]/checkout` | `CheckoutStepper.tsx` (en `src/checkout/`) | Reserva en 4 pasos |
| `/residences/[slug]/checkout/success` | `BookingRequestSuccessPage.tsx` | Confirmación |
| `/residences/[slug]/guest-details` | `GuestRegistrationPage.tsx` | Captura de identidad para reservar sin cuenta |
| `/auth`, `/auth/login`, `/auth/register` | `AuthPage.tsx` (redirect) + `AuthModePage.tsx` | Login/registro combinados |
| `/auth/forgot-password`, `/auth/reset-password` | páginas dedicadas | Recuperación de contraseña |
| `/auth/callback` | inline en `app/` | Vuelta de OAuth de Google |
| `/contact` | `ContactPage.tsx` | Formulario + WhatsApp |
| `/property-owners` | `PropertyOwnersLoginPage.tsx` | Login de dueños de propiedad (separado del de clientes) |
| `/cancellation-policy`, `/cookie-policy`, `/house-rules`, `/payment-policy`, `/privacy-policy`, `/terms` | grupo `(legal)`, layout compartido | Páginas legales, contenido por `getLegalPageContent(key)` |

**Código muerto detectado**: `src/routes/BookingCheckoutPage.tsx` no está enrutado desde
ningún `app/*/page.tsx` — solo lo usa su propio test. No portarlo, usar el stepper de 4 pasos.

## 2. Layout raíz y contextos

`app/layout.tsx` (server): importa CSS global, trae contenido del home server-side
(`getHomeContent()`), y envuelve todo en `<Providers>` → `AppShell`.

`src/context/app-provider.tsx` compone:
```tsx
<UIProvider>
  <AuthProvider>
    <BookingProvider>{children}</BookingProvider>
  </AuthProvider>
</UIProvider>
```

| Contexto | Qué guarda | Quién lo usa |
|---|---|---|
| `auth-context` (`useAuth`) | `status`, `user`, acciones `login/register/logout/loginWithGoogle/revalidate` | Formularios de auth, header, gate de "Book Now" |
| `booking-context` (`useBooking`) | `selectedRange` (fechas), `selectedGuestDetails` | Página de detalle, página de resultados, navegación del widget |
| `ui-context` (`useUI`) | `prefersReducedMotion`, `isFiltersPanelOpen`, `notifications` (toasts) | ~14 archivos — componentes del design system y flujos de reserva |
| `content-context` (`useContent`) | contenido del home | **Nadie lo usa** — el contenido real se sirve server-side directo en `layout.tsx`/`page.tsx`. Código completo pero muerto. |

## 3. Capa de servicios (`src/services/`)

- **`apiClient.ts`** — wrapper de `fetch` centralizado: `credentials: 'include'` (cookies
  httpOnly), agrega `X-CSRFToken` (leído de la cookie `csrftoken`) en verbos que mutan,
  lanza `ApiError` tipado con `status` + body parseado.
- **`endpoints.ts`** — builders de URL para todo: contenido, legal, login de dueños, países,
  cotizaciones, booking-requests, residencias (+detalle/disponibilidad/precio), y superficie
  completa de auth+checkout-session.
- **`authService.ts`** — adapta perfiles snake_case→camelCase, parsea errores de DRF a
  `fieldErrors`/`nonFieldErrors`, maneja login/registro/logout/refresh/Google OAuth.
- **`bookingRequestService.ts`** — todo el flujo de cotización/checkout, **cada respuesta
  pasa por un schema de Zod** antes de adaptarse. Tiene manejo de conflictos (`DATES_UNAVAILABLE`/
  `QUOTE_CHANGED`) que refresca la cotización automáticamente.
- **`contentService.ts`** (cliente) vs. **`server/contentService.ts`** (server-only) —
  el server-only es el que de verdad se usa (`layout.tsx`/`page.tsx`); el de cliente solo lo
  llama el `ContentContext` muerto.
- **`ownerAuthService.ts`** — login de dueños, separado del de clientes; en modo mock usa una
  cuenta demo hardcodeada con delay simulado.
- **`residenceService.ts`** y **`server/legalContentService.ts`** — ya cubiertos en otros docs
  (marketplace) / autoexplicativo.
- **`adapters/`** — funciones puras snake_case→camelCase por dominio (home, detalle de
  residencia, legal), cada una con sus propios tests.
- **`mocks/`** — fixtures estáticas, activadas por `NEXT_PUBLIC_USE_MOCKS`.

**Patrón a portar a New_Landing**: New_Landing ya usa una versión de esto —
`getProperties.js` → `/api/properties` → `guestyPms.js` (ver `New_Landing/CLAUDE.md`). Es el
mismo patrón (capa de servicio + mock/real con feature flag + fallback), aplicado a un
proyecto más chico.

## 4. Design system (`src/design-system/components/`)

No usa shadcn/Radix — es un kit propio sobre **CVA (`class-variance-authority`)** + `cn()`
(`clsx` + `tailwind-merge`). Componentes: `Button`/`ButtonLink`, `Card`, `Typography`
(polimórfico vía `as`), `GlassPanel` (panel "vidrio esmerilado", usado como contenedor del
widget de búsqueda), `GlassSelect` (listbox custom accesible), `Section`, `Container`,
`Badge`, `Checkbox`, `DateRangePicker` (re-export, ver doc de calendario), `GuestDetailsPicker`,
`Loader`, `PriceRangeSlider`, `SelectableIconChip`.

**Patrón repetido en todos los popovers** (`GlassSelect`, `GuestDetailsPicker`): estado local
`isOpen`, listeners de click-afuera + Escape, animación de entrada con `gsap.context()`
gateada por `useUI().prefersReducedMotion`, y `useFloatingPanelDirection` para decidir si el
panel se abre hacia arriba o abajo según el espacio disponible. Si se porta algún componente
de este tipo, replicar este mismo esqueleto (sin las clases de Tailwind, adaptado a CSS plano
como ya se hizo con la galería del marketplace).

## 5. Autenticación

1. Al montar, `AuthProvider` llama `getMe()`; si 401, intenta `refreshToken()` y reintenta;
   si sigue fallando, limpia cookies y queda `unauthenticated`.
2. Login/registro: formularios validados con Zod → `authService.login/register` → cookies
   httpOnly las pone el backend → el contexto se actualiza.
3. Google OAuth: guarda `returnUrl` en `sessionStorage`, redirect completo a Google, el
   backend intercambia el código y redirige a `/auth/callback`, que revalida sesión y vuelve
   al `returnUrl`.
4. **Middleware** (`middleware.ts`) solo verifica que exista la cookie `vimex_access` (no
   puede leer su contenido) para evitar parpadeos de UI — no es validación real, eso pasa en
   el backend. `PROTECTED_ROUTES` está **vacío hoy** (con placeholders comentados) — no hay
   ninguna ruta realmente protegida por middleware todavía, a pesar del scaffolding.
5. El gate de "Book Now" no es de middleware — es un chequeo puntual en
   `ResidenceDetailPage` (`useAuth().isAuthenticated`) que abre un modal ofreciendo
   registrarse o continuar como invitado.

Todo esto sigue la regla de seguridad ya documentada en `New_Landing/CLAUDE.md` (nunca tokens
en localStorage, solo cookies httpOnly) — booking-engine la cumple en la práctica, no solo en
su CLAUDE.md.

## 6. Checkout / flujo de reserva

**Flujo activo** (`CheckoutStepper.tsx`, 4 pasos vía `useCheckoutStepper()`):
`guest-information → review-booking → payment → confirmation`, con guards explícitos
(`canAccessStep`) que impiden saltar pasos sin completar el anterior.
- Paso 2 (review) manda `createBookingRequest` con los precios **ya cotizados y fijados**
  (`quoted*`), no recalculados a ciegas en el cliente — si el servidor detecta que la
  cotización cambió o las fechas ya no están disponibles, refresca automáticamente y muestra
  el conflicto.
- Paso 3 (payment) es hoy un **stub** — el modo actual es `booking-request` (no cobra de
  verdad), preparado para un futuro modo `instant-payment`.
- Una vez confirmada la reserva, no se puede retroceder en el stepper.

**Código muerto**: `BookingCheckoutPage.tsx` (checkout de un solo paso) — no enrutado, no
portar.

## 7. Testing

Vitest + jsdom, alias `@` → `src/`, cleanup registrado manualmente en `setup.ts`. Convención:
carpetas `__tests__/` junto al código que prueban (no un árbol espejo aparte) — mismo patrón
que ya sigue New_Landing. 38 archivos de test en total; el módulo de checkout va más lejos,
separando tests en `unit/`, `component/`, `integration/`, `security/` y `accessibility/` —
vale la pena copiar esa segmentación si New_Landing llega a tener un flujo de checkout propio
tan grande.

## 8. Config / entorno

`src/config/env.ts`:
```ts
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  useMocks: (process.env.NEXT_PUBLIC_USE_MOCKS ?? 'true') !== 'false',
  usePricingMocks: (process.env.NEXT_PUBLIC_USE_PRICING_MOCKS ?? 'false') !== 'false',
}
```
Mismo patrón de feature-flag que ya usa New_Landing (`NEXT_PUBLIC_USE_MOCKS` no existe ahí
literalmente igual, pero el mecanismo de fallback a mock en `/api/properties` cumple la misma
función).

`next.config.ts`: solo `reactStrictMode`, `images.remotePatterns`, y un `distDir` separado
para dev vs. build (`NEXT_DIST_DIR`) — así correr `npm run dev` y `npm run build` a la vez no
se pisan. **No tiene Dockerfile ni CI** — a diferencia de New_Landing, que sí tiene ambos
(ver `New_Landing/CLAUDE.md`, sección de deploy).

## 9. Animaciones (GSAP)

`src/animations/gsap.ts` es solo un wrapper que registra `ScrollTrigger` una vez y reexporta
`gsap` — todo el resto del código importa de ahí, nunca de `gsap` directo. Dos patrones:
- **Timelines grandes de página** (`homeAnimations.ts`): animan selectores `[data-*]` (no
  refs/clases), corren dentro de `gsap.context()`, devuelven función de limpieza, se
  desactivan por completo si `reducedMotion` es true.
- **Micro-interacciones locales** (`GlassSelect`, `GuestDetailsPicker`, chips): mismo
  esqueleto de 3 partes (context → cleanup en el `useEffect` → gate de reduced-motion) pero
  a nivel de componente individual.

New_Landing no usa GSAP (usa `IntersectionObserver` nativo vía `useReveal.js`) — si se porta
alguna animación de aquí, adaptarla a ese patrón nativo en vez de agregar GSAP como
dependencia nueva, salvo que se decida explícitamente que vale la pena.
