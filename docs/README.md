# docs/ — índice

Documentación de referencia para portar patrones de **`booking-engine`**
(`~/vimex/booking-engine`, puerto 3002, "el proyecto que ya teníamos avanzado") a
**New_Landing**. Para arquitectura/convenciones propias de New_Landing, ver
[`../CLAUDE.md`](../CLAUDE.md) — ese doc es sobre New_Landing; los de aquí son sobre
booking-engine, la fuente de la que se porta.

## Qué hay

| Doc | De qué trata | Nivel de detalle |
|---|---|---|
| [booking-engine-architecture.md](booking-engine-architecture.md) | Mapa completo: rutas, contextos, servicios, auth, checkout, testing, config, animaciones | Vista general de todo el proyecto |
| [booking-engine-search-widget.md](booking-engine-search-widget.md) | El widget de destino + fechas + huéspedes del home | Detallado |
| [booking-engine-calendar.md](booking-engine-calendar.md) | El calendario (`DateRangePicker`) — el "dolor de cabeza" | **Máximo detalle**: bugs conocidos, duplicaciones, tests, recomendación concreta de cómo portarlo bien |
| [porting-booking-engine-marketplace.md](porting-booking-engine-marketplace.md) | Grid + galería de propiedades — **ya portado** a New_Landing | Qué se copió, qué se adaptó, mapa como feature pendiente |

## Cómo usar esto

- Si vas a tocar/portar **una pieza específica** (el calendario, el widget, el marketplace),
  lee solo ese doc — están escritos para ser autocontenidos.
- Si necesitas **contexto general** de cómo está armado booking-engine antes de decidir dónde
  encaja algo nuevo, empieza por `booking-engine-architecture.md`.
- Todos estos docs son sobre el código de **booking-engine tal como estaba el 2026-09-14** —
  son investigación puntual, no se actualizan solos si booking-engine cambia después. Si algo
  se porta y booking-engine evoluciona, vale la pena re-verificar antes de confiar en el
  detalle exacto (número de línea, nombre de función) citado aquí.
- El calendario en particular tiene una recomendación explícita de **qué NO copiar tal cual**
  (el componente en producción de booking-engine) y **qué sí usar como base** (un reducer
  correcto pero huérfano) — no asumir que "lo que está en pantalla en booking-engine" es
  automáticamente lo que hay que portar.
