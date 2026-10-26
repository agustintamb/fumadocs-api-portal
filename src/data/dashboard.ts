export type ActivityStatus = 'success' | 'error' | 'pending'
export type ActivityFilter = 'all' | ActivityStatus

export interface ActivityItem {
  id: number
  action: string
  api: string
  time: string
  status: ActivityStatus
}

export interface Stat {
  label: string
  value: string
  detail: string
}

export const STATS: Stat[] = [
  { label: 'Solicitudes totales', value: '1.284', detail: '+12 % esta semana' },
  { label: 'Tasa de éxito', value: '97,3 %', detail: '+0,5 % frente a la semana pasada' },
  { label: 'APIs integradas', value: '3', detail: 'Petstore · Blog · Auth' },
  { label: 'Latencia promedio', value: '84 ms', detail: 'p95: 210 ms' },
]

export const ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    action: 'GET /api/pets',
    api: 'Petstore',
    time: 'hace 2 min',
    status: 'success',
  },
  {
    id: 2,
    action: 'POST /auth/login',
    api: 'Auth API',
    time: 'hace 5 min',
    status: 'success',
  },
  {
    id: 3,
    action: 'GET /blog-api/posts',
    api: 'Blog API',
    time: 'hace 12 min',
    status: 'success',
  },
  {
    id: 4,
    action: 'DELETE /api/pet/5',
    api: 'Petstore',
    time: 'hace 1 h',
    status: 'error',
  },
  {
    id: 5,
    action: 'POST /blog-api/posts',
    api: 'Blog API',
    time: 'hace 2 h',
    status: 'pending',
  },
]
