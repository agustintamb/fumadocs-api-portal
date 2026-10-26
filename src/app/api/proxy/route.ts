import { petstore } from '@/lib/openapi'

export const { GET, HEAD, PUT, POST, PATCH, DELETE } = petstore.createProxy()
