'use client'
import { createOpenAPIPage } from 'fumadocs-openapi/ui'
import PlaygroundClient from '@/lab/components/openapi/playground'

// Same options as `OpenApiPage`. A custom `render` doesn't receive them, so they're passed again.
const playground = { fetchOptions: { requestTimeout: 90 } }

export const OpenApiLabPage = createOpenAPIPage({
  playground: { ...playground, render: () => <PlaygroundClient {...playground} /> },
})
