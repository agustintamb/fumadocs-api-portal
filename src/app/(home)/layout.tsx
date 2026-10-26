import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { HomeHeader } from '@/components/SiteHeader/HomeHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { baseOptions } from '@/lib/layout.shared'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()} slots={{ header: HomeHeader }}>
      {children}
      <SiteFooter />
    </HomeLayout>
  )
}
