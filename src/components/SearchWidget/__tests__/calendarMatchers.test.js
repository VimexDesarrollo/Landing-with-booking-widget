import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  makeTooSoonMatcher,
  makeTooCloseMatcher,
  makeIsDisabled,
} from '../utils/calendarMatchers'

// MIN_NIGHTS = 3, MAX_NIGHTS = 90 (desde constants/calendarMatchers)

describe('calendarMatchers', () => {
  let today, minCheckIn

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15)) // 15 jun 2026

    today = new Date(2026, 5, 15)
    today.setHours(0, 0, 0, 0)
    minCheckIn = new Date(2026, 5, 18) // today + 3
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ─── makeTooSoonMatcher ───────────────────────────────────────────────────

  describe('makeTooSoonMatcher', () => {
    it('returns true for today (should not be selectable)', () => {
      const matcher = makeTooSoonMatcher(today, minCheckIn)
      expect(matcher(new Date(2026, 5, 15))).toBe(true)
    })

    it('returns true for today+1', () => {
      const matcher = makeTooSoonMatcher(today, minCheckIn)
      expect(matcher(new Date(2026, 5, 16))).toBe(true)
    })

    it('returns true for today+2', () => {
      const matcher = makeTooSoonMatcher(today, minCheckIn)
      expect(matcher(new Date(2026, 5, 17))).toBe(true)
    })

    it('returns false for minCheckIn (today+3 — primer día válido)', () => {
      const matcher = makeTooSoonMatcher(today, minCheckIn)
      expect(matcher(new Date(2026, 5, 18))).toBe(false)
    })

    it('returns false for dates after minCheckIn', () => {
      const matcher = makeTooSoonMatcher(today, minCheckIn)
      expect(matcher(new Date(2026, 5, 25))).toBe(false)
    })

    it('returns false for past dates (anteriores a today)', () => {
      const matcher = makeTooSoonMatcher(today, minCheckIn)
      expect(matcher(new Date(2026, 5, 10))).toBe(false)
    })
  })

  // ─── makeTooCloseMatcher ─────────────────────────────────────────────────

  describe('makeTooCloseMatcher', () => {
    it('returns () => false when checkInDate is null (sin check-in seleccionado)', () => {
      const matcher = makeTooCloseMatcher(null)
      expect(matcher(new Date(2026, 5, 20))).toBe(false)
    })

    it('returns false for the check-in date itself (diff = 0)', () => {
      const checkIn = new Date(2026, 5, 18)
      const matcher = makeTooCloseMatcher(checkIn)
      expect(matcher(new Date(2026, 5, 18))).toBe(false)
    })

    it('returns true for check-in+1 (1 noche < MIN_NIGHTS=3)', () => {
      const checkIn = new Date(2026, 5, 18)
      const matcher = makeTooCloseMatcher(checkIn)
      expect(matcher(new Date(2026, 5, 19))).toBe(true)
    })

    it('returns true for check-in+2 (2 noches < MIN_NIGHTS=3)', () => {
      const checkIn = new Date(2026, 5, 18)
      const matcher = makeTooCloseMatcher(checkIn)
      expect(matcher(new Date(2026, 5, 20))).toBe(true)
    })

    it('returns false for check-in+3 (exactamente MIN_NIGHTS)', () => {
      const checkIn = new Date(2026, 5, 18)
      const matcher = makeTooCloseMatcher(checkIn)
      expect(matcher(new Date(2026, 5, 21))).toBe(false)
    })

    it('returns false for check-in+7', () => {
      const checkIn = new Date(2026, 5, 18)
      const matcher = makeTooCloseMatcher(checkIn)
      expect(matcher(new Date(2026, 5, 25))).toBe(false)
    })

    it('returns false for dates before check-in (diff negativo)', () => {
      const checkIn = new Date(2026, 5, 18)
      const matcher = makeTooCloseMatcher(checkIn)
      expect(matcher(new Date(2026, 5, 15))).toBe(false)
    })
  })

  // ─── makeIsDisabled ───────────────────────────────────────────────────────

  describe('makeIsDisabled', () => {
    it('disables dates before minCheckIn', () => {
      const isDisabled = makeIsDisabled(minCheckIn, null)
      expect(isDisabled(new Date(2026, 5, 15))).toBe(true)
      expect(isDisabled(new Date(2026, 5, 16))).toBe(true)
      expect(isDisabled(new Date(2026, 5, 17))).toBe(true)
    })

    it('does NOT disable minCheckIn (primer día habilitado)', () => {
      const isDisabled = makeIsDisabled(minCheckIn, null)
      expect(isDisabled(new Date(2026, 5, 18))).toBe(false)
    })

    it('does NOT disable normal selectable dates', () => {
      const isDisabled = makeIsDisabled(minCheckIn, null)
      expect(isDisabled(new Date(2026, 5, 25))).toBe(false)
    })

    it('disables dates more than MAX_NIGHTS (90) after check-in', () => {
      const checkIn = new Date(2026, 5, 18)
      const isDisabled = makeIsDisabled(minCheckIn, checkIn)
      const tooFar = new Date(checkIn)
      tooFar.setDate(checkIn.getDate() + 91)
      expect(isDisabled(tooFar)).toBe(true)
    })

    it('does NOT disable check-in+90 (exactamente MAX_NIGHTS)', () => {
      const checkIn = new Date(2026, 5, 18)
      const isDisabled = makeIsDisabled(minCheckIn, checkIn)
      const maxDate = new Date(checkIn)
      maxDate.setDate(checkIn.getDate() + 90)
      expect(isDisabled(maxDate)).toBe(false)
    })

    it('does NOT apply MAX_NIGHTS rule when checkInDate is null', () => {
      const isDisabled = makeIsDisabled(minCheckIn, null)
      const farDate = new Date(2026, 5, 18)
      farDate.setDate(farDate.getDate() + 200)
      expect(isDisabled(farDate)).toBe(false)
    })
  })
})
