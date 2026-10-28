'use client'
import { useTranslations } from '@fuma-translate/react'
import { ServerPopover, ServerVariables } from '../../../api/ui/playground/server-select'
import { useServer } from 'fumadocs-openapi'
import { cn } from '../../../../lib/cn'

/** the base URL of requests, selects the server and edits its variables */
export default function ServerSelect({ className }: { className?: string }) {
  const { servers, server, resolveUrl, setServer, setServerVariables } = useServer()
  const t = useTranslations({ note: 'playground server select' })
  const base = resolveUrl().replace(/\/$/, '')

  if (!servers || servers.length === 0)
    return (
      <span className={cn('text-fd-muted-foreground truncate ps-1.5', className)}>
        {base}
      </span>
    )

  const serverSchema = server
    ? servers.find((item) => item.url === server.url)
    : undefined

  return (
    <ServerPopover
      label={base}
      title={t('Server URL')}
      value={server?.url}
      onValueChange={setServer}
      className={className}
      options={servers.map((item) => ({
        value: item.url!,
        hasVariables: item.variables !== undefined,
        label: (
          <>
            <span className="block font-mono text-[0.8125rem] break-all">{item.url}</span>
            {item.description && (
              <span className="text-fd-muted-foreground mt-0.5 block text-xs">
                {item.description}
              </span>
            )}
          </>
        ),
      }))}
    >
      {server?.variables && serverSchema?.variables && (
        <ServerVariables
          key={server.url}
          defaultValues={server.variables}
          variables={serverSchema.variables}
          onChange={setServerVariables}
        />
      )}
    </ServerPopover>
  )
}
