'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ACTIVITY, type ActivityFilter } from '@/data/dashboard'
import { es } from '@/i18n/es'

const FILTER_OPTIONS: { value: ActivityFilter; label: string }[] = [
  { value: 'all', label: es.dashboard.filter.all },
  { value: 'success', label: es.dashboard.filter.success },
  { value: 'error', label: es.dashboard.filter.error },
  { value: 'pending', label: es.dashboard.filter.pending },
]

export function useDashboardPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<ActivityFilter>('all')

  const activity =
    filter === 'all' ? ACTIVITY : ACTIVITY.filter((item) => item.status === filter)

  const handleFilterChange = (value: ActivityFilter) => setFilter(value)
  const handleBrowseApis = () => router.push('/api-store')

  return {
    filter,
    filterOptions: FILTER_OPTIONS,
    activity,
    isEmpty: activity.length === 0,
    handleFilterChange,
    handleBrowseApis,
  }
}
