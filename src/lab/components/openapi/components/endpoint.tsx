import type { ComponentProps } from 'react'
import { cn } from '../../../lib/cn'
import { MethodLabel } from './method-label'

export function EndpointBar({
  method,
  route,
  deprecated = false,
  children,
  ...props
}: ComponentProps<'div'> & { method: string; route: string; deprecated?: boolean }) {
  return (
    <div
      {...props}
      className={cn(
        'not-prose bg-fd-card text-fd-card-foreground flex min-h-11 items-center gap-3 rounded-xl border p-1.5 ps-3.5 text-sm',
        props.className,
      )}
    >
      <MethodLabel className="text-xs">{method}</MethodLabel>
      <Route route={route} className={cn('flex-1', deprecated && 'line-through')} />
      {children}
    </div>
  )
}

function Route({ route, ...props }: ComponentProps<'div'> & { route: string }) {
  return (
    <div
      {...props}
      className={cn(
        'flex min-w-0 [scrollbar-width:none] items-center overflow-x-auto font-mono text-[0.8125rem] text-nowrap',
        props.className,
      )}
    >
      {/* variables, including runtime expressions like `{$request.body#/url}`, and slashes between texts */}
      {route.split(/(\{[^}]*\}|\/)/).map((part, index) => {
        if (index % 2 === 0) return part
        if (part === '/')
          return (
            <span key={index} className="text-fd-muted-foreground">
              /
            </span>
          )

        return (
          <span key={index} className="bg-fd-primary/10 text-fd-primary rounded-md px-1">
            {part}
          </span>
        )
      })}
    </div>
  )
}
