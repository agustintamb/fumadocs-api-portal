import { DocsPage } from 'fumadocs-ui/layouts/notebook/page'
import { es } from '@/i18n/es'

// `bg-fd-muted` matches the page background in the light theme, so the bars use a tint instead.
const BAR = 'bg-fd-muted-foreground/15 rounded-md'

// Placeholder for a docs page while a folder URL redirects to its first page.
export function DocsPageSkeleton() {
  return (
    <DocsPage
      breadcrumb={{ enabled: false }}
      footer={{ enabled: false }}
      tableOfContent={{ enabled: false }}
      tableOfContentPopover={{ enabled: false }}
    >
      <div
        role="status"
        aria-label={es.docs.loading}
        className="flex flex-col gap-4 motion-safe:animate-pulse"
      >
        <div className={`${BAR} h-9 w-2/3`} />
        <div className={`${BAR} h-5 w-1/2`} />
        <div className="mt-4 flex flex-col gap-3">
          <div className={`${BAR} h-4 w-full`} />
          <div className={`${BAR} h-4 w-11/12`} />
          <div className={`${BAR} h-4 w-4/5`} />
        </div>
        <div className={`${BAR} mt-2 h-40 w-full rounded-lg`} />
      </div>
    </DocsPage>
  )
}
