import {
  TbBed, TbWashTumbleDry, TbElevator, TbSparkles, TbWind, TbHanger,
  TbWorldWww, TbIroning, TbToolsKitchen2, TbDeviceTv, TbWashMachine, TbWifi,
} from 'react-icons/tb'

// Depto en Playa del Carmen, cerca de Playa Mamitas.
// Fotos en public/assets/ZILHA3/ (portada: ZILHA-MAIN-PICTURE.jpg).
const images = [
  '/assets/ZILHA3/ZILHA-MAIN-PICTURE.jpg',
  '/assets/ZILHA3/ai6j0p4qdcvxu03ncrwv.jpg',
  '/assets/ZILHA3/c63j1mwnalutie6fd4s5.jpg',
  '/assets/ZILHA3/ghqblejczp7yav4s2pm1.jpg',
  '/assets/ZILHA3/h34kan64uxp82av1y1me.jpg',
  '/assets/ZILHA3/jsvdquvhc8gi1zvgga2l.jpg',
  '/assets/ZILHA3/kxiz7qpvxrmjao4afuic.jpg',
  '/assets/ZILHA3/q0zwschtcqalurxfjsa8.jpg',
  '/assets/ZILHA3/qcczf76wimetob8y2j2b.jpg',
  '/assets/ZILHA3/rkdrsp99tncnhftwspv3.jpg',
  '/assets/ZILHA3/ry5g1fwwa3lvviiiqwwb.jpg',
  '/assets/ZILHA3/sn1staxke1llwzr8ya04.jpg',
  '/assets/ZILHA3/tptoy8qtbzabr4ytgr5m.jpg',
  '/assets/ZILHA3/tuzftnhgvekepzlyzbp6.jpg',
  '/assets/ZILHA3/twvbvfaomya83sjxpf4u.jpg',
  '/assets/ZILHA3/vdfwxhwk8gjm01ujvbp1.jpg',
  '/assets/ZILHA3/wcvznb3judzwmlarxrml.jpg',
  '/assets/ZILHA3/zee6ri0avzkf0qpfedgv.jpg',
]

const amenities = [
  { en: 'Bed linen', es: 'Ropa de cama', Icon: TbBed },
  { en: 'Dryer', es: 'Secadora', Icon: TbWashTumbleDry },
  { en: 'Elevator', es: 'Ascensor', Icon: TbElevator },
  { en: 'Essentials', es: 'Artículos básicos', Icon: TbSparkles },
  { en: 'Hair dryer', es: 'Secador de pelo', Icon: TbWind },
  { en: 'Hangers', es: 'Perchas', Icon: TbHanger },
  { en: 'Internet', es: 'Internet', Icon: TbWorldWww },
  { en: 'Iron', es: 'Plancha', Icon: TbIroning },
  { en: 'Kitchen', es: 'Cocina', Icon: TbToolsKitchen2 },
  { en: 'TV', es: 'TV', Icon: TbDeviceTv },
  { en: 'Washer', es: 'Lavadora', Icon: TbWashMachine },
  { en: 'Wi-Fi', es: 'Wi-Fi', Icon: TbWifi },
]

export const zilha3Offer = {
  id: 'zilha3',
  images,
  badge: { en: 'Monthly rental', es: 'Renta mensual' }, // TODO: confirmar tipo de renta
  titlePre: { en: 'Apartment in', es: 'Departamento en' },
  titleEm: 'Playa del Carmen',
  price: '$14,000 MXN',
  priceUnit: { en: '/ month', es: '/ mes' }, // TODO: confirmar (/mes o /noche)
  specs: {
    en: 'Loft · Near Mamitas Beach · Playa del Carmen',
    es: 'Loft · Cerca de Playa Mamitas · Playa del Carmen',
  },
  body: {
    en: 'Ground-floor loft with private patio, plunge pool, and rooftop terrace, 4 blocks from the beach and 3 from 5th Avenue. Fully-equipped kitchen and perfect for families or friends who want everything walkable — Mamitas Beach, dining, and nightlife — without a car.',
    es: 'Loft en planta baja con patio privado, alberca chica y terraza en la azotea, a 4 cuadras de la playa y 3 de la Quinta Avenida. Cocina totalmente equipada, ideal para familias o amigos que quieren todo a pie —Playa Mamitas, restaurantes y vida nocturna— sin necesidad de auto.',
  },
  amenities,
  bookingUrl: 'https://vimexmx.guestybookings.com/properties/6a3d5fefe0419000121caf8a',
}
