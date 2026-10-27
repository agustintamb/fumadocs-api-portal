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

// Same values as the backend's /dashboard endpoints (devportal-api: DashboardEndpoints.cs, seed.sql).
export const STATS: Stat[] = [
  { label: 'Solicitudes totales', value: '1.284', detail: '+12 % esta semana' },
  { label: 'Tasa de éxito', value: '97,3 %', detail: '+0,5 % frente a la semana pasada' },
  { label: 'APIs integradas', value: '3', detail: 'Portal · Petstore · PokeAPI' },
  { label: 'Latencia promedio', value: '84 ms', detail: 'p95: 210 ms' },
]

export const ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    action: 'GET /api/v2/pokemon/pikachu',
    api: 'PokeAPI',
    time: 'hace 2 min',
    status: 'success',
  },
  {
    id: 2,
    action: 'POST /auth/token',
    api: 'Portal API',
    time: 'hace 5 min',
    status: 'success',
  },
  {
    id: 3,
    action: 'POST /pet',
    api: 'Petstore',
    time: 'hace 12 min',
    status: 'success',
  },
  {
    id: 4,
    action: 'DELETE /pet/5',
    api: 'Petstore',
    time: 'hace 1 h',
    status: 'error',
  },
  {
    id: 5,
    action: 'GET /v2/apis',
    api: 'Portal API',
    time: 'hace 2 h',
    status: 'pending',
  },
]
