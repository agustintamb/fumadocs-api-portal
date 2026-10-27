import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'

// The index is built once and searched in the browser, so it also works in the static export.
export const dynamic = 'force-static'

export const { staticGET: GET } = createFromSource(source)
