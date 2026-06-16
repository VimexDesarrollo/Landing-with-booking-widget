'use client'

import { useSearchWidgetLogic } from './hooks/useSearchWidgetLogic'
import { DestinationField } from './fields/DestinationField'
import { DateRangeField } from './fields/DateRangeField'
import { GuestCountField } from './fields/GuestCountField'
import { SearchButton } from './ui/SearchButton'
import { useLang } from '@/context/LangContext'

export default function SearchWidget() {
  const { lang } = useLang()
  const {
    dest,
    setDest,
    guests,
    setGuests,
    dateOpen,
    openCalendar,
    closeCalendar,
    dateRange,
    dateError,
    handleDateSelect,
    handleSearch,
    isValid,
  } = useSearchWidgetLogic()

  return (
    <form className="search" onSubmit={handleSearch}>
      <DestinationField value={dest} onChange={setDest} />
      <DateRangeField
        dateOpen={dateOpen}
        onOpen={openCalendar}
        onClose={closeCalendar}
        dateRange={dateRange}
        dateError={dateError}
        onDateSelect={handleDateSelect}
        lang={lang}
      />
      <GuestCountField value={guests} onChange={setGuests} />
      <SearchButton onSubmit={handleSearch} disabled={!isValid} />
    </form>
  )
}
