import type { ApiVisibility } from '@/data/apis'
import { es } from '@/i18n/es'

export interface ApiVisibilityBadgeProps {
  visibility: ApiVisibility
}

export function ApiVisibilityBadge({ visibility }: ApiVisibilityBadgeProps) {
  return (
    <span className="border-fd-border text-fd-muted-foreground shrink-0 rounded-lg border px-2 py-0.5 text-xs font-medium">
      {es.apiStore.visibility[visibility]}
    </span>
  )
}
