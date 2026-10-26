const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']

export function countOperations(document: unknown): number {
  const paths = (document as { paths?: Record<string, unknown> } | null)?.paths
  if (!paths || typeof paths !== 'object') return 0

  return Object.values(paths).reduce<number>((total, item) => {
    if (!item || typeof item !== 'object') return total
    return total + HTTP_METHODS.filter((method) => method in item).length
  }, 0)
}
