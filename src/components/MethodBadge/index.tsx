export interface MethodBadgeProps {
  method: string
}

// Same colors as fumadocs-openapi's `MethodLabel`, which isn't exported.
const colors: Record<string, string> = {
  GET: 'text-green-600 dark:text-green-400',
  POST: 'text-blue-600 dark:text-blue-400',
  PUT: 'text-yellow-600 dark:text-yellow-400',
  PATCH: 'text-orange-600 dark:text-orange-400',
  DELETE: 'text-red-600 dark:text-red-400',
}

export function MethodBadge({ method }: MethodBadgeProps) {
  const verb = method.toUpperCase()

  return (
    <span
      className={`ms-auto font-mono text-xs font-medium text-nowrap ${colors[verb] ?? 'text-fd-muted-foreground'}`}
    >
      {verb}
    </span>
  )
}
