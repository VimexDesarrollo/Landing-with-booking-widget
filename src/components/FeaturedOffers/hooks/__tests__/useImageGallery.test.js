import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useImageGallery } from '../useImageGallery'
import { GALLERY_ROTATE_MS } from '../../constants'

describe('useImageGallery', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('empieza en la foto 0', () => {
    const { result } = renderHook(() => useImageGallery(5, 'a'))
    expect(result.current.index).toBe(0)
  })

  it('next / prev hacen wrap-around', () => {
    const { result } = renderHook(() => useImageGallery(3, 'a'))
    act(() => result.current.next())
    act(() => result.current.next())
    act(() => result.current.next())
    expect(result.current.index).toBe(0)
    act(() => result.current.prev())
    expect(result.current.index).toBe(2)
  })

  it('auto-avanza tras GALLERY_ROTATE_MS', () => {
    const { result } = renderHook(() => useImageGallery(4, 'a'))
    act(() => vi.advanceTimersByTime(GALLERY_ROTATE_MS))
    expect(result.current.index).toBe(1)
  })

  it('se reinicia a 0 cuando cambia resetKey (nueva oferta)', () => {
    const { result, rerender } = renderHook(
      ({ total, key }) => useImageGallery(total, key),
      { initialProps: { total: 5, key: 'a' } }
    )
    act(() => {
      result.current.next()
      result.current.next()
    })
    expect(result.current.index).toBe(2)

    rerender({ total: 8, key: 'b' })
    expect(result.current.index).toBe(0)
  })

  it('pausa el auto-avance con la pestaña oculta', () => {
    const spy = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    const { result } = renderHook(() => useImageGallery(4, 'a'))
    act(() => vi.advanceTimersByTime(GALLERY_ROTATE_MS * 3))
    expect(result.current.index).toBe(0)
    spy.mockRestore()
  })
})
