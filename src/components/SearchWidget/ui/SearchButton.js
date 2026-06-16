import { useLang } from '@/context/LangContext'
import { IconSearch } from './icons'

export function SearchButton({ onSubmit, disabled = false }) {
  const { t } = useLang()

  return (
    <button
      type="submit"
      className="search__btn"
      data-magnetic
      disabled={disabled}
      onClick={onSubmit}
    >
      <span>{t('Search Availability', 'Buscar Disponibilidad')}</span>
      <IconSearch />
    </button>
  )
}
