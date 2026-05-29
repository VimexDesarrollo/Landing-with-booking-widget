'use client'
import { useState } from 'react'
import { useLang } from '@/context/LangContext'

export default function Contact() {
  const { t } = useLang()
  const [mode, setMode] = useState('guest')
  const [form, setForm] = useState({ name: '', email: '', phone: '', checkin: '', checkout: '', guests: '2', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Hola Vimex! Soy ${form.name}.\nEmail: ${form.email}\nTeléfono: ${form.phone}\n${mode === 'guest' ? `Llegada: ${form.checkin}\nSalida: ${form.checkout}\nHuéspedes: ${form.guests}` : ''}\n${form.message}`
    )
    window.open(`https://wa.me/529841311019?text=${msg}`, '_blank')
  }

  return (
    <section id="contact" className="contact" data-reveal>
      <div className="contact__grid">
        <div className="contact__left">
          <div className="section__eyebrow" style={{ color: 'var(--teal)' }}>{t('Let\'s talk', 'Conversemos')}</div>
          <h2 className="section__title reveal-up">
            <span>{t('Contact', 'Escríbenos')}</span>
            <em>{t('us.', 'hoy.')}</em>
          </h2>
          <p className="contact__sub reveal-up delay-1">
            {t(
              'Reach out and our bilingual team will get back to you promptly — usually within an hour. WhatsApp is our fastest channel.',
              'Escríbenos y nuestro equipo bilingüe te responderá a la brevedad — normalmente en una hora. WhatsApp es nuestro canal más rápido.'
            )}
          </p>

          <div className="contact__details">
            <div className="contact__detail reveal-up delay-2">
              <span className="contact__detail-label">{t('Address', 'Dirección')}</span>
              <span className="contact__detail-value">
                80 Av. Norte entre Calle 30 Norte y 30 Bis Norte<br/>
                MZ 11, Ejidal 77712, Solidaridad<br/>
                Playa del Carmen, Quintana Roo
              </span>
            </div>
            <div className="contact__detail reveal-up delay-2">
              <span className="contact__detail-label">{t('Phones', 'Teléfonos')}</span>
              <span className="contact__detail-value">
                <a href="tel:+529841311019">+52 (984) 131 1019</a>
                <a href="tel:+529841857696">+52 (984) 185 7696</a>
                <a href="tel:+15109903091">+1 (510) 990 3091</a>
              </span>
            </div>
            <div className="contact__detail reveal-up delay-3">
              <span className="contact__detail-label">Email</span>
              <span className="contact__detail-value">
                <a href="mailto:info@vimexmx.com">info@vimexmx.com</a>
              </span>
            </div>
          </div>
        </div>

        <form className="form reveal-up delay-2" onSubmit={handleSubmit}>
          <div className={`form__toggle ${mode === 'guest' ? 'is-guest' : 'is-owner'}`}>
            <button type="button" onClick={() => setMode('guest')}>{t('Guest', 'Huésped')}</button>
            <button type="button" onClick={() => setMode('owner')}>{t('Property Owner', 'Propietario')}</button>
          </div>

          <div className="form__row">
            <div className="form__field form__field--full">
              <label>{t('Full Name *', 'Nombre completo *')}</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
          <div className="form__row">
            <div className="form__field">
              <label>{t('Email *', 'Correo electrónico *')}</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form__field">
              <label>{t('Phone', 'Teléfono')}</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          {mode === 'guest' && (
            <>
              <div className="form__row">
                <div className="form__field">
                  <label>{t('Check-in', 'Llegada')}</label>
                  <input type="date" value={form.checkin} onChange={(e) => setForm({ ...form, checkin: e.target.value })} />
                </div>
                <div className="form__field">
                  <label>{t('Check-out', 'Salida')}</label>
                  <input type="date" value={form.checkout} onChange={(e) => setForm({ ...form, checkout: e.target.value })} />
                </div>
              </div>
              <div className="form__row">
                <div className="form__field form__field--full">
                  <label>{t('Guests', 'Huéspedes')}</label>
                  <input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} />
                </div>
              </div>
            </>
          )}

          <div className="form__row">
            <div className="form__field form__field--full">
              <label>{t('Message', 'Mensaje')}</label>
              <textarea rows="3" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="form__submit" data-magnetic>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-1-.5-1.9-1-2.6-1.7-.7-.6-1.3-1.4-1.9-2.3-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.2-.5s.1-.4 0-.5c-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3z M20 4A11.5 11.5 0 0 0 4 20l-1.5 4 4.1-1.4A12 12 0 0 0 20 4z"/>
            </svg>
            <span>{t('Send via WhatsApp', 'Enviar por WhatsApp')}</span>
          </button>
        </form>
      </div>
    </section>
  )
}
