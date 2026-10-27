import { describe, expect, it } from 'vitest'
import { selectServers } from '@/utils/select-servers'

const document = {
  openapi: '3.1.0',
  servers: [
    { url: 'https://devportal-api.onrender.com', description: 'Producción' },
    { url: 'http://localhost:5080', description: 'Local' },
  ],
}

describe('selectServers', () => {
  it('keeps only the environment url, with its description from the spec', () => {
    expect(selectServers(document, 'https://devportal-api.onrender.com').servers).toEqual(
      [{ url: 'https://devportal-api.onrender.com', description: 'Producción' }],
    )
  })

  it('puts the environment url first and keeps the rest when asked', () => {
    expect(
      selectServers(document, 'http://localhost:5080', { keepOthers: true }).servers,
    ).toEqual([
      { url: 'http://localhost:5080', description: 'Local' },
      { url: 'https://devportal-api.onrender.com', description: 'Producción' },
    ])
  })

  it('adds an environment url that the spec does not list', () => {
    expect(selectServers(document, 'https://staging.example.com/').servers).toEqual([
      { url: 'https://staging.example.com' },
    ])
  })

  it('does not mutate the original document', () => {
    selectServers(document, 'http://localhost:5080')

    expect(document.servers).toHaveLength(2)
  })
})
