import 'server-only'
import { source } from '@/lib/source'
import { NAV_LINKS, type NavLinkItem } from '@/lib/layout.shared'
import { getFirstPageUrl } from '@/utils/get-first-page-url'

// Pages of the (home) group that share their URL with a content folder.
export const APP_ROUTE_URLS = ['/api-store']

// Links to a folder without a page of its own (`/docs`, `/api-store/portal`) go straight to its
// first page: the folder URL only redirects, and in the static export that shows a skeleton first.
export function resolveFolderLink(href: string): string {
  if (
    !href.startsWith('/') ||
    APP_ROUTE_URLS.includes(href) ||
    source.getPageByHref(href)
  )
    return href
  return getFirstPageUrl(source.getPageTree(), href) ?? href
}

export function getNavLinks(): NavLinkItem[] {
  return NAV_LINKS.map((link) => ({ ...link, href: resolveFolderLink(link.url) }))
}
