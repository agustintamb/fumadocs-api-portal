import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import { DocsHeader } from '@/components/SiteHeader/DocsHeader'
import { VersionSelect } from '@/components/VersionSelect'
import { baseOptions } from '@/lib/layout.shared'
import { getVersionTabs } from '@/utils/get-version-tabs'

// Generated API pages carry their spec; MDX pages don't, so Docs gets no version selector.
function getSpecVersion(url: string): string | undefined {
  const data = source.getPageByHref(url)?.page.data
  return data && 'getSchema' in data ? data.getSchema().bundled.info?.version : undefined
}

export default function Layout({ children }: LayoutProps<'/'>) {
  const tree = source.getPageTree()
  const versionTabs = getVersionTabs(tree, getSpecVersion)

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
