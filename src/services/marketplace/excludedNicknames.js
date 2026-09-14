// Clasificación de propiedades por nickname, tomada de la pestaña "Tipo de
// Propiedad" del panel unificado de Guesty
// (https://claude.ai/artifact/Gs2moutHKxez9GhKzrTfyq), revisada 2026-09-14.
// Guesty no tiene un campo nativo para esto — es una clasificación de negocio
// propia de Vimex (misma fuente que manual_casa_sync_service.py en
// contabilidadVimex). Solo las propiedades "TOTAL" (reserva total, las
// administra Vimex de punta a punta) deben aparecer en el Marketplace de
// New_Landing — "SIN RESERVAS" las administra el dueño directo, "HOMEWATCH"
// ya no recibe reservas, y "PRUEBA" son listings de prueba en Guesty, no
// propiedades reales.
//
// ⚠️ Esto es un snapshot puntual del artifact en la fecha de arriba — si la
// clasificación cambia ahí (nueva propiedad SIN RESERVAS/HOMEWATCH, o una que
// vuelve a TOTAL), hay que actualizar esta lista a mano, no se sincroniza sola.

const SIN_RESERVAS = [
  'ANAH-31B', 'FISH-226', 'LAG-D101', 'PK-01', 'PK-03', 'PK-07', 'PK-20', 'PK-22',
  'SAN-101B', 'SAN-101E', 'SAN-102A', 'SAN-201A', 'SAN-203A', 'SAN-206B',
  'SAN-301G', 'SAN-302C', 'SAN-302D', 'SAN-304A', 'SING-209', 'SYR-306', 'SYR-311',
]

const HOMEWATCH = [
  'HELI-206', 'IPAN-410D', 'MAG-101F', 'MAYA-C9', 'MIRA-411', 'NICK-303C', 'VAIV-GH8',
]

// Listings de prueba en Guesty (no son propiedades reales) — se excluyen igual
// que SIN RESERVAS/HOMEWATCH aunque el usuario no los mencionó explícitamente,
// porque claramente no deben aparecer en el Marketplace.
const PRUEBA = [
  'Guesty Test', 'Propiedad de prueba', 'Akumal Test', 'PDC Test', 'tulum test',
]

// Exclusiones manuales pedidas directamente por el usuario — no vienen de la
// clasificación TOTAL/SIN RESERVAS/HOMEWATCH/PRUEBA del artifact, es un ajuste
// aparte caso por caso.
const MANUAL = [
  'AMIR-308B', // pedido 2026-09-14
]

export const EXCLUDED_NICKNAMES = new Set([...SIN_RESERVAS, ...HOMEWATCH, ...PRUEBA, ...MANUAL])
