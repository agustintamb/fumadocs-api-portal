import type { ApiStatus, ApiVisibility } from '@/data/apis'
import { es } from '@/i18n/es'

export interface ApiBadgesProps {
  status: ApiStatus
  visibility: ApiVisibility
}

const STATUS_CLASSES: Record<ApiStatus, string> = {
  stable: 'bg-fd-accent text-fd-accent-foreground',
  beta: 'bg-fd-secondary text-fd-secondary-foreground',
  deprecated: 'bg-fd-muted text-fd-muted-foreground',
}

const BADGE_CLASSES = 'rounded-lg px-2 py-0.5 text-xs font-medium'

export function ApiBadges({ status, visibility }: ApiBadgesProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <span
        className={`${BADGE_CLASSES} border-fd-border text-fd-muted-foreground border`}
      >
        {es.apiStore.visibility[visibility]}
      </span>
      <span className={`${BADGE_CLASSES} ${STATUS_CLASSES[status]}`}>
        {es.apiStore.status[status]}
      </span>
    </div>
  )
}
