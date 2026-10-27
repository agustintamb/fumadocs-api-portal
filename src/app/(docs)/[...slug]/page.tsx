import { source } from '@/lib/source'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page'
import { notFound } from 'next/navigation'
import { ApiBadges } from '@/components/ApiBadges'
import { getMDXComponents } from '@/components/mdx'
import { API_CATALOG } from '@/data/apis'
import { OpenApiPage } from '@/components/OpenApiPage'
import { DocsPageSkeleton } from '@/components/DocsPageSkeleton'
import { PageRedirect } from '@/components/PageRedirect'
import { es } from '@/i18n/es'
import { APP_ROUTE_URLS, resolveFolderLink } from '@/lib/folder-links'
import { findApiByUrl } from '@/utils/find-api-by-url'
import { findPageNeighbours } from '@/utils/find-page-neighbours'
import { getFirstPageUrl } from '@/utils/get-first-page-url'
import { getFolderSlugs } from '@/utils/get-folder-slugs'
import type { Metadata } from 'next'
import defaultMdxComponents, { createRelativeLink } from 'fumadocs-ui/mdx'
import { Card, type CardProps } from 'fumadocs-ui/components/card'
import type { ComponentProps } from 'react'

const DefaultLink = defaultMdxComponents.a

function FolderLink({ href, ...props }: ComponentProps<'a'>) {
  return <DefaultLink href={href && resolveFolderLink(href)} {...props} />
}

function FolderCard({ href, ...props }: CardProps) {
  return <Card href={href && resolveFolderLink(href)} {...props} />
}

export default async function Page(props: PageProps<'/[...slug]'>) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) {
    // Folders such as `/docs` or `/api-store/portal` have no page of their own: land on their first page.
    const first = getFirstPageUrl(source.getPageTree(), `/${params.slug.join('/')}`)
    if (first) return <PageRedirect url={first} fallback={<DocsPageSkeleton />} />
    notFound()
  }

  const { data } = page
  if ('getOpenAPIPageProps' in data) {
    const api = findApiByUrl(page.url, API_CATALOG)
    return (
      <DocsPage
        toc={data.toc}
        full
        // Fumadocs' own footer would link to the endpoint anchors of the sidebar.
        footer={{ items: findPageNeighbours(source.getPageTree(), page.url) }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DocsTitle>{data.title}</DocsTitle>
          {api && <ApiBadges status={api.status} visibility={api.visibility} />}
        </div>
        <DocsBody>
          <OpenApiPage {...data.getOpenAPIPageProps()} />
        </DocsBody>
      </DocsPage>
    )
  }

  const MDX = data.body

  return (
    <DocsPage toc={data.toc} full={data.full}>
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // Relative file paths resolve to their pages, and folders to their first page.
            a: createRelativeLink(source, page, FolderLink),
            Card: FolderCard,
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  const pageUrls = source.getPages().map((page) => page.url)
  const folders = getFolderSlugs(pageUrls, APP_ROUTE_URLS).map((slug) => ({ slug }))
  return [...source.generateParams(), ...folders]
}

export async function generateMetadata(
  props: PageProps<'/[...slug]'>,
): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  // Without a page, the page itself redirects to the folder's first page or responds 404.
  if (!page) return {}

  // The intro title already carries the site name, so skip the root title template.
  const { title } = page.data
  return {
    title: title?.endsWith(es.site.title) ? { absolute: title } : title,
    description: page.data.description,
  }
}
