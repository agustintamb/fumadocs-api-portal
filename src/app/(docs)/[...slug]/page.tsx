import { source } from '@/lib/source'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page'
import { flattenTree } from 'fumadocs-core/page-tree'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import { OpenApiPage } from '@/components/OpenApiPage'
import { PageRedirect } from '@/components/PageRedirect'
import { es } from '@/i18n/es'
import { findPageNeighbours } from '@/utils/find-page-neighbours'
import { getFolderSlugs } from '@/utils/get-folder-slugs'
import type { Metadata } from 'next'
import { createRelativeLink } from 'fumadocs-ui/mdx'

export default async function Page(props: PageProps<'/[...slug]'>) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) {
    // Folders such as `/docs` or `/api-store/blog` have no page of their own: land on their first page.
    const prefix = `/${params.slug.join('/')}/`
    const first = flattenTree(source.getPageTree().children).find((item) =>
      item.url.startsWith(prefix),
    )
    if (first) return <PageRedirect url={first.url} />
    notFound()
  }

  const { data } = page
  if ('getOpenAPIPageProps' in data) {
    return (
      <DocsPage
        toc={data.toc}
        full
        // Fumadocs' own footer would link to the endpoint anchors of the sidebar.
        footer={{ items: findPageNeighbours(source.getPageTree(), page.url) }}
      >
        <DocsTitle>{data.title}</DocsTitle>
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
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  const pageUrls = source.getPages().map((page) => page.url)
  // `/api-store` is the catalog page of the (home) group, not a folder redirect.
  const folders = getFolderSlugs(pageUrls, ['/api-store']).map((slug) => ({ slug }))
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
