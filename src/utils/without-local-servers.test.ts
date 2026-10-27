import { describe, expect, it } from 'vitest'
import { withoutLocalServers } from '@/utils/without-local-servers'

describe('withoutLocalServers', () => {
  it('drops localhost and 127.0.0.1 servers', () => {
    const document = {
      openapi: '3.1.0',
      servers: [
        { url: 'https://devportal-api.onrender.com', description: 'Producción' },
        { url: 'http://localhost:5080', description: 'Local' },
        { url: 'http://127.0.0.1:8080' },
      ],
    }

    expect(withoutLocalServers(document).servers).toEqual([
      { url: 'https://devportal-api.onrender.com', description: 'Producción' },
    ])
  })

  it('does not mutate the original document', () => {
    const document = { servers: [{ url: 'http://localhost:5080' }] }

    withoutLocalServers(document)

    expect(document.servers).toHaveLength(1)
  })

  it('returns documents without servers unchanged', () => {
    const document: { openapi: string; servers?: { url: string }[] } = {
      openapi: '3.1.0',
    }

    expect(withoutLocalServers(document)).toEqual(document)
  })
})
