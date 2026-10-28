import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import type { Metadata } from 'next'
import { getLabTree, getPortalPage } from '@/components/lab/utils/lab-source'
import { DocsHeader } from '@/components/SiteHeader/DocsHeader'
import { VersionSelect } from '@/components/VersionSelect'
import { getNavLinks } from '@/lib/folder-links'
import { baseOptions } from '@/lib/layout.shared'
import { getVersionTabs } from '@/utils/get-version-tabs'
import { LabBanner } from './_components/LabBanner'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

function getSpecVersion(url: string): string | undefined {
  const slug = url.split('#')[0].split('/').filter(Boolean).slice(1)
  const data = getPortalPage(slug)?.data
  return data && 'getSchema' in data ? data.getSchema().bundled.info?.version : undefined
}

// Same layout as the docs, with only the Portal API in the sidebar.
export default function Layout({ children }: LayoutProps<'/lab'>) {
  const tree = getLabTree()
  const versionTabs = getVersionTabs(tree, getSpecVersion)

  return (
    <>
      <DocsLayout
        tree={tree}
        tabs={false}
        sidebar={{ banner: <VersionSelect tabs={versionTabs} /> }}
        {...baseOptions(getNavLinks())}
        nav={{ mode: 'top' }}
        slots={{ header: DocsHeader }}
        containerProps={{ className: '[--fd-layout-width:1400px]' }}
      >
        {children}
      </DocsLayout>
      <LabBanner />
    </>
  )
}
