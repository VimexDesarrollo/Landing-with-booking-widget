import { useLang } from '@/context/LangContext'
import { MIN_GUESTS, MAX_GUESTS } from '../constants'
import { IconGuest } from '../ui/icons'

export function GuestCountField({ value, onChange }) {
  const { t } = useLang()

  const handleDecrement = () => {
    onChange(Math.max(MIN_GUESTS, value - 1))
  }

  const handleIncrement = () => {
    onChange(Math.min(MAX_GUESTS, value + 1))
  }

  const guestLabel = value === 1 ? 'huésped' : 'huéspedes'

  return (
    <div className="search__field">
      <span className="search__label">{t('Guests', 'Huéspedes')}</span>
      <span className="search__value">
        <IconGuest />
        <div className="search__stepper">
          <button
            type="button"
            className="search__stepper-btn"
            onClick={handleDecrement}
            aria-label="Menos"
          >
            −
          </button>
          <span>
            {value} {t('guests', guestLabel)}
          </span>
          <button
            type="button"
            className="search__stepper-btn"
            onClick={handleIncrement}
            aria-label="Más"
          >
            +
          </button>
        </div>
      </span>
    </div>
  )
}
