'use client'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LangContext'

export default function Nav() {
  const { lang, setLang, t } = useLang()
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const scrollTo = (id) => {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.querySelector(id)
      if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
    }, 300)
  }

  const links = [
    { href: '#feel', en: 'About Us', es: 'Quiénes Somos' },
    { href: '#services', en: 'Property Management', es: 'Gestión de Propiedades' },
    { href: '#dest', en: 'Destinations', es: 'Destinos' },
    { href: '#contact', en: 'Contact Us', es: 'Contacto' },
  ]

  return (
    <>
      <nav className="nav" ref={navRef}>
        <a href="#" className="nav__logo" aria-label="Vimex Vacation Rentals">
          <img src="/assets/vimex-logo-white.png" alt="Vimex" className="nav__logo-white" />
          <img src="/assets/vimex-logo.png" alt="Vimex" className="nav__logo-color" />
        </a>

        <div className="nav__menu">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href) }}>
              {t(l.en, l.es)}
            </a>
          ))}
        </div>

        <div className="nav__right">
          <div className="nav__lang">
            <button className={lang === 'es' ? 'is-active' : ''} onClick={() => setLang('es')}>ES</button>
            <button className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          <a href="#contact" className="nav__cta" onClick={(e) => { e.preventDefault(); scrollTo('#contact') }}>
            {t('Book Now', 'Reservar Ahora')}
          </a>
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
            <a
              key={l.href}
              href={l.href}
              style={{ transitionDelay: menuOpen ? `${i * 0.07}s` : '0s' }}
              onClick={(e) => { e.preventDefault(); scrollTo(l.href) }}
            >
              {t(l.en, l.es)}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="nav__drawer-cta"
          onClick={(e) => { e.preventDefault(); scrollTo('#contact') }}
        >
          {t('Book Now', 'Reservar Ahora')}
        </a>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="nav__overlay" onClick={() => setMenuOpen(false)} />}
    </>
  )
}
