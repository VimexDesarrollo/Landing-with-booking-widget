import { useLang } from '@/context/LangContext'
import { DESTINATIONS } from '../constants'
import { IconPin } from '../ui/icons'

export function DestinationField({ value, onChange }) {
  const { t } = useLang()

  return (
    <div className="search__field">
      <span className="search__label">{t('Destination', 'Destino')}</span>
      <span className="search__value">
        <IconPin />
        <select
          className="search__select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{t('All destinations', 'Todos los destinos')}</option>
          {DESTINATIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </span>
    </div>
  )
}
