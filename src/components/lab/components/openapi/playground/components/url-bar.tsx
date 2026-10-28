'use client'
import { ParamInput } from '../../../api/ui/playground/param-input'
import { SendButton } from '../../../api/ui/playground/panels'
import type { JsonSchema } from '@fumadocs/json-schema'
import { MethodLabel } from '../../components/method-label'
import type { ParameterObject } from 'fumadocs-openapi'
import { cn } from '../../../../lib/cn'
import ServerSelect from './server-select'

export function UrlBar({
  method,
  route,
  parameters,
  deprecated = false,
  loading,
}: {
  method: string
  route: string
  /** path parameters, edited inline */
  parameters: ParameterObject[]
  deprecated?: boolean
  loading: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-fd-card flex h-10 min-w-0 flex-1 items-center gap-1.5 rounded-xl border ps-1 pe-2 text-[0.8125rem]">
        <MethodLabel className="shrink-0 rounded-lg bg-current/10 px-2 py-1 text-xs">
          {method}
        </MethodLabel>
        <div className="flex min-w-0 flex-1 [scrollbar-width:none] items-center overflow-x-auto font-mono">
          <ServerSelect className="min-w-16" />
          <div
            className={cn(
              'text-fd-foreground flex shrink-0 items-center whitespace-pre',
              deprecated && 'line-through',
            )}
          >
            {route.split(/(\{[^}]+\})/).map((part, i) => {
              if (!part.startsWith('{') || !part.endsWith('}')) return part
              const name = part.slice(1, -1)
              const param = parameters.find((p) => p.name === name)

              return (
                <ParamInput
                  key={i}
                  fieldName={['path', name]}
                  name={name}
                  schema={param?.schema as JsonSchema | undefined}
                  description={param?.description}
                />
              )
            })}
          </div>
        </div>
      </div>
      <SendButton sending={loading} />
    </div>
  )
}
