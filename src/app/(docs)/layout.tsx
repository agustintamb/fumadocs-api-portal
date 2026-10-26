import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import { DocsHeader } from '@/components/SiteHeader/DocsHeader'
import { baseOptions } from '@/lib/layout.shared'
import { getRootFolderTabs } from '@/utils/get-root-folder-tabs'

export default function Layout({ children }: LayoutProps<'/'>) {
  const tree = source.getPageTree()

  // Notebook is the only docs layout whose header (`nav.mode: 'top'`) spans the full width.
  return (
    <DocsLayout
      tree={tree}
      tabs={getRootFolderTabs(tree)}
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
