import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { HomeHeader } from '@/components/SiteHeader/HomeHeader'
import { SiteFooter } from '@/components/SiteFooter'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout slots={{ header: HomeHeader }}>
      {children}
      <SiteFooter />
    </HomeLayout>
  )
}
