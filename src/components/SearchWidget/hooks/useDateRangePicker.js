'use client'
import { useState } from 'react'
import { MIN_NIGHTS } from '../constants'

function getFooterPayload({ nights, range, errorText, hoverState, lang }) {
  const tl = (en, es_) => (lang === 'en' ? en : es_)

  if (hoverState === 'tooSoon') return {
    text: tl(
      'Arrival must be at least 3 days in advance',
      'Tu llegada debe ser mínimo con 3 días de anticipación'
    ),
    isError: true,
  }

  if (hoverState === 'tooClose') return {
    text: tl(
      `Minimum stay is ${MIN_NIGHTS} nights`,
      `El mínimo de noches es ${MIN_NIGHTS}`
    ),
    isError: true,
  }

  if (hoverState === 'valid' && range?.from) return {
    text: tl(
      '¡Perfecto! Click to confirm your checkout date',
      '¡Perfecto! Haz clic para confirmar tu fecha de salida'
    ),
    isError: false,
  }

  if (errorText) return { text: errorText, isError: true }

  if (nights != null) return {
    text: tl(`${nights} nights selected`, `${nights} noches seleccionadas`),
    isError: false,
  }

  if (range?.from) return {
    text: tl(
      `Now select your checkout date (min. ${MIN_NIGHTS} nights)`,
      `Ahora selecciona tu fecha de salida (mín. ${MIN_NIGHTS} noches)`
    ),
    isError: false,
  }

  return {
    text: tl(
      `Arrival must be at least 3 days in advance · Min. ${MIN_NIGHTS} nights`,
      `Tu llegada debe ser mínimo con 3 días de anticipación · Mín. ${MIN_NIGHTS} noches`
    ),
    isError: false,
  }
}

export function useDateRangePicker({ range, errorText, lang }) {
  const [hoverState, setHoverState] = useState(null)

  const nights =
    range?.from && range?.to
      ? Math.round((range.to - range.from) / 86400000)
      : null

  const footer = getFooterPayload({ nights, range, errorText, hoverState, lang })

  const handleMouseOver = (e) => {
    if (e.target.closest('[class*="too-soon"]')) {
      setHoverState('tooSoon')
    } else if (e.target.closest('[class*="too-close"]')) {
      setHoverState('tooClose')
    } else if (e.target.closest('.rdp-day_button, [class*="rdp-day"]')) {
      setHoverState('valid')
    } else {
      setHoverState(null)
    }
  }

  const handleMouseOut = () => setHoverState(null)

  return { footer, handleMouseOver, handleMouseOut }
}
