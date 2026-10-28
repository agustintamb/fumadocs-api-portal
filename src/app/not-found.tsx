import { HomeHeader } from '@/components/SiteHeader/HomeHeader'
import { NotFoundContent } from '@/components/NotFoundContent'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col [--fd-layout-width:1400px]">
      <HomeHeader />
      <NotFoundContent />
    </div>
  )
}
