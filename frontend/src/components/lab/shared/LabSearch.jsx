import React from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '../../ui/input'
import { Search } from 'lucide-react'
import { useLabContext } from '../../../contexts/LabContext'

export default function LabSearch() {
  const { t } = useTranslation()
  const { labState, setSearch } = useLabContext()

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={t('lab.searchPlaceholder')}
        value={labState.searchQuery}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
