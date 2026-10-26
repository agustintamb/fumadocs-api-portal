'use client'

import { usePathname } from 'fumadocs-core/framework'
import { SidebarTabsDropdown } from 'fumadocs-ui/components/sidebar/tabs/dropdown'
import { useTabsGroups, useTreePath } from 'fumadocs-ui/contexts/tree'
import { isLayoutTabActive, type LayoutTab } from 'fumadocs-ui/layouts/shared'
import { es } from '@/i18n/es'

export interface VersionSelectProps {
  tabs: LayoutTab[]
}

// Each API has its own `root` type in meta.json, so a page has at most one group of versions,
// and none outside the APIs.
export function VersionSelect({ tabs }: VersionSelectProps) {
  const versions = useTabsGroups(tabs)[0]?.options ?? []
  const path = useTreePath()
  const pathname = usePathname()
  // Same lookup as Fumadocs' dropdown, so the accessible name includes the version it shows.
  const selected = versions.findLast((tab) => isLayoutTabActive(tab, path, pathname))

  return (
    <SidebarTabsDropdown
      options={tabs}
      aria-label={selected ? `${es.versionSelect} ${selected.title}` : es.versionSelect}
      disabled={versions.length < 2}
      // Without pointer-events-none the disabled button still gets the hover highlight.
      className="disabled:text-fd-muted-foreground disabled:pointer-events-none"
    />
  )
}
