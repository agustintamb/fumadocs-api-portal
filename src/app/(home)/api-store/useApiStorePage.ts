'use client'

import { useState } from 'react'
import type { ApiCardData } from '@/data/apis'
import { es } from '@/i18n/es'
import { filterApis, type ApiVisibilityFilter } from '@/utils/filter-apis'

const VISIBILITY_OPTIONS: { value: ApiVisibilityFilter; label: string }[] = [
  { value: 'all', label: es.apiStore.filter.all },
  { value: 'public', label: es.apiStore.filter.public },
  { value: 'internal', label: es.apiStore.filter.internal },
]

export function useApiStorePage(apis: ApiCardData[]) {
  const [query, setQuery] = useState('')
  const [visibility, setVisibility] = useState<ApiVisibilityFilter>('all')

  const filtered = filterApis(apis, query, visibility)

  const handleQueryChange = (value: string) => setQuery(value)
  const handleVisibilityChange = (value: ApiVisibilityFilter) => setVisibility(value)

  return {
    query,
    visibility,
    visibilityOptions: VISIBILITY_OPTIONS,
    filtered,
    isEmpty: filtered.length === 0,
    handleQueryChange,
    handleVisibilityChange,
  }
}
