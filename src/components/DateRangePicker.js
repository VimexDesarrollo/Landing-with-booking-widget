'use client'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { es, enUS } from 'date-fns/locale'
import 'react-day-picker/style.css'

const MIN_NIGHTS = 3
const MAX_NIGHTS = 90

export default function DateRangePicker({ open, onClose, range, onSelect, lang }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open || typeof window === 'undefined') return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDisabled = (date) => {
    if (date < today) return true
    // Cuando from ya está seleccionado pero to no, restringir el rango válido
    if (range?.from && !range?.to) {
      const diff = Math.round((date - range.from) / 86400000)
      if (diff > 0 && diff < MIN_NIGHTS) return true  // menos de 3 noches
      if (diff > MAX_NIGHTS) return true               // más de 90 noches
    }
    return false
  }

  const nights = range?.from && range?.to
    ? Math.round((range.to - range.from) / 86400000)
    : null

  const tl = (en, es_) => lang === 'en' ? en : es_

  const helperText = nights != null
    ? tl(`${nights} nights selected`, `${nights} noches seleccionadas`)
    : range?.from
    ? tl(
        `Now select your checkout date (min. ${MIN_NIGHTS} nights)`,
        `Ahora selecciona tu fecha de salida (mín. ${MIN_NIGHTS} noches)`
      )
    : tl(
        `Min. ${MIN_NIGHTS} nights · Max. ${MAX_NIGHTS} nights`,
        `Mín. ${MIN_NIGHTS} noches · Máx. ${MAX_NIGHTS} noches`
      )

  return createPortal(
    <>
      <div className="cal-overlay" onClick={(e) => { e.stopPropagation(); onClose() }} />
      <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cal-modal__close" onClick={(e) => { e.stopPropagation(); onClose() }} aria-label="Cerrar">✕</button>
        <DayPicker
          mode="range"
          selected={range}
          onSelect={onSelect}
          disabled={isDisabled}
          locale={lang === 'es' ? es : enUS}
          numberOfMonths={window.innerWidth < 640 ? 1 : 2}
          showOutsideDays
        />
        <p className="cal-modal__footer">{helperText}</p>
      </div>
    </>,
    document.body
  )
}
