# El calendario de booking-engine — a detalle

> Investigación hecha el 2026-09-14 directamente sobre el código de
> `~/vimex/booking-engine`. Este es el documento que existe porque el calendario ha sido
> "un dolor de cabeza" — la idea es que quien lo porte a New_Landing no repita los mismos
> problemas, y sepa exactamente cuáles son antes de empezar.
>
> **Corrección importante**: había una memoria previa (de otra sesión) diciendo que el
> calendario exigía check-in ≥3 días desde hoy y mínimo 2 noches. Se verificó contra el
> código real y **eso no es así** — ver §3. Esa memoria ya se corrigió.

## Resumen ejecutivo

Hay **dos implementaciones de calendario que no se hablan entre sí**:

1. **`src/calendar-core/domain/calendarReducer.ts`** — un reducer puro, chiquito, bien
   testeado, que SÍ implementa una regla de `minNights` correctamente (rechaza la fecha si
   no cumple el mínimo, en el momento del click). **Es código muerto** — nada lo importa
   fuera de su propio test.
2. **`src/components/calendar/DateRangePicker.tsx`** (+ `CalendarModal`, `CalendarMonths`,
   `DateRangeField`) — este es el que de verdad se renderiza en pantalla. Tiene su propia
   `hasCompletedValue()`, pero **no exige mínimo de noches ni mínimo de días desde hoy** —
   cualquier `checkout > checkin` cierra el modal, incluida una sola noche, e incluso fechas
   en el pasado.

El mínimo de noches **sí existe como regla de negocio**, pero vive **fuera del calendario**,
duplicado en dos componentes distintos, cada uno con una reacción diferente cuando la
selección no cumple. Esto es, casi con certeza, la raíz del "dolor de cabeza".

## 1. El componente real — código completo explicado

Hay dos archivos llamados `DateRangePicker.tsx`. El de design-system ya es solo un
re-export:

```tsx
// src/design-system/components/DateRangePicker.tsx (archivo completo, 2 líneas)
export { DateRangePicker } from '@/components/calendar/DateRangePicker'
```

La implementación real: **`src/components/calendar/DateRangePicker.tsx`**.

**Piezas clave** (nombres tal cual en el código):
- `toDateKey(date)` / `parseDateKey(value)` — serializan fechas como `"YYYY-MM-DD"` usando
  **componentes locales** (`getFullYear/getMonth/getDate`), no UTC. Importante para §9.
- `hasCompletedValue(range)` → `Boolean(range.from && range.to && range.to > range.from)`.
  Es comparación de **strings** (`"YYYY-MM-DD" > "YYYY-MM-DD"`), funciona porque ese formato
  ordena lexicográficamente igual que cronológicamente. **Solo exige 1 noche mínimo.**
- `applySelectionRule(currentRange, clickedDate)` — la máquina de estados de 2 clicks:
  - Sin `from` → el click se vuelve `from`.
  - Con `from`, sin `to`: si el click es **posterior** a `from` → se vuelve `to` (rango
    completo). Si no (anterior o igual) → el click **reemplaza** a `from`, se reinicia.
  - Con `from` y `to` ya puestos → cualquier click reinicia, se vuelve el nuevo `from`.
  - **No hay ningún chequeo de mínimo de noches ni de fecha mínima aquí.**
- **Auto-close**: en `onSelectDate`, apenas `hasCompletedValue(nextValue)` es true, se llama
  `onChange(nextValue)` y `setIsOpen(false)` en el mismo tick. Esto sí es como se recordaba,
  pero la condición que lo dispara es más débil de lo que se pensaba.
