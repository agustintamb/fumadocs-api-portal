import { petstoreV3 } from '@/lib/openapi'

// No catalog API uses the proxy today; it stays available (server mode only) for APIs without CORS.
export const { GET, HEAD, PUT, POST, PATCH, DELETE } = petstoreV3.createProxy()
