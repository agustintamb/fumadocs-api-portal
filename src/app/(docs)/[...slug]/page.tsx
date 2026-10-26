import { source } from '@/lib/source'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page'
import { notFound, redirect } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import { OpenApiPage } from '@/components/OpenApiPage'
import { es } from '@/i18n/es'
import { findFirstPageUrl } from '@/utils/find-first-page-url'
import type { Metadata } from 'next'
import { createRelativeLink } from 'fumadocs-ui/mdx'

export default async function Page(props: PageProps<'/[...slug]'>) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) {
    // Folders such as `/api-store/blog` have no page of their own: land on their first page.
    const firstPageUrl = findFirstPageUrl(
      source.getPageTree(),
      '/' + params.slug.join('/'),
    )
    if (firstPageUrl) redirect(firstPageUrl)
    notFound()
  }

  const { data } = page
  if ('getOpenAPIPageProps' in data) {
    return (
      <DocsPage toc={data.toc} full>
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
  return source.generateParams()
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