- `draftValue`/`draftRange` — una copia "borrador" mientras el modal está abierto. **Cada vez
  que se abre el picker, el draft arranca vacío** (`setDraftValue({})`), sin importar el valor
  ya confirmado — por eso reabrir el calendario después de tener un rango completo hace que
  el campo muestre "Select dates" de nuevo por un instante (ver test #4 en §11).

## 2. `react-day-picker` (v9.13.2)

Uso real en **`src/components/calendar/CalendarMonths.tsx`**:
- `mode="range"`, `numberOfMonths={2}`, `pagedNavigation` (pagina de a 2 meses).
- `disabled={disabledDates}` — el **único** mecanismo de deshabilitar días, construido solo
  a partir de `blockedDateKeys`. **No hay `disabled: {before: today}` ni `fromDate`** — un
  usuario puede clickear una fecha pasada sin ningún impedimento.
- Preview de hover: mientras solo hay `checkin`, pasar el mouse sobre una fecha posterior
  sombrea el rango tentativo (`preview_middle`/`preview_end`, modifiers custom) — puramente
  visual, no valida nada.
- `onDayClick` llama directo a `applySelectionRule` — react-day-picker no valida rangos por
  su cuenta, solo dibuja lo que le pasan.

## 3. Validación — tabla de corrección vs. la memoria previa

| Regla que se creía que existía | Realidad verificada |
|---|---|
| Check-in mínimo = hoy + 3 días | **No existe.** Se puede elegir hoy, ayer, o cualquier fecha pasada. |
| Mínimo 2 noches, hardcodeado | **No en el calendario.** Existe `residence.minNights` (opcional, por propiedad, default ~1), aplicado **fuera** del picker, duplicado (ver §9). |
| Modal se auto-cierra cuando se cumplen ambas condiciones | Confirmado, pero la única condición real es `checkout > checkin` (1 noche). |
| `getMinCheckInDate()` existe | **No existe en el repo** (0 resultados de grep). |
| `countNights()` en un solo lugar | Existe, pero **triplicado** (+ una 4ta versión en el reducer huérfano), con inconsistencias de timezone entre copias (ver §9). |

**"Hoy" nunca se usa para validar check-in** en el picker real (no hay regla que lo necesite).
Sí se usa en el generador de fechas bloqueadas del mock (`new Date()`, hora local del
navegador) — ver §4.

## 4. Fechas bloqueadas

Forma: array plano de strings `"YYYY-MM-DD"` (un día por entrada, no rangos/intervalos).

**Mock** (`src/services/mocks/availability.mock.ts`) — genera 3 bloques deterministas
por propiedad (seed = suma de códigos de caracteres del `slug`), siempre relativos a
`new Date()` en el momento de la consulta (offsets ~8-14, ~22-30 y ~40-50 días desde hoy).

**API real** (`residenceService.getBlockedDates`): pide una ventana de 365 días desde hoy
(`buildAvailabilityWindow()`), valida la respuesta con Zod (`{ blocked_dates: string[] }`).

⚠️ **Bug real a evitar al portar**: si la llamada real falla por cualquier motivo (red, 500,
schema inválido), **cae en silencio al mock determinista**, incluso con `useMocks=false` en
producción. Eso puede mostrar fechas "disponibles" que en realidad no lo son, o viceversa,
sin ningún aviso al usuario.

**Alcance**: las fechas bloqueadas solo se piden **por propiedad**, y solo se usan en la
página de detalle de la propiedad. El widget de búsqueda del home y la barra de resultados
del listado **nunca reciben `blockedDateKeys`** (queda `[]` por default) — ningún día se
deshabilita ahí, por diseño (una búsqueda multi-propiedad no puede deshabilitar fechas de una
sola propiedad).

## 5. El reducer huérfano — `src/calendar-core/domain/`

```ts
// types.ts
export interface CalendarState {
  checkIn: DateKey | null
  checkOut: DateKey | null
  visibleMonth: MonthKey
  minNights: number   // configurable por propiedad
}
export const DEFAULT_MIN_NIGHTS = 3
```

```ts
// calendarReducer.ts — countNights con Date.UTC (evita problemas de timezone)
function countNights(checkIn: DateKey, checkOut: DateKey): number {
  const [ciY, ciM, ciD] = checkIn.split('-').map(Number)
  const [coY, coM, coD] = checkOut.split('-').map(Number)
  const startMs = Date.UTC(ciY, ciM - 1, ciD)
  const endMs = Date.UTC(coY, coM - 1, coD)
  return Math.round((endMs - startMs) / 86_400_000)
}

// SELECT_DATE:
// 1. Sin checkIn, o ya hay checkOut → el click es el nuevo checkIn.
// 2. Con checkIn, sin checkOut:
//    - si date <= checkIn → reinicia (date es el nuevo checkIn)
//    - si countNights(checkIn, date) < minNights → RECHAZA y reinicia (date es el nuevo checkIn)
//    - si no → date es el checkOut válido
```

**Esto es exactamente el comportamiento "mínimo de noches validado al momento del click"** que
se buscaba — pero `grep -rl "calendar-core"` en todo `src/` solo devuelve el reducer y su
propio test. **Nada lo usa.**

Tests existentes (11, en `__tests__/calendarReducer.test.ts`) — son la mejor especificación
de qué se considera "correcto":
- Setea `checkIn` cuando no hay nada seleccionado.
- Setea `checkOut` cuando la fecha es posterior Y cumple `minNights`.
- Reinicia si la fecha es anterior o igual a `checkIn`.
- **Reinicia (no rechaza con error) si no cumple `minNights`** — la fecha rechazada se
  vuelve el nuevo `checkIn`, no se muestra ningún error, es un comportamiento silencioso.
- Caso límite: exactamente `minNights` noches se acepta.
- `clearSelection` no toca `visibleMonth` ni `minNights`.

**Recomendación para el port**: usar este reducer como base (no el componente en producción),
ajustar `DEFAULT_MIN_NIGHTS` según lo que decida negocio, y agregarle la regla de "mínimo N
días desde hoy" que tampoco tiene (ver nota de timezone en §9 antes de hacerlo).

## 6. Flujo de estado (calendario → padre → URL)

- `CalendarMonths.onSelectDate(date)` → `CalendarModal` → `DateRangePicker` → prop
  `onChange(nextRange: { from?: string; to?: string })`.
- Fechas viajan como strings `"YYYY-MM-DD"` en todo el flujo (nunca `Date` fuera del picker).
- **No hay Context propio del calendario** — cada consumidor decide dónde vive el estado:
  - Página de detalle de propiedad: `BookingContext` (`useBooking()`), hidratado desde
    `?checkin=&checkout=` en el mount, sincronizado de vuelta a la URL después.
  - Widget de búsqueda del home: `useState` local (no compartido), solo se serializa a la URL
    al enviar el formulario.
  - Página de resultados: la URL **es** el estado — `filters.checkin/checkout` se leen de
    `searchParams` en cada render, sin estado intermedio.
- **Nombres de query params, confirmados en 3 lugares distintos**: `checkin` / `checkout`
  (todo minúscula, una sola palabra, sin guión ni camelCase), formato `YYYY-MM-DD` sin hora.
- El flujo de checkout **no** relee `checkin`/`checkout` de la URL — usa un token
  `?checkoutSession=` que resuelve del servidor un objeto con las fechas ya fijadas; solo
  revalida que `checkout > checkin` (sin mínimo de noches, sin bloqueadas).

## 7. Modal/popover

- Es un **modal centrado de pantalla completa** vía `createPortal(..., document.body)`, no
  un popover anclado al trigger. `w-[min(90vw,56rem)]` — en pantallas angostas ocupa 90% del
  viewport; con `numberOfMonths={2}` (2 meses lado a lado) esto puede verse apretado en
  320-375px — **revisar visualmente al portar**.
- Bloquea el scroll del body mientras está abierto, tiene focus trap manual (Tab/Shift+Tab),
  cierra con Escape, tiene botón × explícito.
- **No cierra al hacer click afuera del modal** (el overlay no tiene `onClick`) — a diferencia
  de la mayoría de date pickers. Si se porta, decidir si se quiere ese comportamiento o no.

## 8. Feedback visual al usuario

- Label del campo: `"Select dates"` → `"Mar 10"` (solo checkin) → `"Mar 10 — Mar 13"`
  (rango completo). **Nunca muestra el año** — un rango que cruza fin de año se ve
  `"Dec 30 — Jan 2"` sin forma de saber de qué año, ambiguo en tickets de soporte/capturas.
- Preview de hover dentro del calendario (§2), pero **no hay conteo de noches ni precio
  dentro del modal del calendario** — eso vive aparte, en `BookingPanel.tsx` (solo en la
  página de detalle), que sí muestra "{n} noches" + desglose de precio una vez hay rango.

## 9. Edge cases y bugs concretos a no repetir

1. **Sin mínimo de check-in**: se puede elegir hoy o el pasado, en las 3 superficies.
2. **Mínimo de noches duplicado con comportamientos distintos** (el hallazgo más importante):
   - `BookingPanel.tsx`: si `nights < minNightsRequired`, muestra warning ámbar y deshabilita
     "Book Now" — **no limpia la selección**, las fechas inválidas se quedan visibles.
   - `ResidenceDetailPage.tsx`: un `useEffect` separado, con **su propia copia** de
     `countNights`, si detecta lo mismo dispara un **toast** y **fuerza** `selectedRange` a
     `{from: undefined, to: undefined}`.
   - **Ambos corren en el mismo render.** El efecto de la página limpia el rango, así que el
     warning de `BookingPanel` solo se ve un instante antes de que el campo vuelva a
     "Select dates" con un toast encima. Esta inconsistencia (advertir-y-dejar vs.
     avisar-y-borrar) es la causa más probable de que el calendario "se sienta roto".
3. **`countNights` triplicado** (+ la 4ta del reducer huérfano), con parseo de fecha
   **inconsistente entre copias**: unas parsean `"YYYY-MM-DD"` a secas (= medianoche UTC según
   el spec de `Date`), otra le agrega `T00:00:00` (= medianoche **local**) — pueden discrepar
   en el conteo de noches según el timezone del visitante. `Math.round` disimula la mayoría
   de los casos pero no es una base sólida para portar tal cual.
4. **Mismo día checkout/checkin de otra reserva ("turnover day")**: nada en el código decide
   explícitamente si eso debe permitirse o no — depende de si el backend incluye o no ese día
   exacto en `blocked_dates`. Sin definición explícita, hay que preguntarlo antes de portar.
5. **Timezone de "hoy"**: hoy no importa porque no hay regla de mínimo-días-desde-hoy, pero
   es una bomba de tiempo — el día que se agregue esa regla (como pedía la memoria vieja), hay
   que decidir **de entrada** si "hoy" es el reloj del visitante o el timezone de la
   propiedad, si no, se repite el mismo tipo de bug off-by-one que ya causó confusión antes.
6. **Reabrir el calendario con un rango ya confirmado** borra visualmente el campo
   (`"Select dates"` de nuevo) hasta el próximo click — no se puede "editar" solo el checkout
   sin rehacer el ciclo completo de 2 clicks. Si se cierra el modal manualmente después de un
   solo click nuevo (sin completar), el rango previamente confirmado **se conserva intacto**.
7. **En modo mock, cambiar las fechas en el listado de resultados no filtra nada** —
   `applyFilters` (mock) nunca lee `filters.checkin/checkout`, solo la rama de API real los
   manda como query params. Esto puede parecer "el calendario no funciona" en desarrollo
   cuando en realidad es el filtro mock incompleto — aclarar esto si se replica el patrón.
8. **CSS de "día bloqueado" que nunca se aplica**: existe una regla
   `.rdp-vimex .rdp-day--blocked .rdp-day_button` (tachado + opacidad) en `effects.css`, pero
   **ningún código aplica esa clase** — react-day-picker v9 marca los días deshabilitados con
   su propio flag interno, no con `rdp-day--blocked`. Los días bloqueados probablemente solo
   se ven con el estilo default de la librería, no el look de marca pensado. Si se porta el
   look visual, hay que engancharlo vía `modifiers`/`modifiersClassNames` (mismo patrón ya
   usado para `preview_middle`/`preview_end`), no una clase suelta en CSS.
9. **`getBlockedDates` enmascara fallas reales de API** con el mock en silencio, incluso fuera
   de modo mock (§4) — puede mostrar disponibilidad falsa en producción sin avisar a nadie.

## 10. Dónde se usa el calendario — tabla completa

| Superficie | Archivo | ¿Recibe `blockedDateKeys`? | ¿De dónde sale el mínimo de noches? | ¿Dónde vive el estado de fecha? |
|---|---|---|---|---|
| Widget de búsqueda (home) | `src/components/home/SearchWidget.tsx` | No (`[]`) | ninguno | `useState` local, se descarta al navegar (solo se usa para armar la URL) |
| Barra de resultados (listado) | `src/components/residences/ResidencesResultsToolbar.tsx` | No | ninguno | URL (`checkin`/`checkout`), sin estado intermedio |
| Panel de reserva (detalle de propiedad) | `src/components/residences/BookingPanel.tsx` | **Sí** — reales, por propiedad | `residence.minNights`, duplicado (ver §9.2) | `BookingContext`, hidratado desde la URL |
| Checkout | no renderiza el calendario | N/A | N/A | solo lectura, viene de un `checkoutSession` resuelto por el server |

## 11. Tests existentes (útiles como especificación)

- `src/components/calendar/__tests__/DateRangePicker.close-behavior.test.tsx` (5 tests):
  modal se mantiene abierto tras el primer click y cierra tras el segundo válido; clase visual
  de "inicio de rango" tras el primer click; preview sombreado en hover; reabrir y clickear
  reinicia el rango anterior; cerrar manualmente tras un solo click nuevo conserva el rango
  previamente confirmado.
- `src/calendar-core/domain/__tests__/calendarReducer.test.ts` (11 tests) — único lugar donde
  se prueba mínimo de noches y casos límite (código huérfano, ver §5).
- `BookingPanel.test.tsx`: `disables booking when selected range does not satisfy minimum nights`.
- `booking-flow.integration.test.tsx`: `clears detail selected range when it does not satisfy minimum nights`.
- `checkout/__tests__/unit/utils.test.ts`: casos de `countNights` (2 noches, 1 noche, mismo
  día, orden invertido, fecha inválida, cruce de mes).

No hay tests dedicados de `CalendarModal.tsx`/`CalendarMonths.tsx`/`DateRangeField.tsx` por
separado — su cobertura es incidental, vía los tests de `DateRangePicker`.

## 12. Recomendación concreta para portar a New_Landing

1. **No copiar `components/calendar/DateRangePicker.tsx` tal cual** — no tiene mínimo de
   noches real, y el bug de duplicación (§9.2) es justamente lo que se quiere evitar.
2. **Partir de `calendar-core/domain/calendarReducer.ts`** (huérfano pero correcto y
   testeado) como la lógica de negocio, y sí conectarlo a un componente esta vez — con un
   solo lugar de verdad para "¿es válido este rango?", no duplicado en dos componentes.
3. Antes de agregar una regla de "mínimo N días desde hoy": decidir explícitamente timezone
   de referencia (visitante vs. propiedad) — no asumir `new Date()` del navegador sin pensarlo.
4. Si se quiere el look de "día bloqueado" con tachado, engancharlo vía `modifiers` de
   react-day-picker, no una clase CSS suelta que nunca se aplica.
5. Decidir explícitamente la política de "turnover day" (mismo día checkout/checkin de otra
   reserva) con quien maneje la disponibilidad real (Guesty, en el caso de New_Landing) antes
   de portar el filtro de fechas bloqueadas.
6. Si el fetch de disponibilidad real falla, **no** caer en silencio a datos mock/falsos en
   producción — mostrar un estado de error explícito en vez de simular disponibilidad.
