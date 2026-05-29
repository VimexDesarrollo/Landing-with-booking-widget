import { Fraunces, Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/context/LangContext'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--f-display',
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--f-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--f-mono',
})

export const metadata = {
  title: 'Vimex Vacation Rentals · Playa del Carmen, Tulum & Akumal',
  description: 'Family-owned vacation rentals and property management in the Riviera Maya since 2004. Bilingual team, 20+ years of experience.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  )
}
