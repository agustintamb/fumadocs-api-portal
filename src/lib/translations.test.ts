import { openapiTranslations } from 'fumadocs-openapi/i18n'
import { uiTranslations } from 'fumadocs-ui/i18n'
import { describe, expect, it } from 'vitest'
import { translations } from './translations'

describe('translations', () => {
  const values: Record<string, string | undefined> = translations.get()
  const keys = [...uiTranslations().keys, ...openapiTranslations().keys]

  it('gives every library key a non-empty value', () => {
    const missing = keys.filter((key) => !values[key]?.trim())

    expect(missing).toEqual([])
  })

  it('uses the fixed spanish values the e2e test asserts', () => {
    expect(values).toMatchObject({
      'Send(playground)': 'Enviar',
      'Query Parameters(operation page)': 'Parámetros de consulta',
      'Path Parameters(operation page)': 'Parámetros de ruta',
      'Header Parameters(operation page)': 'Parámetros de encabezado',
      'Request Body(operation page)': 'Cuerpo de la solicitud',
      'Response Body(operation page)': 'Cuerpo de la respuesta',
      'Authorization(playground)': 'Autorización',
      'On this page(table of contents)': 'En esta página',
      'Search(search trigger)': 'Buscar',
      'Server URL(playground server select)': 'URL del servidor',
      'Choose a file(playground)': 'Elegir un archivo',
      'Page Not Found(404 not found page)': 'Página no encontrada',
    })
  })
})
