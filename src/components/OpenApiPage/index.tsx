'use client'
import { createOpenAPIPage } from 'fumadocs-openapi/ui'

// The default 10 s request timeout cuts off the Portal API while Render wakes it up (~1 min).
export const OpenApiPage = createOpenAPIPage({
  playground: { fetchOptions: { requestTimeout: 90 } },
})
