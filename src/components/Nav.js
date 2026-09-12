'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/context/LangContext'

export default function Nav() {
  const { lang, setLang, t } = useLang()
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  // El estilo transparente/blanco de Nav asume que arriba hay un Hero oscuro
  // (solo pasa en "/"). En rutas sin Hero (ej. /acerca-de-vimex, que arranca
  // directo con una sección clara) forzamos el look "scrolled" (fondo claro,
  // texto navy) desde el principio, si no el header queda invisible.
  const isSolid = pathname !== '/'

  useEffect(() => {
    const nav = navRef.current
    let lastY = 0
    const onScroll = () => {
      const y = window.scrollY
      document.body.classList.toggle('is-scrolled', y > 60)
      if (y > 80 && y > lastY) nav?.classList.add('is-hidden')
      else nav?.classList.remove('is-hidden')
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Estas secciones viven en /acerca-de-vimex (Nav/Footer son compartidos con "/",
  // así que los anchors siempre apuntan ahí — un link a /acerca-de-vimex#feel
  // funciona igual estando ya en esa página, Next/el navegador solo saltan al
  // fragmento sin recargar).
  const links = [
    { href: '/acerca-de-vimex#feel', en: 'About Us', es: 'Quiénes Somos' },
    { href: '/acerca-de-vimex#services', en: 'Property Management', es: 'Gestión de Propiedades' },
    { href: '/acerca-de-vimex#dest', en: 'Destinations', es: 'Destinos' },
    { href: '/acerca-de-vimex#contact', en: 'Contact Us', es: 'Contacto' },
  ]

  return (
    <>
      <nav className={`nav${isSolid ? ' nav--solid' : ''}`} ref={navRef}>
        <Link href="/" className="nav__logo" aria-label="Vimex Vacation Rentals">
          <img src="/assets/vimex-logo-white.png" alt="Vimex" className="nav__logo-white" />
          <img src="/assets/vimex-logo.png" alt="Vimex" className="nav__logo-color" />
        </Link>

        <div className="nav__menu">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {t(l.en, l.es)}
            </Link>
          ))}
        </div>

        <div className="nav__right">
          <div className="nav__lang">
            <button className={lang === 'es' ? 'is-active' : ''} onClick={() => setLang('es')}>ES</button>
            <button className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          <Link href="/acerca-de-vimex#contact" className="nav__cta">
            {t('Book Now', 'Reservar Ahora')}
          </Link>
          <button
            className={`nav__burger${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav__drawer${menuOpen ? ' is-open' : ''}`}>
        <div className="nav__drawer-lang">
          <button className={lang === 'es' ? 'is-active' : ''} onClick={() => setLang('es')}>ES</button>
          <button className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
        <nav className="nav__drawer-links">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ transitionDelay: menuOpen ? `${i * 0.07}s` : '0s' }}
              onClick={() => setMenuOpen(false)}
            >
              {t(l.en, l.es)}
            </Link>
          ))}
        </nav>
        <Link
          href="/acerca-de-vimex#contact"
          className="nav__drawer-cta"
          onClick={() => setMenuOpen(false)}
        >
          {t('Book Now', 'Reservar Ahora')}
        </Link>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="nav__overlay" onClick={() => setMenuOpen(false)} />}
    </>
  )
}
