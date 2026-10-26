import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { SiteFooter } from '@/components/SiteFooter'
import { baseOptions } from '@/lib/layout.shared'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      {children}
      <SiteFooter />
    </HomeLayout>
  )
}
