import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useDateRangePicker } from '../hooks/useDateRangePicker'

// Helper: simula un evento de onMouseOver con .closest() controlado
function makeMouseEvent(hoveredType) {
  return {
    target: {
      closest: (selector) => {
        if (hoveredType === 'tooSoon' && selector.includes('too-soon')) return {}
        if (hoveredType === 'tooClose' && selector.includes('too-close')) return {}
        if (hoveredType === 'day' && selector.includes('rdp-day')) return {}
        return null
      },
    },
  }
}

const checkIn = new Date(2026, 5, 18) // 18 jun
const checkOut = new Date(2026, 5, 22) // 22 jun (4 noches)

describe('useDateRangePicker', () => {

  // ─── getFooterPayload — estado por defecto ──────────────────────────────

  describe('footer default — sin check-in seleccionado', () => {
    it('muestra el mensaje por defecto en español', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({ range: {}, errorText: null, lang: 'es' })
      )
      expect(result.current.footer.isError).toBe(false)
      expect(result.current.footer.text).toMatch(/mínimo con 3 días/i)
    })

    it('muestra el mensaje por defecto en inglés', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({ range: {}, errorText: null, lang: 'en' })
      )
      expect(result.current.footer.isError).toBe(false)
      expect(result.current.footer.text).toMatch(/at least 3 days/i)
    })
  })

  // ─── getFooterPayload — check-in seleccionado, esperando check-out ──────

  describe('footer — check-in seleccionado sin check-out', () => {
    it('muestra mensaje "selecciona salida" en español', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({ range: { from: checkIn }, errorText: null, lang: 'es' })
      )
      expect(result.current.footer.isError).toBe(false)
      expect(result.current.footer.text).toMatch(/fecha de salida/i)
    })

    it('muestra mensaje "selecciona salida" en inglés', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({ range: { from: checkIn }, errorText: null, lang: 'en' })
      )
      expect(result.current.footer.isError).toBe(false)
      expect(result.current.footer.text).toMatch(/checkout date/i)
    })
  })

  // ─── getFooterPayload — rango completo válido ────────────────────────────

  describe('footer — rango válido seleccionado', () => {
    it('muestra el conteo de noches', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({ range: { from: checkIn, to: checkOut }, errorText: null, lang: 'es' })
      )
      expect(result.current.footer.isError).toBe(false)
      expect(result.current.footer.text).toMatch(/4 noches/i)
    })

    it('muestra el conteo de noches en inglés', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({ range: { from: checkIn, to: checkOut }, errorText: null, lang: 'en' })
      )
      expect(result.current.footer.isError).toBe(false)
      expect(result.current.footer.text).toMatch(/4 nights/i)
    })
  })

  // ─── getFooterPayload — errorText (click inválido previo) ───────────────

  describe('footer — errorText visible cuando no hay hover', () => {
    it('muestra errorText como error cuando hoverState es null', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({
          range: { from: checkIn },
          errorText: 'El mínimo de noches es 3',
          lang: 'es',
        })
      )
      expect(result.current.footer.isError).toBe(true)
      expect(result.current.footer.text).toBe('El mínimo de noches es 3')
    })
  })

  // ─── getFooterPayload — hover sobre tooSoon ─────────────────────────────

  describe('footer — hover sobre fecha tooSoon', () => {
    it('muestra mensaje de anticipación en español y es error', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({ range: { from: checkIn }, errorText: null, lang: 'es' })
      )
      act(() => { result.current.handleMouseOver(makeMouseEvent('tooSoon')) })
      expect(result.current.footer.isError).toBe(true)
      expect(result.current.footer.text).toMatch(/mínimo con 3 días de anticipación/i)
    })

    it('tooSoon tiene prioridad sobre errorText existente', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({
          range: { from: checkIn },
          errorText: 'El mínimo de noches es 3',
          lang: 'es',
        })
      )
      act(() => { result.current.handleMouseOver(makeMouseEvent('tooSoon')) })
      expect(result.current.footer.text).toMatch(/anticipación/i)
    })
  })

  // ─── getFooterPayload — hover sobre tooClose ────────────────────────────

  describe('footer — hover sobre fecha tooClose', () => {
    it('muestra mensaje de mínimo de noches en español y es error', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({ range: { from: checkIn }, errorText: null, lang: 'es' })
      )
      act(() => { result.current.handleMouseOver(makeMouseEvent('tooClose')) })
      expect(result.current.footer.isError).toBe(true)
      expect(result.current.footer.text).toMatch(/mínimo de noches/i)
    })

    it('tooClose tiene prioridad sobre errorText existente', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({
          range: { from: checkIn },
          errorText: 'El mínimo de noches es 3',
          lang: 'es',
        })
      )
      act(() => { result.current.handleMouseOver(makeMouseEvent('tooClose')) })
      expect(result.current.footer.isError).toBe(true)
      expect(result.current.footer.text).toMatch(/mínimo de noches/i)
    })
  })

  // ─── getFooterPayload — hover sobre fecha válida ─────────────────────────

  describe('footer — hover sobre fecha válida (hoverState=valid)', () => {
    it('suprime errorText previo y muestra mensaje positivo', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({
          range: { from: checkIn },
          errorText: 'El mínimo de noches es 3',
          lang: 'es',
        })
      )
      act(() => { result.current.handleMouseOver(makeMouseEvent('day')) })
      expect(result.current.footer.isError).toBe(false)
      expect(result.current.footer.text).toMatch(/confirmar/i)
    })

    it('NO suprime errorText si no hay range.from (sin check-in)', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({
          range: {},
          errorText: 'El mínimo de noches es 3',
          lang: 'es',
        })
      )
      act(() => { result.current.handleMouseOver(makeMouseEvent('day')) })
      // Sin check-in, hoverState=valid no aplica — cae al errorText
      expect(result.current.footer.isError).toBe(true)
      expect(result.current.footer.text).toBe('El mínimo de noches es 3')
    })
  })

  // ─── handleMouseOut resetea hoverState ───────────────────────────────────

  describe('handleMouseOut', () => {
    it('resetea hoverState a null y restaura el mensaje previo', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({
          range: { from: checkIn },
          errorText: 'El mínimo de noches es 3',
          lang: 'es',
        })
      )
      // Hover over tooClose → error de hover
      act(() => { result.current.handleMouseOver(makeMouseEvent('tooClose')) })
      expect(result.current.footer.text).toMatch(/mínimo de noches/i)

      // Mouse sale → vuelve al errorText
      act(() => { result.current.handleMouseOut() })
      expect(result.current.footer.text).toBe('El mínimo de noches es 3')
    })

    it('al salir sin errorText muestra el mensaje de seleccionar salida', () => {
      const { result } = renderHook(() =>
        useDateRangePicker({ range: { from: checkIn }, errorText: null, lang: 'es' })
      )
      act(() => { result.current.handleMouseOver(makeMouseEvent('tooSoon')) })
      act(() => { result.current.handleMouseOut() })
      expect(result.current.footer.isError).toBe(false)
      expect(result.current.footer.text).toMatch(/fecha de salida/i)
    })
  })

  // ─── Prioridad completa del payload ──────────────────────────────────────

  describe('prioridad del footer payload', () => {
    it('tooSoon > tooClose > valid > errorText > nights > from > default', () => {
      // Con rango completo + errorText + hover tooSoon → gana tooSoon
      const { result } = renderHook(() =>
        useDateRangePicker({
          range: { from: checkIn, to: checkOut },
          errorText: 'algún error',
          lang: 'es',
        })
      )
      act(() => { result.current.handleMouseOver(makeMouseEvent('tooSoon')) })
      expect(result.current.footer.text).toMatch(/anticipación/i)
    })
  })
})
