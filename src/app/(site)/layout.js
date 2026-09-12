import Loader from '@/components/Loader'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// Chrome compartido entre "/" y "/acerca-de-vimex" — un route group evita
// duplicar Loader/Cursor/Nav/Footer en dos árboles de página distintos.
// Este layout es un server component; Loader/Nav/Footer/Cursor son 'use client'
// pero eso no es problema, un layout server puede renderizar hijos client.
export default function SiteLayout({ children }) {
  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      {children}
      <Footer />
    </>
  )
}
