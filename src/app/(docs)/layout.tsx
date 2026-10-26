import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import { baseOptions } from '@/lib/layout.shared'
import { getRootFolderTabs } from '@/utils/get-root-folder-tabs'

export default function Layout({ children }: LayoutProps<'/'>) {
  const { nav, ...base } = baseOptions()
  const tree = source.getPageTree()

  // Notebook with a top nav is the only docs layout that shows the links in a desktop top bar.
  return (
    <DocsLayout
      tree={tree}
      tabs={getRootFolderTabs(tree)}
      {...base}
      nav={{ ...nav, mode: 'top' }}
    >
      {children}
    </DocsLayout>
  )
}
