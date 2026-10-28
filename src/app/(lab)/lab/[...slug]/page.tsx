import { DocsBody, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ApiVisibilityBadge } from '@/components/ApiVisibilityBadge'
import { API_CATALOG } from '@/data/apis'
import { OpenApiLabPage } from '@/components/lab/OpenApiLabPage'
import {
  getLabParams,
  getLabTree,
  getPortalPage,
  toLabUrl,
} from '@/components/lab/utils/lab-source'
import { findApiByUrl } from '@/utils/find-api-by-url'
import { findPageNeighbours } from '@/utils/find-page-neighbours'

export default async function Page(props: PageProps<'/lab/[...slug]'>) {
  const { slug } = await props.params
  const page = getPortalPage(slug)
  if (!page || !('getOpenAPIPageProps' in page.data)) notFound()

  const { data } = page
  const api = findApiByUrl(page.url, API_CATALOG)
  return (
    <DocsPage
      toc={data.toc}
      full
      footer={{ items: findPageNeighbours(getLabTree(), toLabUrl(page.url)) }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DocsTitle>{data.title}</DocsTitle>
        {api && <ApiVisibilityBadge visibility={api.visibility} />}
      </div>
      <DocsBody>
        <OpenApiLabPage {...data.getOpenAPIPageProps()} />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return getLabParams()
}

export async function generateMetadata(
  props: PageProps<'/lab/[...slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params
  const page = getPortalPage(slug)
  if (!page) return {}
  return { title: page.data.title, description: page.data.description }
}
