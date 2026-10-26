import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import { DocsHeader } from '@/components/SiteHeader/DocsHeader'
import { VersionSelect } from '@/components/VersionSelect'
import { baseOptions } from '@/lib/layout.shared'
import { getApiVersions } from '@/lib/openapi'
import { getVersionTabs } from '@/utils/get-version-tabs'

export default async function Layout({ children }: LayoutProps<'/'>) {
  const tree = source.getPageTree()
  const versionTabs = getVersionTabs(tree, await getApiVersions())

  // Notebook is the only docs layout whose header (`nav.mode: 'top'`) spans the full width.
  // Fumadocs' own tabs dropdown can't be disabled, so the version selector goes in the banner.
  return (
    <DocsLayout
      tree={tree}
      tabs={false}
      sidebar={{ banner: <VersionSelect tabs={versionTabs} /> }}
      {...baseOptions()}
      nav={{ mode: 'top' }}
      slots={{ header: DocsHeader }}
      // Same width as HomeLayout, so the header looks the same on every page.
      containerProps={{ className: '[--fd-layout-width:1400px]' }}
    >
      {children}
    </DocsLayout>
  )
}
