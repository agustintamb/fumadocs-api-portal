'use client'

import { SidebarTabsDropdown } from 'fumadocs-ui/components/sidebar/tabs/dropdown'
import { useTabsGroups } from 'fumadocs-ui/contexts/tree'
import type { LayoutTab } from 'fumadocs-ui/layouts/shared'
import { es } from '@/i18n/es'

export interface VersionSelectProps {
  tabs: LayoutTab[]
}

// Each API has its own `root` type in meta.json, so a page has at most one group of versions,
// and none outside the APIs.
export function VersionSelect({ tabs }: VersionSelectProps) {
  const versions = useTabsGroups(tabs)[0]?.options ?? []

  return (
    <SidebarTabsDropdown
      options={tabs}
      aria-label={es.versionSelect}
      disabled={versions.length < 2}
      // Without this the disabled button still gets the hover highlight.
      className="disabled:pointer-events-none"
    />
  )
}
