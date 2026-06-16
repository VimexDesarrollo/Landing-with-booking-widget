import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useSearchWidgetLogic } from '../hooks/useSearchWidgetLogic'

describe('Calendar Reset Behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('openCalendar resets dateRange', () => {
    it('clears dateRange when opening calendar', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      // Verify initial state has dates
      expect(result.current.dateRange.from).toBeDefined()
      expect(result.current.dateRange.to).toBeDefined()

      // Open calendar
      act(() => {
        result.current.openCalendar()
      })

      // dateRange should be cleared
      expect(result.current.dateRange.from).toBeUndefined()
      expect(result.current.dateRange.to).toBeUndefined()
    })

    it('preserves checkIn and checkOut after opening calendar', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      const originalCheckIn = result.current.checkIn
      const originalCheckOut = result.current.checkOut

      act(() => {
        result.current.openCalendar()
      })

      // The field values should remain unchanged
      expect(result.current.checkIn).toBe(originalCheckIn)
      expect(result.current.checkOut).toBe(originalCheckOut)
    })

    it('opens the calendar modal', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      expect(result.current.dateOpen).toBe(false)

      act(() => {
        result.current.openCalendar()
      })

      expect(result.current.dateOpen).toBe(true)
    })
  })

  describe('Complete workflow: select new dates after opening', () => {
    it('allows selecting new dates from scratch', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      const originalCheckIn = result.current.checkIn
      const originalCheckOut = result.current.checkOut

      // User opens calendar
      act(() => {
        result.current.openCalendar()
      })

      expect(result.current.dateOpen).toBe(true)
      expect(result.current.dateRange.from).toBeUndefined()

      // User selects new check-in (June 25)
      const newCheckIn = new Date(2026, 5, 25)
      act(() => {
        result.current.handleDateSelect({ from: newCheckIn, to: undefined })
      })

      expect(result.current.dateRange.from).toEqual(newCheckIn)
      expect(result.current.dateRange.to).toBeUndefined()
      // checkIn/checkOut should not update until checkout is selected
      expect(result.current.checkIn).toBe(originalCheckIn)

      // User selects new check-out (June 28 = 3 nights)
      const newCheckOut = new Date(2026, 5, 28)
      act(() => {
        result.current.handleDateSelect({ from: newCheckIn, to: newCheckOut })
      })

      expect(result.current.checkIn).toBe('2026-06-25')
      expect(result.current.checkOut).toBe('2026-06-28')
      expect(result.current.checkIn).not.toBe(originalCheckIn)
    })

    it('closes calendar with delay after valid selection', () => {
      vi.useFakeTimers()
      const { result } = renderHook(() => useSearchWidgetLogic())

      act(() => {
        result.current.openCalendar()
      })
      expect(result.current.dateOpen).toBe(true)

      const from = new Date(2026, 5, 25)
      const to = new Date(2026, 5, 28)

      act(() => {
        result.current.handleDateSelect({ from, to })
      })

      // Still open immediately after selection
      expect(result.current.dateOpen).toBe(true)

      // Advance 280ms
      act(() => {
        vi.advanceTimersByTime(280)
      })

      // Now should be closed
      expect(result.current.dateOpen).toBe(false)

      vi.useRealTimers()
    })

    it('rejects invalid selections (< 3 nights) and keeps calendar open', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      const originalCheckIn = result.current.checkIn

      act(() => {
        result.current.openCalendar()
      })

      // Try to select only 2 nights
      const from = new Date(2026, 5, 25)
      const to = new Date(2026, 5, 27) // 2 noches

      act(() => {
        result.current.handleDateSelect({ from, to })
      })

      // check-in se mantiene, check-out se descarta para que el usuario pueda re-seleccionar
      expect(result.current.dateRange.from).toEqual(from)
      expect(result.current.dateRange.to).toBeUndefined()

      // But checkIn/checkOut don't update
      expect(result.current.checkIn).toBe(originalCheckIn)

      // And calendar stays open
      expect(result.current.dateOpen).toBe(true)
    })
  })

  describe('Multiple open/close cycles', () => {
    it('handles multiple open/close cycles correctly', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      // First cycle
      act(() => {
        result.current.openCalendar()
      })
      expect(result.current.dateRange.from).toBeUndefined()

      act(() => {
        result.current.handleDateSelect({
          from: new Date(2026, 5, 25),
          to: new Date(2026, 5, 28),
        })
      })

      act(() => {
        vi.advanceTimersByTime(280)
      })
      expect(result.current.dateOpen).toBe(false)
      expect(result.current.checkIn).toBe('2026-06-25')

      // Second cycle - open again
      act(() => {
        result.current.openCalendar()
      })
      expect(result.current.dateRange.from).toBeUndefined()
      expect(result.current.checkIn).toBe('2026-06-25') // Field values preserved
      expect(result.current.dateOpen).toBe(true)

      // Select different dates
      act(() => {
        result.current.handleDateSelect({
          from: new Date(2026, 6, 5),
          to: new Date(2026, 6, 10),
        })
      })

      act(() => {
        vi.advanceTimersByTime(280)
      })

      expect(result.current.checkIn).toBe('2026-07-05')
      expect(result.current.checkOut).toBe('2026-07-10')
    })
  })

  describe('openCalendar guard against event bubbling', () => {
    it('does NOT reset dateRange when calendar is already open', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      act(() => { result.current.openCalendar() })
      expect(result.current.dateOpen).toBe(true)

      // User clicks first date
      act(() => {
        result.current.handleDateSelect({ from: new Date(2026, 5, 25), to: undefined })
      })
      expect(result.current.dateRange.from).toBeDefined()

      // Event bubbles and openCalendar fires again — should be a no-op
      act(() => { result.current.openCalendar() })

      // dateRange must NOT be reset
      expect(result.current.dateRange.from).toBeDefined()
      expect(result.current.dateOpen).toBe(true)
    })

    it('allows full selection flow without needing to click twice', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      // Open calendar
      act(() => { result.current.openCalendar() })

      // Click check-in
      const checkIn = new Date(2026, 5, 25)
      act(() => { result.current.handleDateSelect({ from: checkIn, to: undefined }) })

      // Simulate event bubbling (openCalendar called again while open)
      act(() => { result.current.openCalendar() })

      // dateRange still has check-in
      expect(result.current.dateRange.from).toEqual(checkIn)

      // Click check-out (3 nights later)
      const checkOut = new Date(2026, 5, 28)
      act(() => { result.current.handleDateSelect({ from: checkIn, to: checkOut }) })

      // Should update checkIn/checkOut
      expect(result.current.checkIn).toBe('2026-06-25')
      expect(result.current.checkOut).toBe('2026-06-28')
    })
  })

  describe('closeCalendar restores dateRange', () => {
    it('restores dateRange from committed checkIn/checkOut when closing without selection', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      // Open calendar (clears dateRange)
      act(() => { result.current.openCalendar() })
      expect(result.current.dateRange.from).toBeUndefined()

      // Close without selecting anything
      act(() => { result.current.closeCalendar() })

      // dateRange should be restored from checkIn/checkOut
      expect(result.current.dateRange.from).toBeInstanceOf(Date)
      expect(result.current.dateRange.to).toBeInstanceOf(Date)
      expect(result.current.dateRange.from.getDate()).toBe(18)
      expect(result.current.dateRange.to.getDate()).toBe(20)
    })

    it('restores updated dates after a successful selection + close cycle', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      // Select new dates (Jun 25 → 28)
      act(() => { result.current.openCalendar() })
      act(() => {
        result.current.handleDateSelect({
          from: new Date(2026, 5, 25),
          to: new Date(2026, 5, 28),
        })
      })
      act(() => { vi.advanceTimersByTime(280) })
      expect(result.current.checkIn).toBe('2026-06-25')

      // Open again and close without selecting
      act(() => { result.current.openCalendar() })
      act(() => { result.current.closeCalendar() })

      // Should restore Jun 25 → 28, not the original defaults
      expect(result.current.dateRange.from.getDate()).toBe(25)
      expect(result.current.dateRange.to.getDate()).toBe(28)
    })
  })

  describe('Calendar state independence', () => {
    it('dateRange and checkIn/checkOut can be different', () => {
      const { result } = renderHook(() => useSearchWidgetLogic())

      // Open calendar
      act(() => {
        result.current.openCalendar()
      })

      // User exploring dates in calendar
      act(() => {
        result.current.handleDateSelect({
          from: new Date(2026, 5, 25),
          to: undefined,
        })
      })

      // dateRange shows user selection
      expect(result.current.dateRange.from.getDate()).toBe(25)

      // But checkIn/checkOut still show old dates (not committed yet)
      expect(result.current.checkIn).toBe('2026-06-18')
      expect(result.current.checkOut).toBe('2026-06-20')
    })
  })
})
