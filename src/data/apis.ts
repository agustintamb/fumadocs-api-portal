export type ApiStatus = 'stable' | 'beta' | 'deprecated'

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
  category: string
  tags: string[]
  specs: ApiSpecRef[]
}

export interface ApiCardData extends ApiEntry {
  version: string
  endpoints: string
}

export const API_CATALOG: ApiEntry[] = [
  {
    id: 'petstore',
    name: 'Petstore API',
    description:
      'El clásico ejemplo Swagger Petstore. Operaciones CRUD de mascotas, inventario de la tienda y gestión de usuarios.',
    path: '/api-store/petstore',
    status: 'stable',
    category: 'Ejemplo',
    tags: ['pets', 'store', 'users'],
    specs: [{ label: 'v1.0.19', file: 'openapi.yaml' }],
  },
  {
    id: 'blog',
    name: 'Blog API',
    description:
      'Gestión de posts, comentarios y perfiles de autores. Permite paginar y filtrar por tag o autor. Versionada: v1 y v2 disponibles.',
    path: '/api-store/blog',
    status: 'stable',
    category: 'Contenido',
    tags: ['posts', 'comments', 'authors'],
    specs: [
      { label: 'v1', file: 'blog-api.yaml' },
      { label: 'v2', file: 'blog-api-v2.yaml' },
    ],
  },
  {
    id: 'auth',
    name: 'Auth API',
    description:
      'Servicio de autenticación con JWT. Registro, login, renovación de token, recuperación de contraseña y gestión del perfil.',
    path: '/api-store/auth',
    status: 'stable',
    category: 'Seguridad',
    tags: ['jwt', 'oauth', 'users'],
    specs: [{ label: 'v2.0.0', file: 'auth-api.yaml' }],
  },
  {
    id: 'portal',
    name: 'Portal API',
    description:
      'API propia del portal: catálogo de APIs, clientes, métricas del dashboard y suscripciones. Emite tokens JWT con un usuario demo para probar los endpoints privados.',
    path: '/api-store/portal',
    status: 'beta',
    category: 'Plataforma',
    tags: ['dashboard', 'subscriptions', 'jwt'],
    specs: [{ label: 'v1.0.0', file: 'portal-api.json' }],
  },
]
