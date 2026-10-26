export const es = {
  site: {
    title: 'Portal de APIs · Fumadocs',
    description:
      'Documentación interactiva de las APIs de GST: referencia, playground y ejemplos de código.',
    logoAlt: 'Portal de APIs',
  },
  nav: {
    home: 'Inicio',
    dashboard: 'Dashboard',
    docs: 'Documentación',
    apiStore: 'API Store',
  },
  footer: {
    label: 'Navegación del pie de página',
    pages: 'Páginas',
    docs: 'Documentación',
    introduction: 'Introducción',
    apis: 'APIs',
  },
  home: {
    eyebrow: 'Plataforma de APIs v2.0',
    title: 'Integraciones más rápidas con nuestras APIs',
    description:
      'Documentación interactiva, pruebas de endpoints en tiempo real e integración en minutos. Tres APIs disponibles: Petstore, Blog y Auth.',
    primaryAction: 'Explorar APIs',
    secondaryAction: 'Leer la documentación',
    clientsTitle: 'Equipos de todo el mundo confían en nosotros',
  },
  dashboard: {
    eyebrow: 'Resumen',
    title: 'Dashboard',
    browseApis: 'Explorar APIs',
    activityTitle: 'Actividad reciente',
    filtersLabel: 'Filtrar actividad por estado',
    filter: {
      all: 'Todas',
      success: 'Éxito',
      error: 'Error',
      pending: 'Pendiente',
    },
    empty: 'No hay actividad para este filtro.',
    backToStore: 'Volver al API Store',
    footerNote: {
      before:
        'Esta página es un componente React propio dentro de Fumadocs: estado local con ',
      state: 'useState',
      middle: ', navegación con ',
      router: 'next/navigation',
      after: ' y estilos con Tailwind CSS.',
    },
  },
  apiStore: {
    title: 'APIs disponibles',
    description:
      'Todas las referencias de APIs en un solo lugar. Cada API incluye documentación interactiva, esquemas de solicitud y respuesta, y un playground para probarla.',
    searchPlaceholder: 'Buscar APIs por nombre, descripción o tag…',
    searchLabel: 'Buscar APIs',
    filtersLabel: 'Filtrar por API',
    filter: {
      all: 'Todas',
    },
    empty: 'Ninguna API coincide con la búsqueda.',
    version: 'Versión',
    endpoints: 'Endpoints',
    viewDocs: 'Ver documentación →',
    status: {
      stable: 'estable',
      beta: 'beta',
      deprecated: 'obsoleta',
    },
    footerNote:
      'Esta página es un componente React propio dentro de Fumadocs, construido con Tailwind CSS y los tokens de tema de fumadocs-ui.',
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'La página que se busca no existe o se movió.',
    action: 'Volver al inicio',
  },
} as const
