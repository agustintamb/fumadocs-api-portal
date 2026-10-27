const LOCAL_HOST = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i

interface WithServers {
  servers?: { url: string }[]
}

/** Copy of an OpenAPI document without servers that point to the reader's own machine. */
export function withoutLocalServers<T extends WithServers>(document: T): T {
  if (!document.servers) return document
  return {
    ...document,
    servers: document.servers.filter((server) => !LOCAL_HOST.test(server.url)),
  }
}
