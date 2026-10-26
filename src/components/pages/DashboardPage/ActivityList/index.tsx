import type { ActivityItem, ActivityStatus } from '@/data/dashboard'
import { es } from '@/i18n/es'

const STATUS_CLASSES: Record<ActivityStatus, string> = {
  success: 'bg-fd-primary/10 text-fd-primary',
  error: 'bg-red-500/10 text-red-600 dark:text-red-400',
  pending: 'bg-fd-muted text-fd-muted-foreground',
}

interface ActivityListProps {
  items: ActivityItem[]
}

export function ActivityList({ items }: ActivityListProps) {
  return (
    <ul className="divide-fd-border divide-y">
      {items.map((item) => (
        <li key={item.id} className="flex flex-wrap items-center gap-3 py-3">
          <code className="text-sm font-medium">{item.action}</code>
          <span className="border-fd-border text-fd-muted-foreground rounded-lg border px-2 py-0.5 text-xs">
            {item.api}
          </span>
          <span className="text-fd-muted-foreground text-xs">{item.time}</span>
          <span
            className={`ml-auto rounded-lg px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[item.status]}`}
          >
            {es.dashboard.filter[item.status]}
          </span>
        </li>
      ))}
    </ul>
  )
}
