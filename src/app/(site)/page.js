import HomeClient from './HomeClient'

export const metadata = {
  title: 'Vimex Vacation Rentals · Renta Vacacional en Riviera Maya',
  description: 'Explora más de un centenar de propiedades en Playa del Carmen, Tulum y Akumal. Rentas vacacionales y administración de propiedades familiares desde 2004.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return <HomeClient />
}
