import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useOfferCarousel } from '../useOfferCarousel'
import { OFFER_ROTATE_MS } from '../../constants'

describe('useOfferCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('empieza en el índice 0', () => {
    const { result } = renderHook(() => useOfferCarousel(3))
    expect(result.current.index).toBe(0)
  })

  it('next avanza y hace wrap-around al llegar al final', () => {
    const { result } = renderHook(() => useOfferCarousel(3))
    act(() => result.current.next())
    expect(result.current.index).toBe(1)
    act(() => result.current.next())
    act(() => result.current.next())
    expect(result.current.index).toBe(0)
  })

  it('prev desde 0 va a la última oferta', () => {
    const { result } = renderHook(() => useOfferCarousel(3))
    act(() => result.current.prev())
    expect(result.current.index).toBe(2)
  })

  it('auto-rota tras OFFER_ROTATE_MS', () => {
    const { result } = renderHook(() => useOfferCarousel(3))
    act(() => vi.advanceTimersByTime(OFFER_ROTATE_MS))
    expect(result.current.index).toBe(1)
    act(() => vi.advanceTimersByTime(OFFER_ROTATE_MS))
    expect(result.current.index).toBe(2)
  })

  it('no auto-rota cuando hay menos de 2 ofertas', () => {
    const { result } = renderHook(() => useOfferCarousel(1))
    act(() => vi.advanceTimersByTime(OFFER_ROTATE_MS * 3))
    expect(result.current.index).toBe(0)
  })

  it('pausa la auto-rotación con la pestaña oculta', () => {
    const spy = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    const { result } = renderHook(() => useOfferCarousel(3))
    act(() => vi.advanceTimersByTime(OFFER_ROTATE_MS * 2))
    expect(result.current.index).toBe(0)
    spy.mockRestore()
  })

  describe('swipeHandlers', () => {
    const touch = (x, y) => ({ clientX: x, clientY: y })

    it('swipe a la izquierda (>50px) avanza a la siguiente oferta', () => {
      const { result } = renderHook(() => useOfferCarousel(3))
      act(() => {
        result.current.swipeHandlers.onTouchStart({ touches: [touch(200, 100)] })
        result.current.swipeHandlers.onTouchEnd({ changedTouches: [touch(120, 105)] })
      })
      expect(result.current.index).toBe(1)
    })

    it('swipe a la derecha (>50px) retrocede', () => {
      const { result } = renderHook(() => useOfferCarousel(3))
      act(() => {
        result.current.swipeHandlers.onTouchStart({ touches: [touch(100, 100)] })
        result.current.swipeHandlers.onTouchEnd({ changedTouches: [touch(200, 105)] })
      })
      expect(result.current.index).toBe(2)
    })

    it('ignora gestos cortos (<50px)', () => {
      const { result } = renderHook(() => useOfferCarousel(3))
      act(() => {
        result.current.swipeHandlers.onTouchStart({ touches: [touch(200, 100)] })
        result.current.swipeHandlers.onTouchEnd({ changedTouches: [touch(170, 100)] })
      })
      expect(result.current.index).toBe(0)
    })

    it('ignora gestos más verticales que horizontales (scroll)', () => {
      const { result } = renderHook(() => useOfferCarousel(3))
      act(() => {
        result.current.swipeHandlers.onTouchStart({ touches: [touch(200, 100)] })
        result.current.swipeHandlers.onTouchEnd({ changedTouches: [touch(140, 300)] })
      })
      expect(result.current.index).toBe(0)
    })
  })
})
