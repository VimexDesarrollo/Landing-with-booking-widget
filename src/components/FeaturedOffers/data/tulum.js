import {
  TbPool, TbBath, TbPlant2, TbAirConditioning, TbWifi,
  TbToolsKitchen2, TbSofa, TbBuildingStore,
} from 'react-icons/tb'

const images = Array.from(
  { length: 23 },
  (_, i) => `/assets/CARM-103/${String(i + 1).padStart(2, '0')}.jpg`
)

const amenities = [
  { en: 'Shared pool', es: 'Alberca compartida', Icon: TbPool },
  { en: 'Jacuzzi', es: 'Jacuzzi', Icon: TbBath },
  { en: 'Tropical garden & lounge', es: 'Jardín y lounge tropical', Icon: TbPlant2 },
  { en: 'A/C', es: 'Aire acondicionado', Icon: TbAirConditioning },
  { en: 'WiFi', es: 'WiFi', Icon: TbWifi },
  { en: 'Equipped kitchen', es: 'Cocina equipada', Icon: TbToolsKitchen2 },
  { en: 'Sofa bed', es: 'Sofá cama', Icon: TbSofa },
  { en: 'Boutique building', es: 'Edificio boutique', Icon: TbBuildingStore },
]

export const tulumOffer = {
  id: 'tulum-carm-103',
  images,
  badge: { en: 'Monthly rental', es: 'Renta mensual' },
  titlePre: { en: 'Apartment in', es: 'Departamento en' },
  titleEm: 'Tulum',
  price: '$21,000 MXN',
  priceUnit: { en: '/ month', es: '/ mes' },
  specs: {
    en: '2 Bedrooms + sofa bed · Up to 6 Guests · Tulum',
    es: '2 Recámaras + sofá cama · Hasta 6 Huéspedes · Tulum',
  },
  body: {
    en: "Inside a boutique building wrapped in tropical gardens in Tulum, this 2-bedroom condo comes with a sofa bed for up to 6 guests and access to a shared pool, jacuzzi, and lounge area under the trees. This month only, book at an exclusive monthly rate before it's gone.",
    es: 'Dentro de un edificio boutique rodeado de jardines tropicales en Tulum, este condominio de 2 recámaras incluye sofá cama para hasta 6 huéspedes y acceso a alberca compartida, jacuzzi y área de lounge entre los árboles. Solo este mes, resérvalo a una tarifa mensual exclusiva antes de que se agote.',
  },
  amenities,
  bookingUrl: 'https://vimexmx.guestybookings.com/es/properties/6a42b88221fe96000e4dfafa',
}
