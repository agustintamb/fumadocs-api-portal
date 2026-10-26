'use client'

import { FilterChips } from '@/components/FilterChips'
import type { ApiCardData } from '@/data/apis'
import { es } from '@/i18n/es'
import { ApiCard } from './ApiCard'
import { useApiStorePage } from './useApiStorePage'

export interface ApiStorePageProps {
  apis: ApiCardData[]
}

export function ApiStorePage({ apis }: ApiStorePageProps) {
  const {
    query,
    apiFilter,
    filterOptions,
    filtered,
    isEmpty,
    handleQueryChange,
    handleApiFilterChange,
  } = useApiStorePage(apis)

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{es.apiStore.title}</h1>
        <p className="text-fd-muted-foreground max-w-2xl">{es.apiStore.description}</p>
      </header>

      <div className="mb-6 flex flex-col gap-4">
        <input
          type="search"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder={es.apiStore.searchPlaceholder}
          aria-label={es.apiStore.searchLabel}
          className="bg-fd-background border-fd-border placeholder:text-fd-muted-foreground focus-visible:ring-fd-primary w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus-visible:ring-2"
        />
        <FilterChips
          options={filterOptions}
          value={apiFilter}
          onChange={handleApiFilterChange}
          label={es.apiStore.filtersLabel}
        />
      </div>

      {isEmpty ? (
        <p className="text-fd-muted-foreground py-10 text-center text-sm">
          {es.apiStore.empty}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {filtered.map((api) => (
            <ApiCard key={api.id} api={api} />
          ))}
        </div>
      )}

      <p className="text-fd-muted-foreground mt-10 text-sm">{es.apiStore.footerNote}</p>
    </div>
  )
}
