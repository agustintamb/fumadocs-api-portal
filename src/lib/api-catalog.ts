import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'
import { API_CATALOG, type ApiCardData, type ApiEntry } from '@/data/apis'
import { countOperations } from '@/utils/count-operations'

// `yaml` reads both formats: JSON is valid YAML.
async function readSpec(file: string): Promise<unknown> {
  const source = await readFile(path.join(process.cwd(), 'apis', file), 'utf8')
  return parse(source)
}

async function toCardData(
  entry: ApiEntry,
  resolveLink: (href: string) => string,
): Promise<ApiCardData> {
  const documents = await Promise.all(entry.specs.map((spec) => readSpec(spec.file)))
  const counts = documents.map(countOperations)
  const docsUrl = resolveLink(entry.path)

  if (entry.specs.length === 1) {
    const info = (documents[0] as { info?: { version?: string } }).info
    return {
      ...entry,
      version: `v${info?.version ?? ''}`,
      endpoints: String(counts[0]),
      docsUrl,
    }
  }

  return {
    ...entry,
    version: entry.specs.map((spec) => spec.label).join(' / '),
    endpoints: counts.join(' / '),
    docsUrl,
  }
}

// `resolveLink` maps each API folder to its first page (see resolveFolderLink).
export function getApiCatalog(
  resolveLink: (href: string) => string,
): Promise<ApiCardData[]> {
  return Promise.all(API_CATALOG.map((entry) => toCardData(entry, resolveLink)))
}
