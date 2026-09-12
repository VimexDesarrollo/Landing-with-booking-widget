import AcercaDeVimexClient from './AcercaDeVimexClient'

export const metadata = {
  title: 'Quiénes Somos · Vimex Vacation Rentals',
  description: 'Conoce a Vimex: administración de propiedades y rentas vacacionales familiares en Playa del Carmen, Tulum y Akumal desde 2004. Servicios, destinos, testimonios y contacto.',
  alternates: { canonical: '/acerca-de-vimex' },
}

export default function AcercaDeVimexPage() {
  return <AcercaDeVimexClient />
}
