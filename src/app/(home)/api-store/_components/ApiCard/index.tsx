import Link from 'next/link'
import type { ApiCardData, ApiStatus } from '@/data/apis'
import { es } from '@/i18n/es'

export interface ApiCardProps {
  api: ApiCardData
}

const STATUS_CLASSES: Record<ApiStatus, string> = {
  stable: 'bg-fd-accent text-fd-accent-foreground',
  beta: 'bg-fd-secondary text-fd-secondary-foreground',
  deprecated: 'bg-fd-muted text-fd-muted-foreground',
}

export function ApiCard({ api }: ApiCardProps) {
  return (
    <article className="bg-fd-card border-fd-border flex flex-col gap-4 rounded-lg border p-5">
      <header className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">{api.name}</h2>
        <span
          className={`rounded-lg px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[api.status]}`}
        >
          {es.apiStore.status[api.status]}
        </span>
      </header>
      <p className="text-fd-muted-foreground text-sm">{api.description}</p>
      <ul className="flex flex-wrap gap-2">
        {api.tags.map((tag) => (
          <li
            key={tag}
            className="bg-fd-muted text-fd-muted-foreground rounded-lg px-2 py-0.5 text-xs"
          >
            {tag}
          </li>
        ))}
      </ul>
      <p className="text-fd-muted-foreground mt-auto text-sm">
        <strong className="text-fd-foreground">{api.version}</strong>{' '}
        {es.apiStore.version} ·{' '}
        <strong className="text-fd-foreground">{api.endpoints}</strong>{' '}
        {es.apiStore.endpoints} ·{' '}
        <strong className="text-fd-foreground">{api.category}</strong>
      </p>
      <Link
        href={api.path}
        className="bg-fd-primary text-fd-primary-foreground block w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium transition-opacity hover:opacity-90"
      >
        {es.apiStore.viewDocs}
      </Link>
    </article>
  )
}
