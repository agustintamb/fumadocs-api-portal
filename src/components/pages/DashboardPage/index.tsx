'use client'

import Link from 'next/link'
import { FilterChips } from '@/components/FilterChips'
import { STATS } from '@/data/dashboard'
import { es } from '@/i18n/es'
import { ActivityList } from './ActivityList'
import { StatCard } from './StatCard'
import { useDashboardPage } from './useDashboardPage'

export function DashboardPage() {
  const {
    filter,
    filterOptions,
    activity,
    isEmpty,
    handleFilterChange,
    handleBrowseApis,
  } = useDashboardPage()
  const note = es.dashboard.footerNote

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-fd-primary mb-2 text-sm font-semibold tracking-wide uppercase">
            {es.dashboard.eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{es.dashboard.title}</h1>
        </div>
        <button
          type="button"
          onClick={handleBrowseApis}
          className="bg-fd-primary text-fd-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        >
          {es.dashboard.browseApis}
        </button>
      </header>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="bg-fd-card border-fd-border mt-8 rounded-lg border p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{es.dashboard.activityTitle}</h2>
          <FilterChips
            options={filterOptions}
            value={filter}
            onChange={handleFilterChange}
            label={es.dashboard.filtersLabel}
          />
        </div>
        {isEmpty ? (
          <p className="text-fd-muted-foreground py-6 text-center text-sm">
            {es.dashboard.empty}
          </p>
        ) : (
          <ActivityList items={activity} />
        )}
      </section>

      <p className="text-fd-muted-foreground mt-8 text-sm">
        {note.before}
        <code>{note.state}</code>
        {note.middle}
        <code>{note.router}</code>
        {note.after}{' '}
        <Link href="/api-store" className="text-fd-primary underline">
          {es.dashboard.backToStore}
        </Link>
      </p>
    </div>
  )
}
