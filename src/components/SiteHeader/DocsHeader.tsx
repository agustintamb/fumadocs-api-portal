'use client'

import { Menu } from 'lucide-react'
import { buttonVariants } from 'fumadocs-ui/components/ui/button'
import { useNotebookLayout } from 'fumadocs-ui/layouts/notebook'
import { SiteHeader } from '@/components/SiteHeader'

// Spans the whole first row of the notebook grid. `contain: inline-size` keeps its content from
// widening the grid's outer columns; `--fd-header-height` offsets the sticky sidebar and TOC.
export function DocsHeader() {
  const SidebarTrigger = useNotebookLayout().slots.sidebar.trigger

  return (
    <SiteHeader
      className="layout:[--fd-header-height:--spacing(14)] col-span-full row-start-1 [contain:inline-size]"
      mobileTrigger={
        <SidebarTrigger
          className={buttonVariants({
            variant: 'ghost',
            size: 'icon-sm',
            className: 'md:hidden',
          })}
        >
          <Menu />
        </SidebarTrigger>
      }
    />
  )
}
