'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { useLang } from '@/context/LangContext'
import DateRangePicker from '@/components/DateRangePicker'

const BOOKING_ENGINE_URL = process.env.NEXT_PUBLIC_BOOKING_ENGINE_URL || 'http://localhost:3002'

const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-7 8-12a8 8 0 1 0-16 0c0 5 8 12 8 12z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconCal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)
const IconGuest = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
)

const fmtDate = (d) => d ? format(d, 'dd MMM') : '—'

const DESTINATIONS = ['Playa del Carmen', 'Tulum', 'Akumal']

export default function SearchWidget() {
  const { t, lang } = useLang()

  const [dest, setDest]         = useState('')
  const [checkIn, setCheckIn]   = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests]     = useState(2)

  const [dateOpen, setDateOpen]   = useState(false)
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })

  const search = (e) => {
    e.preventDefault()
    if (!checkIn || !checkOut) return

    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    })
    if (dest) params.set('city', dest)

    window.location.href = `${BOOKING_ENGINE_URL}/es/properties?${params}`
  }

  return (
    <form className="search" onSubmit={search}>

      {/* Destino */}
      <div className="search__field">
        <span className="search__label">{t('Destination', 'Destino')}</span>
        <span className="search__value">
          <IconPin />
          <select
            className="search__select"
            value={dest}
            onChange={e => setDest(e.target.value)}
          >
            <option value="">{t('All destinations', 'Todos los destinos')}</option>
            {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </span>
      </div>

      {/* Fechas */}
      <div
        className="search__field search__field--dates"
        onClick={() => setDateOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <span className="search__label">{t('Dates', 'Fechas')}</span>
        <span className="search__value">
          <IconCal />
          <span>{fmtDate(dateRange.from)} → {fmtDate(dateRange.to)}</span>
        </span>
        <DateRangePicker
          open={dateOpen}
          onClose={() => setDateOpen(false)}
          range={dateRange}
          onSelect={(r) => {
            const next = r || { from: undefined, to: undefined }
            setDateRange(next)
            if (next.from && next.to) {
              const nights = Math.round((next.to - next.from) / 86400000)
              if (nights >= 3) {
                setCheckIn(format(next.from, 'yyyy-MM-dd'))
                setCheckOut(format(next.to, 'yyyy-MM-dd'))
                setTimeout(() => setDateOpen(false), 280)
              }
            }
          }}
          lang={lang}
        />
      </div>

      {/* Huéspedes */}
      <div className="search__field">
        <span className="search__label">{t('Guests', 'Huéspedes')}</span>
        <span className="search__value">
          <IconGuest />
          <div className="search__stepper">
            <button
              type="button"
              className="search__stepper-btn"
              onClick={() => setGuests(g => Math.max(1, g - 1))}
              aria-label="Menos"
            >−</button>
            <span>{guests} {t('guests', guests === 1 ? 'huésped' : 'huéspedes')}</span>
            <button
              type="button"
              className="search__stepper-btn"
              onClick={() => setGuests(g => Math.min(20, g + 1))}
              aria-label="Más"
            >+</button>
          </div>
        </span>
      </div>

      {/* Botón */}
      <button type="submit" className="search__btn" data-magnetic>
        <span>{t('Search Availability', 'Buscar Disponibilidad')}</span>
        <IconSearch />
      </button>

    </form>
  )
}
