import { useState } from 'react'
import { format } from 'date-fns'
import { BOOKING_ENGINE_URL, INITIAL_GUESTS, MIN_NIGHTS } from '../constants'

function parseDateKey(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getDefaultDates() {
  const today = new Date()
  const checkInDate = new Date(today)
  checkInDate.setDate(today.getDate() + 3)

  const checkOutDate = new Date(checkInDate)
  checkOutDate.setDate(checkInDate.getDate() + 2)

  return {
    checkIn: format(checkInDate, 'yyyy-MM-dd'),
    checkOut: format(checkOutDate, 'yyyy-MM-dd'),
    from: checkInDate,
    to: checkOutDate,
  }
}

export function useSearchWidgetLogic() {
  const defaultDates = getDefaultDates()

  const [dest, setDest] = useState('')
  const [checkIn, setCheckIn] = useState(defaultDates.checkIn)
  const [checkOut, setCheckOut] = useState(defaultDates.checkOut)
  const [guests, setGuests] = useState(INITIAL_GUESTS)
  const [dateOpen, setDateOpen] = useState(false)
  const [dateRange, setDateRange] = useState({ from: defaultDates.from, to: defaultDates.to })
  const [dateError, setDateError] = useState(null)

  const openCalendar = () => {
    if (dateOpen) return
    setDateRange({ from: undefined, to: undefined })
    setDateOpen(true)
  }

  const closeCalendar = () => {
    if (checkIn && checkOut) {
      setDateRange({ from: parseDateKey(checkIn), to: parseDateKey(checkOut) })
    }
    setDateError(null)
    setDateOpen(false)
  }

  const handleDateSelect = (range) => {
    const next = range || { from: undefined, to: undefined }

    if (next.from && next.to) {
      const nights = Math.round((next.to - next.from) / 86400000)
      if (nights >= MIN_NIGHTS) {
        setDateRange(next)
        setDateError(null)
        setCheckIn(format(next.from, 'yyyy-MM-dd'))
        setCheckOut(format(next.to, 'yyyy-MM-dd'))
        setTimeout(() => setDateOpen(false), 280)
      } else {
        // Mantiene el check-in, borra el check-out para que DayPicker
        // siga en modo "esperando check-out" y el usuario pueda re-seleccionar
        setDateRange({ from: next.from, to: undefined })
        setDateError(`El mínimo de noches es ${MIN_NIGHTS}`)
      }
    } else {
      // Solo check-in seleccionado — limpiar error
      setDateRange(next)
      setDateError(null)
    }
  }

  const generateSearchUrl = () => {
    if (!checkIn || !checkOut) return null

    const params = new URLSearchParams({
      checkIn,
      checkOut,
      minOccupancy: String(guests),
      adults: String(guests),
    })
    if (dest) params.set('city', dest)

    return `${BOOKING_ENGINE_URL}/es/properties?${params}`
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const url = generateSearchUrl()
    if (url) {
      window.location.href = url
    }
  }

  return {
    dest,
    setDest,
    checkIn,
    checkOut,
    guests,
    setGuests,
    dateOpen,
    openCalendar,
    closeCalendar,
    dateRange,
    dateError,
    handleDateSelect,
    handleSearch,
    generateSearchUrl,
    isValid: Boolean(checkIn && checkOut),
  }
}
