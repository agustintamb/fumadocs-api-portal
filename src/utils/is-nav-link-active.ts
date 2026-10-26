export type NavLinkMatch = 'url' | 'nested-url'

function stripTrailingSlash(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

export function isNavLinkActive(
  pathname: string,
  url: string,
  match: NavLinkMatch,
): boolean {
  const current = stripTrailingSlash(pathname)
  const target = stripTrailingSlash(url)
  if (current === target) return true
  return match === 'nested-url' && current.startsWith(`${target}/`)
}
