// Folder URLs (such as `/docs`) have no page of their own; a static export needs them listed
// so their redirect to the first page gets prerendered.
export function getFolderSlugs(
  pageUrls: string[],
  excludedUrls: string[] = [],
): string[][] {
  const skipped = new Set([...pageUrls, ...excludedUrls])
  const folders = new Map<string, string[]>()
  for (const url of pageUrls) {
    const segments = url.split('/').filter(Boolean)
    for (let depth = 1; depth < segments.length; depth++) {
      const slug = segments.slice(0, depth)
      const folderUrl = `/${slug.join('/')}`
      if (!skipped.has(folderUrl) && !folders.has(folderUrl)) folders.set(folderUrl, slug)
    }
  }
  return [...folders.values()]
}
