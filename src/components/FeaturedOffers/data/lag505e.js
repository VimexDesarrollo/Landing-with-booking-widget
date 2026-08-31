import {
  TbPool, TbBarbell, TbKayak, TbSunset, TbTrees, TbFence, TbGolf,
  TbBriefcase, TbWashMachine, TbWashTumbleDry, TbWifi,
} from 'react-icons/tb'

// Depto en Lagunas de Mayakoba, Playa del Carmen.
// Fotos en public/assets/LAG505E/ (portada: MAIN-LAG505E.jpg).
const images = [
  '/assets/LAG505E/MAIN-LAG505E.jpg',
  '/assets/LAG505E/a073iryzheafs5nou5kk.jpg',
  '/assets/LAG505E/b0n6hleins6aolpg1yth.jpg',
  '/assets/LAG505E/cznyeggohfx1k7ixomoh.jpg',
  '/assets/LAG505E/dmkzuqvowkqj2zbvdvh7.jpg',
  '/assets/LAG505E/dvuxzluunw8kg0ldj9rn.jpg',
  '/assets/LAG505E/egk0ojzg4jqfkorii3ck.jpg',
  '/assets/LAG505E/ek1ip0rf9japsfwbcirn.jpg',
  '/assets/LAG505E/frcezhwommydj76s8rgi.jpg',
  '/assets/LAG505E/gef85g10qvnk1ffsht8k.jpg',
  '/assets/LAG505E/gtmzjp3f01bc5s4qgr7h.jpg',
  '/assets/LAG505E/i4ytix6kypuomulixl06.jpg',
  '/assets/LAG505E/jfxyevqo6bribekp1jzf.jpg',
  '/assets/LAG505E/jjmesqi4crubjjab6scm.jpg',
  '/assets/LAG505E/ludcgdkwelckmsdrihag.jpg',
  '/assets/LAG505E/muolsffiv8hrenu4hcil.jpg',
  '/assets/LAG505E/ofhiqpcsxwbpdlkgme6z.jpg',
  '/assets/LAG505E/ooj3ndikhqbwsk26wmia.jpg',
  '/assets/LAG505E/uk54fef2sj4bun5dipfa.jpg',
  '/assets/LAG505E/vasag24rhunopjixafwv.jpg',
  '/assets/LAG505E/wxqgvqvqam3o6ggolr9j.jpg',
  '/assets/LAG505E/zfgi9wuxia3cpexgf29d.jpg',
  '/assets/LAG505E/zgyzhhxovrjog5i29ita.jpg',
]

const amenities = [
  { en: 'Infinity pools', es: 'Albercas infinity', Icon: TbPool },
  { en: 'Gym', es: 'Gimnasio', Icon: TbBarbell },
  { en: 'Kayakable lagoon', es: 'Laguna para kayak', Icon: TbKayak },
  { en: 'Private terrace', es: 'Terraza privada', Icon: TbSunset },
  { en: 'Jungle setting', es: 'Entorno de selva', Icon: TbTrees },
  { en: 'Gated community', es: 'Comunidad privada', Icon: TbFence },
  { en: 'Near El Camaleón Golf', es: 'Cerca del golf El Camaleón', Icon: TbGolf },
  { en: 'Dedicated workspace', es: 'Espacio de trabajo', Icon: TbBriefcase },
  { en: 'Washer', es: 'Lavadora', Icon: TbWashMachine },
  { en: 'Dryer', es: 'Secadora', Icon: TbWashTumbleDry },
  { en: 'Wi-Fi', es: 'Wi-Fi', Icon: TbWifi },
]

export const lag505eOffer = {
  id: 'lag505e',
  images,
  badge: { en: 'Monthly rental', es: 'Renta mensual' }, // TODO: confirmar tipo de renta
  titlePre: { en: 'Apartment in', es: 'Departamento en' },
  titleEm: 'Mayakoba PDC',
  subtitle: 'Lagunas de Mayakoba',
  price: '$22,000 MXN',
  priceUnit: { en: '/ month', es: '/ mes' }, // TODO: confirmar (/mes o /noche)
  specs: {
    en: 'Apartment · Up to 4 Guests · Lagunas de Mayakoba',
    es: 'Departamento · Hasta 4 Huéspedes · Lagunas de Mayakoba',
  },
  body: {
    en: 'Contemporary condo inside the jungle-wrapped Lagunas de Mayakoba gated community — kayakable lagoon, infinity pools, and a private 5th-floor terrace over native vegetation. Two miles from Xcalacoco Beach and next to El Camaleón Golf Course (PGA Tour). Washer, dryer, and a dedicated workspace included — built for families and groups exploring the Riviera Maya from a quiet jungle setting.',
    es: 'Condominio contemporáneo dentro de Lagunas de Mayakoba, comunidad privada rodeada de selva, con laguna navegable en kayak, albercas infinity y terraza privada en el 5º piso sobre la vegetación nativa. A 3 km de Playa Xcalacoco y junto al campo de golf El Camaleón (PGA Tour). Incluye lavadora, secadora y espacio de trabajo — ideal para familias y grupos que exploran la Riviera Maya desde un entorno tranquilo.',
  },
  amenities,
  bookingUrl: '#', // TODO: link de Guesty
}
