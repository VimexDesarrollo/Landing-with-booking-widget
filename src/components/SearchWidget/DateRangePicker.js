'use client'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { es, enUS } from 'date-fns/locale'
import 'react-day-picker/style.css'
import { useDateRangePicker } from './hooks/useDateRangePicker'
import { makeTooSoonMatcher, makeTooCloseMatcher, makeIsDisabled } from './utils/calendarMatchers'

export default function DateRangePicker({ open, onClose, range, errorText, onSelect, lang }) {
  const { footer, handleMouseOver, handleMouseOut } = useDateRangePicker({ range, errorText, lang })

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open || typeof window === 'undefined') return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minCheckIn = new Date(today)
  minCheckIn.setDate(today.getDate() + 3)

  const tooSoonMatcher = makeTooSoonMatcher(today, minCheckIn)
  const tooCloseMatcher = makeTooCloseMatcher(range?.from && !range?.to ? range.from : null)
  const isDisabled = makeIsDisabled(minCheckIn, range?.from && !range?.to ? range.from : null)

  return createPortal(
    <>
      <div className="cal-overlay" onClick={(e) => { e.stopPropagation(); onClose() }} />
      <div
        className="cal-modal"
        onClick={(e) => e.stopPropagation()}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <button
          className="cal-modal__close"
          onClick={(e) => { e.stopPropagation(); onClose() }}
          aria-label="Cerrar"
        >
          ✕
        </button>
        <DayPicker
          mode="range"
          selected={range}
          onSelect={onSelect}
          disabled={isDisabled}
          modifiers={{ tooSoon: tooSoonMatcher, tooClose: tooCloseMatcher }}
          modifiersClassNames={{ tooSoon: 'rdp-day--too-soon', tooClose: 'rdp-day--too-close' }}
          locale={lang === 'es' ? es : enUS}
          numberOfMonths={window.innerWidth < 640 ? 1 : 2}
          showOutsideDays
        />
        <p className={`cal-modal__footer${footer.isError ? ' cal-modal__footer--error' : ''}`}>
          {footer.text}
        </p>
      </div>
    </>,
    document.body
  )
}
