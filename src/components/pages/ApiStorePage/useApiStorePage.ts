'use client'

import { useState } from 'react'
import type { ApiCardData } from '@/data/apis'
import { es } from '@/i18n/es'
import { filterApis } from '@/utils/filter-apis'

export function useApiStorePage(apis: ApiCardData[]) {
  const [query, setQuery] = useState('')
  const [apiFilter, setApiFilter] = useState('all')

  const filterOptions = [
    { value: 'all', label: es.apiStore.filter.all },
    ...apis.map((api) => ({ value: api.id, label: api.name })),
  ]
  const filtered = filterApis(apis, query, apiFilter)

  const handleQueryChange = (value: string) => setQuery(value)
  const handleApiFilterChange = (value: string) => setApiFilter(value)

  return {
    query,
    apiFilter,
    filterOptions,
    filtered,
    isEmpty: filtered.length === 0,
    handleQueryChange,
    handleApiFilterChange,
  }
}
