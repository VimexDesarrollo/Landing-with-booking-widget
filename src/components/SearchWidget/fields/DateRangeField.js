import { useLang } from '@/context/LangContext'
import { format } from 'date-fns'
import DateRangePicker from '../DateRangePicker'
import { IconCal } from '../ui/icons'

const fmtDate = (d) => (d ? format(d, 'dd MMM') : '—')

export function DateRangeField({
  dateOpen,
  onOpen,
  onClose,
  dateRange,
  dateError,
  onDateSelect,
  lang,
}) {
  const { t } = useLang()

  return (
    <div
      className="search__field search__field--dates"
      onClick={onOpen}
      style={{ cursor: 'pointer' }}
    >
      <span className="search__label">{t('Dates', 'Fechas')}</span>
      <span className="search__value">
        <IconCal />
        <span>
          {fmtDate(dateRange.from)} → {fmtDate(dateRange.to)}
        </span>
      </span>
      <DateRangePicker
        open={dateOpen}
        onClose={onClose}
        range={dateRange}
        errorText={dateError}
        onSelect={onDateSelect}
        lang={lang}
      />
    </div>
  )
}
