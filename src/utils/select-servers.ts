interface Server {
  url: string
  description?: string
}

export interface SelectServersOptions {
  /** Keep the spec's other servers after the environment one. */
  keepOthers?: boolean
}

const normalizeUrl = (url: string) => url.replace(/\/+$/, '')

/** Copy of an OpenAPI document whose servers start with (or only contain) the environment's API url. */
export function selectServers<T extends { servers?: Server[] }>(
  document: T,
  environmentUrl: string,
  { keepOthers = false }: SelectServersOptions = {},
): T {
  const url = normalizeUrl(environmentUrl)
  const servers = document.servers ?? []
  const current = servers.find((server) => normalizeUrl(server.url) === url) ?? { url }
  const others = keepOthers
    ? servers.filter((server) => normalizeUrl(server.url) !== url)
    : []
  return { ...document, servers: [current, ...others] }
}
