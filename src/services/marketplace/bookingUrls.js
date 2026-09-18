// Mapeo nickname → URL del motor de reservas (vimexmx.guestybookings.com).
// Snapshot manual — si Vimex agrega o cambia links, hay que actualizar este
// archivo a mano, no se sincroniza solo.
//
// Los nicknames de este archivo usan el formato REAL de Guesty (ej. "LAGV5",
// sin guión) — no el formato con guiones de la clasificación TOTAL/SIN
// RESERVAS/HOMEWATCH del artifact (ver excludedNicknames.js). El cruce en
// mapGuestyListing.js se hace contra `listing.nickname` tal como viene de
// Guesty, así que coincide directo.
//
// Historial:
// - 2026-09-15: base de 76 pares de "Links_Booking_Engine_Completo -
//   Booking Engine Links.csv" (pegado por el usuario). Dos no corresponden a
//   propiedades TOTAL del Marketplace (AMIR-308B excluida a mano, LAGH101 no
//   es TOTAL) — se dejan igual, no hace daño tenerlos de más.
// - 2026-09-17: de las 20 propiedades TOTAL que quedaban sin URL, se sacó el
//   guesty_id de cada una en la pestaña "IDs" del artifact
//   (Gs2moutHKxez9GhKzrTfyq) y se PROBÓ CADA URL EN VIVO contra
//   guestybookings.com antes de darla por buena (criterio: el <title> de la
//   respuesta — "Property page" = genérico/no publicado todavía,
//   cualquier otro título = real, confirmado). De 20: 1 (AMAL-201) ya
//   resultó buena en la primera pasada; las otras 19 fallaron ese día
//   (incluida PERF-5, que ni siquiera tenía guesty_id). Al re-probar horas
//   después, las 18 que sí tenían guesty_id ya habían sido publicadas
//   (alguien del equipo las publicó en Guesty entre medio) — se agregaron.
//   PERF-5 se probó de nuevo con un guesty_id encontrado después en una vista
//   más completa del artifact y SIGUE sin publicarse (sigue devolviendo la
//   página genérica) — no tiene URL todavía, no es un olvido.
export const BOOKING_URLS = {
  'AMAL-201': 'https://vimexmx.guestybookings.com/properties/6a3466c7fe84350014458335',
  'AMIR-308B': 'https://vimexmx.guestybookings.com/properties/6a3aa1cc2f79eb0025e9107e',
  'ANAH-401S': 'https://vimexmx.guestybookings.com/properties/6a3da1b2e1cab6001445a44e',
  'ANAH-4A': 'https://vimexmx.guestybookings.com/properties/6a4bd8d61ce42d00151d2895',
  'ARTH-4207': 'https://vimexmx.guestybookings.com/properties/6a3e97761f0dbb00118bd0eb',
  'ARTH-5101': 'https://vimexmx.guestybookings.com/properties/6a3ec6692c62fe0013268d68',
  'ARTH-5202': 'https://vimexmx.guestybookings.com/properties/6a3ef252605e7b00137aafd7',
  'ARTI-102': 'https://vimexmx.guestybookings.com/properties/6a42a492264f3e00145fead5',
  'ARTI-212': 'https://vimexmx.guestybookings.com/properties/6a3ffc781f0dbb0011a182fe',
  'ARTI-217': 'https://vimexmx.guestybookings.com/properties/6a4285b0662c3e0014c00c3c',
  'ATH-114': 'https://vimexmx.guestybookings.com/properties/6a3aaafb3b75bc0023c1fc2d',
  'ATH-128': 'https://vimexmx.guestybookings.com/properties/6a39a96aada82c0010b8a742',
  'ATH-235': 'https://vimexmx.guestybookings.com/properties/6a3ab2f405dc9d00121c172f',
  'ATH-311': 'https://vimexmx.guestybookings.com/properties/6a397cdc0716cf00131eb4e5',
  'ATH-317': 'https://vimexmx.guestybookings.com/properties/6a399c4bb96fca00138b1253',
  'ATHE-1': 'https://vimexmx.guestybookings.com/properties/6a0b3a122bdcb900135778c1',
  'BAHA-302': 'https://vimexmx.guestybookings.com/properties/6a0b866324d02f00133d5c0f',
  'BBC-05': 'https://vimexmx.guestybookings.com/properties/6a47ff2700b0e50014916bd5',
  'CARM-103': 'https://vimexmx.guestybookings.com/properties/6a42b88221fe96000e4dfafa',
  'CARM-208': 'https://vimexmx.guestybookings.com/properties/6a42de13c56e76001262e150',
  'CARM-308': 'https://vimexmx.guestybookings.com/properties/6a42dfccc789e20014b7da8e',
  'CDM-202': 'https://vimexmx.guestybookings.com/properties/6a43d2b1ce97f60015e0238a',
  'CDM-203': 'https://vimexmx.guestybookings.com/properties/6a43d03de3a0f00015c196f2',
  'CHAC-503': 'https://vimexmx.guestybookings.com/properties/6a43d5c699d3b000126433cd',
  'COCO-404A': 'https://vimexmx.guestybookings.com/properties/6a43d960c7d9c40010bdbaf2',
  'CSOL-A3': 'https://vimexmx.guestybookings.com/properties/6a42e5c15cd1ef00130ae659',
  'EST-01': 'https://vimexmx.guestybookings.com/properties/6a4428c72e11d3001045f2aa',
  'FARO-103': 'https://vimexmx.guestybookings.com/properties/6a3abdd516d521002456ea79',
  'GIRASOL': 'https://vimexmx.guestybookings.com/properties/6a43e0c51cb6870012f87e5a',
  'ICON-507': 'https://vimexmx.guestybookings.com/properties/6a43ec3c6ec5c000139c27d6',
  'IPAN-207B': 'https://vimexmx.guestybookings.com/properties/6a43f382b7a3f8001443bacf',
  'ITB-201': 'https://vimexmx.guestybookings.com/properties/6a43f886464e4f0010eec980',
  'LAG-E505': 'https://vimexmx.guestybookings.com/properties/6a511e26c166e50013f19782',
  'LAGH101': 'https://vimexmx.guestybookings.com/properties/6a07566a2a5b570013605438',
  'LAGV5': 'https://vimexmx.guestybookings.com/properties/6a07566f2a5b570013605571',
  'LIT-04': 'https://vimexmx.guestybookings.com/properties/6a43fc5bee10d500145a23f2',
  'LUX-604': 'https://vimexmx.guestybookings.com/properties/6a43ffd2794ba40012ba519e',
  'MAG-101E': 'https://vimexmx.guestybookings.com/properties/6a440433471cbe0014bd5c82',
  'MAG-102E': 'https://vimexmx.guestybookings.com/properties/6a566f58d4117a0013782859',
  'MAG-GH1F': 'https://vimexmx.guestybookings.com/properties/6a440b80270bf8001210be5a',
  'MARE-304': 'https://vimexmx.guestybookings.com/properties/6a4410f9c7d9c40010c0d1d5',
  'MAREA-313N': 'https://vimexmx.guestybookings.com/properties/6a4c13d51ce42d00151fe03a',
  'MAREA-604N': 'https://vimexmx.guestybookings.com/properties/6a452602e25a680011099d84',
  'MAREA-625S': 'https://vimexmx.guestybookings.com/properties/6a4528bc93709f0014d1d14b',
  'MAYA-A4': 'https://vimexmx.guestybookings.com/properties/6a442d48c815220010d4761e',
  'MENE-302': 'https://vimexmx.guestybookings.com/properties/6a452f758f7d580012249325',
  'MID2-03': 'https://vimexmx.guestybookings.com/properties/6a453acc9df79f0012e28bcb',
  'MOMA-402': 'https://vimexmx.guestybookings.com/properties/6a4532154e2ea6001369788d',
  'MOMA-506': 'https://vimexmx.guestybookings.com/properties/6a45407e58d5e9001272d0f5',
  'NICK-206C': 'https://vimexmx.guestybookings.com/properties/6a4d1ffe33489c0015ea643a',
  'NUEVA-30C': 'https://vimexmx.guestybookings.com/properties/6a4543a5f210a00010e9bc53',
  'OCEAPH-7': 'https://vimexmx.guestybookings.com/properties/6a45461800b0e50014764c8b',
  'OMAR-401': 'https://vimexmx.guestybookings.com/properties/6a454d16b600de00111b28c3',
  'PALM-37': 'https://vimexmx.guestybookings.com/properties/6a3ad1472e147800137d4ef8',
  'PALM-77': 'https://vimexmx.guestybookings.com/properties/6a3ad58c76935a0013ed843e',
  'PARA-103': 'https://vimexmx.guestybookings.com/properties/6a3af27a6ca18d00243ea020',
  'PARA-202': 'https://vimexmx.guestybookings.com/properties/6a45512764ad8400141d14d0',
  'PERF-105': 'https://vimexmx.guestybookings.com/properties/6a45677c0f346f001441124c',
  'PERF-107': 'https://vimexmx.guestybookings.com/properties/6a456d309786fe00140fde65',
  'PERF-201': 'https://vimexmx.guestybookings.com/properties/6a467c3d94ca890014c31e48',
  'PERF-203': 'https://vimexmx.guestybookings.com/properties/6a4680f76c0aea00158fc77f',
  'PERF-303': 'https://vimexmx.guestybookings.com/properties/6a4d6cdb2130660014ed41b5',
  'PERF-405': 'https://vimexmx.guestybookings.com/properties/6a46845c9786fe00141b1dad',
  'PERF-504': 'https://vimexmx.guestybookings.com/properties/6a4686db9c096c0012d62efd',
  'PERF-505': 'https://vimexmx.guestybookings.com/properties/6a46872e2e940a0014857e35',
  'PERF-6': 'https://vimexmx.guestybookings.com/properties/6a4555bda8a92100124c64a8',
  'PLAY-16': 'https://vimexmx.guestybookings.com/properties/6a46900e58d5e900127f326a',
  'PUEB-108': 'https://vimexmx.guestybookings.com/properties/6a4694db0f346f00144d0fdc',
  'PVILLA-202': 'https://vimexmx.guestybookings.com/properties/6a3afbac16d521002459b8ba',
  'QSOL-2C': 'https://vimexmx.guestybookings.com/properties/6a46a4d86c0aea0015910f4e',
  'SAN-103B': 'https://vimexmx.guestybookings.com/properties/6a3bf8c0e632dc001317fa91',
  'SAN-105A': 'https://vimexmx.guestybookings.com/properties/6a3c00a0e4898000148c2caf',
  'SAN-106A': 'https://vimexmx.guestybookings.com/properties/6a3ebe3d5f43c4001275ebb4',
  'SAN-206A': 'https://vimexmx.guestybookings.com/properties/6a3c1183a088380022dc3d98',
  'SELV-117A4': 'https://vimexmx.guestybookings.com/properties/6a3c19c53b75bc0023cfda03',
  'SERE-309': 'https://vimexmx.guestybookings.com/properties/6a3c226605dc9d00122b455b',
  'SERE-314': 'https://vimexmx.guestybookings.com/properties/6a46a85400b0e5001484938a',
  'SHORE-12': 'https://vimexmx.guestybookings.com/properties/6a46b0d34aace20013a48510',
  'SING-403': 'https://vimexmx.guestybookings.com/properties/6a46b3d0e3514d0010a53774',
  'SING-404': 'https://vimexmx.guestybookings.com/properties/6a46cece693b4f0013bc30d6',
  'SKY-205': 'https://vimexmx.guestybookings.com/properties/6a46d350b35c3000121b8d7d',
  'SUK-307': 'https://vimexmx.guestybookings.com/properties/6a46d9f5a8a92100125b565a',
  'SYR-101': 'https://vimexmx.guestybookings.com/properties/6a3c5197d4b0c6001532b92e',
  'SYR-312': 'https://vimexmx.guestybookings.com/properties/6a3d465474e4520013834a1a',
  'SYR-404': 'https://vimexmx.guestybookings.com/properties/6a46de842e940a00148a0743',
  'TAO-117G': 'https://vimexmx.guestybookings.com/properties/6a3d4fb9d4c7dc0012648257',
  'TAO-120G': 'https://vimexmx.guestybookings.com/properties/6a47d37d9786fe001426e3f6',
  'TAO-321PH': 'https://vimexmx.guestybookings.com/properties/6a4e7d4acc0c930014f9aa43',
  'TER-201': 'https://vimexmx.guestybookings.com/properties/6a47edb2e6afd00014680a93',
  'VIVA-207': 'https://vimexmx.guestybookings.com/properties/6a47f1a5b787be00142d1d39',
  'WH-27': 'https://vimexmx.guestybookings.com/properties/6a3d593636f1f5001160f70e',
  'XALET-301B': 'https://vimexmx.guestybookings.com/properties/6a47f61b00b0e50014910a98',
  'YAXTE-1': 'https://vimexmx.guestybookings.com/properties/6a47f94358d5e900128cfead',
  'ZACI-2A': 'https://vimexmx.guestybookings.com/properties/6a47fc3c9df79f0012fe1a98',
  'ZILHA-3': 'https://vimexmx.guestybookings.com/properties/6a3d5fefe0419000121caf8a',
}
