import { MIN_NIGHTS } from '../constants'

const MAX_NIGHTS = 90

export function makeTooSoonMatcher(today, minCheckIn) {
  return (date) => date >= today && date < minCheckIn
}

export function makeTooCloseMatcher(checkInDate) {
  if (!checkInDate) return () => false
  return (date) => {
    const diff = Math.round((date - checkInDate) / 86400000)
    return diff > 0 && diff < MIN_NIGHTS
  }
}

export function makeIsDisabled(minCheckIn, checkInDate) {
  return (date) => {
    if (date < minCheckIn) return true
    if (checkInDate) {
      const diff = Math.round((date - checkInDate) / 86400000)
      if (diff > MAX_NIGHTS) return true
    }
    return false
  }
}
