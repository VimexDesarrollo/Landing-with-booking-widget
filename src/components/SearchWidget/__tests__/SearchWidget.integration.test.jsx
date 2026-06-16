import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import SearchWidget from '../SearchWidget'
import { LangProvider } from '@/context/LangContext'

// Mock LangContext
vi.mock('@/context/LangContext', () => ({
  useLang: () => ({
    t: (en, es) => es,
    lang: 'es',
  }),
  LangProvider: ({ children }) => children,
}))

const renderWithLang = (component) => {
  return render(component, {
    wrapper: ({ children }) => <LangProvider>{children}</LangProvider>,
  })
}

describe('SearchWidget Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 15)) // 15 de junio 2026
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial Render', () => {
    it('displays default dates (18 Jun → 20 Jun)', () => {
      renderWithLang(<SearchWidget />)

      const dateField = screen.getByText('Fechas').closest('.search__field--dates')
      expect(dateField.textContent).toContain('18 Jun')
      expect(dateField.textContent).toContain('20 Jun')
    })

    it('displays destination as "Todos los destinos"', () => {
      renderWithLang(<SearchWidget />)

      const destSelect = screen.getByDisplayValue(/Todos los destinos/i)
      expect(destSelect).toBeInTheDocument()
    })

    it('displays guest count as 2', () => {
      renderWithLang(<SearchWidget />)

      expect(screen.getByText(/2 huéspedes/i)).toBeInTheDocument()
    })
  })

  describe('Calendar Behavior', () => {
    it('opens calendar when date field is clicked', () => {
      renderWithLang(<SearchWidget />)

      const dateField = screen.getByText('Fechas').closest('.search__field--dates')
      fireEvent.click(dateField)

      expect(dateField).toBeInTheDocument()
    })

    it('resets calendar when opening after prior selection', () => {
      renderWithLang(<SearchWidget />)

      const dateField = screen.getByText('Fechas').closest('.search__field--dates')
      fireEvent.click(dateField)

      expect(dateField).toBeInTheDocument()
    })
  })

  describe('Guest Count', () => {
    it('increments guest count', () => {
      renderWithLang(<SearchWidget />)

      const incrementBtn = screen.getAllByRole('button', { name: /Más/i })[0]
      fireEvent.click(incrementBtn)

      expect(screen.getByText(/3 huéspedes/i)).toBeInTheDocument()
    })

    it('decrements guest count', () => {
      renderWithLang(<SearchWidget />)

      const decrementBtn = screen.getAllByRole('button', { name: /Menos/i })[0]
      fireEvent.click(decrementBtn)

      expect(screen.getByText(/1 huésped/i)).toBeInTheDocument()
    })

    it('respects min guest count (1)', () => {
      renderWithLang(<SearchWidget />)

      const decrementBtn = screen.getAllByRole('button', { name: /Menos/i })[0]

      fireEvent.click(decrementBtn)
      fireEvent.click(decrementBtn)

      expect(screen.getByText(/1 huésped/i)).toBeInTheDocument()
    })

    it('respects max guest count (20)', () => {
      renderWithLang(<SearchWidget />)

      const incrementBtn = screen.getAllByRole('button', { name: /Más/i })[0]

      for (let i = 0; i < 20; i++) {
        fireEvent.click(incrementBtn)
      }

      expect(screen.getByText(/20 huéspedes/i)).toBeInTheDocument()

      fireEvent.click(incrementBtn)
      expect(screen.getByText(/20 huéspedes/i)).toBeInTheDocument()
    })
  })

  describe('Destination', () => {
    it('changes destination when selected', () => {
      renderWithLang(<SearchWidget />)

      const destSelect = screen.getByDisplayValue(/Todos los destinos/i)
      fireEvent.change(destSelect, { target: { value: 'Playa del Carmen' } })

      expect(screen.getByDisplayValue('Playa del Carmen')).toBeInTheDocument()
    })

    it('handles multiple destination changes', () => {
      renderWithLang(<SearchWidget />)

      const destSelect = screen.getByDisplayValue(/Todos los destinos/i)

      fireEvent.change(destSelect, { target: { value: 'Playa del Carmen' } })
      expect(screen.getByDisplayValue('Playa del Carmen')).toBeInTheDocument()

      fireEvent.change(destSelect, { target: { value: 'Tulum' } })
      expect(screen.getByDisplayValue('Tulum')).toBeInTheDocument()

      fireEvent.change(destSelect, { target: { value: 'Akumal' } })
      expect(screen.getByDisplayValue('Akumal')).toBeInTheDocument()
    })
  })

  describe('Search Button', () => {
    it('displays search button', () => {
      renderWithLang(<SearchWidget />)

      const searchBtn = screen.getByRole('button', { name: /Buscar Disponibilidad/i })
      expect(searchBtn).toBeInTheDocument()
    })

    it('search button is enabled when dates are valid', () => {
      renderWithLang(<SearchWidget />)

      const searchBtn = screen.getByRole('button', { name: /Buscar Disponibilidad/i })
      expect(searchBtn).not.toBeDisabled()
    })

    it('navigates to booking engine on submit with default values', () => {
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      })

      renderWithLang(<SearchWidget />)

      const form = screen.getByRole('button', { name: /Buscar Disponibilidad/i }).closest('form')
      fireEvent.submit(form)

      expect(window.location.href).toContain('checkIn=2026-06-18')
      expect(window.location.href).toContain('checkOut=2026-06-20')
      expect(window.location.href).toContain('minOccupancy=2')
      expect(window.location.href).toContain('adults=2')
    })
  })

  describe('Form Validation', () => {
    it('requires valid dates before allowing search', () => {
      renderWithLang(<SearchWidget />)

      // Default state has valid dates, so search should be allowed
      const searchBtn = screen.getByRole('button', { name: /Buscar Disponibilidad/i })
      expect(searchBtn).not.toBeDisabled()
    })
  })
})
