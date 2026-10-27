export type ApiStatus = 'stable' | 'beta' | 'deprecated'

// Whether the API belongs to the company (internal) or is a third-party one (public). It says
// nothing about credentials.
export type ApiVisibility = 'internal' | 'public'

export interface ApiSpecRef {
  label: string
  file: string
}

export interface ApiEntry {
  id: string
  name: string
  description: string
  path: string
  status: ApiStatus
  visibility: ApiVisibility
  category: string
  tags: string[]
  specs: ApiSpecRef[]
}

export interface ApiCardData extends ApiEntry {
  version: string
  endpoints: string
  // First page of the API's docs; `path` is its folder, which has no page of its own.
  docsUrl: string
}

// Same catalog (order and values) as the backend's seed.sql in devportal-api.
export const API_CATALOG: ApiEntry[] = [
  {
    id: 'portal',
    name: 'Portal API',
    description:
      'API propia del portal: catálogo de APIs, clientes, métricas del dashboard y suscripciones. Emite tokens JWT con un usuario demo para probar los endpoints privados.',
    path: '/api-store/portal',
    status: 'beta',
    visibility: 'internal',
    category: 'Plataforma',
    tags: ['dashboard', 'subscriptions', 'jwt'],
    specs: [
      { label: 'v1', file: 'portal-api.json' },
      { label: 'v2', file: 'portal-api-v2.json' },
    ],
  },
  {
    id: 'petstore',
    name: 'Petstore API',
    description:
      'El clásico ejemplo de Swagger contra su servidor público: mascotas, tienda y usuarios, con escritura real (POST, PUT, DELETE) y sin credenciales. Versiones v2 y v3.',
    path: '/api-store/petstore',
    status: 'stable',
    visibility: 'public',
    category: 'Ejemplo',
    tags: ['pets', 'store', 'users'],
    specs: [
      { label: 'v2', file: 'petstore-v2.json' },
      { label: 'v3', file: 'petstore-v3.json' },
    ],
  },
  {
    id: 'pokeapi',
    name: 'PokeAPI',
    description:
      'Datos de Pokémon, movimientos, ítems y juegos desde la API pública PokeAPI. Solo lectura y sin credenciales.',
    path: '/api-store/pokeapi',
    status: 'stable',
    visibility: 'public',
    category: 'Datos abiertos',
    tags: ['pokemon', 'juegos', 'items'],
    specs: [{ label: 'v2.10.0', file: 'pokeapi.yaml' }],
  },
]
