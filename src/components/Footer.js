'use client'
import { useEffect } from 'react'
import { useLang } from '@/context/LangContext'

function splitWord(el) {
  if (!el || el.dataset.split) return
  const text = el.textContent
  el.textContent = ''
  text.split(' ').forEach((w, i, arr) => {
    const word = document.createElement('span')
    word.className = 'word'
    const inner = document.createElement('span')
    inner.textContent = w
    word.appendChild(inner)
    el.appendChild(word)
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '))
  })
  el.dataset.split = '1'
}

export default function Footer() {
  const { t } = useLang()

  useEffect(() => {
    document.querySelectorAll('.footer__big').forEach((el) => {
      delete el.dataset.split
      splitWord(el)
    })
  })

  return (
    <footer className="footer" data-reveal>
      <div className="footer__big">
        <span>{t('Welcome home.', 'Bienvenido a casa.')}</span>
      </div>

      <div className="footer__grid">
        <div>
          <div className="footer__brand">
            <img src="/assets/vimex-logo-white.png" alt="Vimex" style={{ width: '140px', height: 'auto', display: 'block', marginBottom: '20px' }} />
          </div>
          <p className="footer__tagline">
            {t(
              'Family-owned vacation rentals & property management in Playa del Carmen, Tulum & Akumal since 2004.',
              'Rentas vacacionales y administración de propiedades familiares en Playa del Carmen, Tulum y Akumal desde 2004.'
            )}
          </p>
        </div>
        <div className="footer__col">
          <h4>{t('Navigate', 'Navega')}</h4>
          <a href="#feel">{t('About Us', 'Quiénes Somos')}</a>
          <a href="#services">{t('Property Management', 'Gestión de Propiedades')}</a>
          <a href="#dest">{t('Destinations', 'Destinos')}</a>
          <a href="#contact">{t('Contact', 'Contacto')}</a>
        </div>
        <div className="footer__col">
          <h4>{t('Connect', 'Conecta')}</h4>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">Pinterest</a>
          <a href="https://wa.me/529841311019">WhatsApp</a>
        </div>
        <div className="footer__col">
          <h4>{t('Reach Us', 'Contacto')}</h4>
          <a href="mailto:info@vimexmx.com">info@vimexmx.com</a>
          <a href="tel:+529841311019">+52 (984) 131 1019</a>
          <p>Playa del Carmen, MX</p>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026 Vimex Vacation Rentals &amp; Property Management</span>
        <div className="footer__legal">
          <a href="#">{t('Terms of Use', 'Términos de Uso')}</a>
          <a href="#">{t('Privacy Policy', 'Política de Privacidad')}</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  )
}
