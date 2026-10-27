# Personalización del playground y autenticación

Relevamiento de `fumadocs-openapi` **12.5.5** (versión instalada en `node_modules`; también es la
última publicada al 27/10/2026), con `fumadocs-ui`/`fumadocs-core` 16.17.8. Rutas de la librería
relativas a `node_modules/fumadocs-openapi/dist/`.

Leyenda: ✅ probado en la PoC · 📄 confirmado en el código, no probado · ❌ no se puede (sin copiar
el código).

## Puntos de entrada

Todo se configura en `createOpenAPIPage()` (`src/components/OpenApiPage/index.tsx`, componente
cliente, así que acepta funciones). `createOpenAPI()` (`src/lib/openapi.ts`, servidor) solo define
specs, caché, `proxyUrl` e `includeDocument`; no toca la UI.

| Opción de `createOpenAPIPage`                                                                            | Qué cambia                                                                                       | Tipo en la librería                   |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------- |
| `content.renderOperationLayout(slots)`                                                                   | Orden y presencia de las partes de cada operación (`header`, `description`, `apiPlayground`, …). | `utils/create-page.d.ts:139`          |
| `content.renderAPIExampleLayout`, `renderAPIExampleUsageTabs`, `renderRequestTabs`, `renderResponseTabs` | Columna derecha: ejemplos de código y de respuesta.                                              | `utils/create-page.d.ts:115-134`      |
| `showResponseSchema`, `schemaUI.showExample`                                                             | Mostrar u ocultar el esquema de respuesta / ejemplos bajo los esquemas.                          | `utils/create-page.d.ts:110,176`      |
| `codeUsages`, `generateCodeSamples` (o `x-codeSamples` en la spec)                                       | Lenguajes de los ejemplos de código.                                                             | `utils/create-page.d.ts:43-47`        |
| `components` (`Operation`, `SchemaUI`, `Markdown`, `CodeBlock`, `Heading`, `Layout`)                     | Reemplazar piezas enteras de la página.                                                          | `utils/create-page.d.ts:191-199`      |
| `playground.enabled` / `playground.render`                                                               | Quitar el playground (queda la barra del endpoint) o reemplazarlo por uno propio.                | `utils/create-page.d.ts:75-84`        |
| `playground.renderParameterField` / `renderBodyField`                                                    | Input propio para un parámetro o para el cuerpo (con `Custom.useController`).                    | `ui/playground/client.d.ts:33-39`     |
| `playground.authProviders` / `transformAuthInputs`                                                       | Filas propias de un esquema de seguridad / valores por defecto de los campos de auth.            | `playground/use-playground.d.ts:7-11` |
| `playground.components.ResultDisplay`                                                                    | Cómo se muestra la respuesta o el error.                                                         | `ui/playground/client.d.ts:23`        |
| `playground.fetchOptions` (`requestTimeout`, `onRequestInit`, `proxyUrl`, `proxyForwardCookie`)          | Cómo se envía la solicitud.                                                                      | `playground/fetcher.d.ts:34-50`       |
| `mediaAdapters`, `storageKeyPrefix`, `oauthRedirectUrl`                                                  | Otros tipos de contenido, prefijo de `sessionStorage`, redirect OAuth.                           | `utils/create-page.d.ts:25-41`        |

Además:

- **Textos**: todas las etiquetas pasan por `src/lib/translations.ts` (notas `playground`,
  `operation page`, `OAuth dialog`). Quedan fijos en inglés el mensaje `Client side error: …`
  (`playground/fetcher.js:73`) y los labels OAuth `client_id`, `client_secret`, `token_url`, etc.
- **Estilos**: solo variables del tema (`--color-fd-*` en `src/app/global.css`, globales o en un
  scope). La librería **no** expone clases ni atributos `data-*` estables en el playground: para
  estilos puntuales hay que usar selectores estructurales (frágiles ante actualizaciones).
- **CLI**: `npx @fumadocs/cli add openapi/playground` (también `openapi/page`, `openapi/operation`,
  `api-docs/schema`) copia el componente al repo para editarlo; se conecta con
  `playground.render: () => <PlaygroundClient />`. `npx @fumadocs/cli customise` (con "s") es
  para los layouts de fumadocs-ui, no para OpenAPI.
- **Lab**: copia del playground (CLI, sin cambios) en `src/lab/components/openapi/playground`,
  usada solo por la ruta oculta `/lab/portal/v1/...` y `/lab/portal/v2/...` (`src/app/(lab)`).
  Se quita borrando `src/app/(lab)` y `src/lab`.

## Qué se puede hacer por zona

Est. = estilizar · Reempl. = reemplazar · Reord. = reordenar · Ocult. = ocultar.

| Zona                                               | Est.                 | Reempl.                                         | Reord.                      | Ocult.                                              | Fijo (sin copiar el código)                                                                                         |
| -------------------------------------------------- | -------------------- | ----------------------------------------------- | --------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Encabezado de la operación (título, método, URL)   | ✅ tema              | 📄 `components.Heading`, slot `header`          | ✅ `renderOperationLayout`  | 📄 `renderOperationLayout`                          | Barra método + ruta + botón "Probar en el playground" (`ui/components/endpoint.js`)                                 |
| Diálogo: barra de URL y "Enviar"                   | ✅ tema / CSS scoped | ❌                                              | ❌                          | ❌                                                  | `ui/playground/components/url-bar.js`, tamaño del diálogo en `ui/playground/client.js:53`                           |
| Selector de servidor                               | ✅ tema              | ❌                                              | ❌                          | 📄 sin `servers` muestra solo la URL                | Contenido = `servers` de la spec (`src/utils/select-servers.ts`); UI en `ui/playground/components/server-select.js` |
| Diálogo: sección **"Autorización"**                | ✅ tema / CSS scoped | 📄 filas por esquema con `authProviders.render` | ❌                          | ❌ (aparece si la operación tiene `security`)       | Orden Autorización → Ruta → Consulta → Encabezado → Cookies → Cuerpo (`request-panel.js:80-115`)                    |
| Diálogo: parámetros (Ruta, Consulta, Encabezado)   | ✅ tema / CSS scoped | ✅ `renderParameterField` por campo             | ❌                          | 📄 un campo: `renderParameterField` devuelve `null` | Encabezado de cada sección y su contador (`request-panel.js:92-113`)                                                |
| Diálogo: cuerpo                                    | ✅ tema              | 📄 `renderBodyField`                            | ❌                          | ❌                                                  | Selector Formulario/JSON (`request-panel.js` `BodySection`)                                                         |
| Diálogo: respuesta                                 | ✅ tema              | ✅ `components.ResultDisplay`                   | ❌                          | ❌                                                  | Panel "Solicitud" (código) arriba y respuesta abajo (`ui/playground/components/response-panel.js`)                  |
| Página: secciones Autorización, Parámetros, Cuerpo | ✅ tema              | 📄 `components.SchemaUI` / `Operation`          | ✅ `renderOperationLayout`  | ✅ `renderOperationLayout`, `showResponseSchema`    | Contenido de cada sección (`ui/operation/index.js`)                                                                 |
| Ejemplos de código (columna derecha)               | ✅ tema              | 📄 `renderAPIExampleLayout` / `UsageTabs`       | 📄 `renderAPIExampleLayout` | 📄 omitir `apiExample` en `renderOperationLayout`   | —                                                                                                                   |
| Playground completo                                | —                    | 📄 `playground.render` (o copia por CLI)        | ✅ slot `apiPlayground`     | 📄 `playground.enabled: false`                      | —                                                                                                                   |

Fragmentos mínimos (probados en el spike):

```tsx
// Reordenar u ocultar partes de cada operación
content: {
  renderOperationLayout: (slots) => (
    <div className="flex flex-col gap-4">
      {slots.header}
      {slots.description}
      {slots.apiPlayground}
      {slots.parameters}
      {slots.body}
      {slots.responses}
      {slots.apiExample}
    </div> // sin authSchemes ni callbacks
  ),
},
// Campo propio y valor por defecto de un esquema
playground: {
  renderParameterField: (fieldName, param) =>
    param.name === 'status' ? <StatusChips fieldName={fieldName} /> : undefined,
  transformAuthInputs: (fields) =>
    fields.map((f) => (f.schemeId === 'apiKeyAuth' ? { ...f, defaultValue: 'demo-api-key' } : f)),
},
```

```tsx
function StatusChips({ fieldName }: { fieldName: FieldKey }) {
  const { value, setValue } = Custom.useController(fieldName) // de 'fumadocs-openapi/ui/playground/client'
  // …botones que llaman a setValue('sold')
}
```

```css
/* Colores y espaciado solo dentro del diálogo del playground (selector estructural) */
[role='dialog']:has(form button[type='submit']) {
  --color-fd-primary: hsl(160 84% 30%);
}
[role='dialog']:has(form button[type='submit']) section > div:first-child {
  height: 3rem;
}
```

## Spike (`spike/playground`, rama local, sin merge)

Build de producción en `:3100` y verificación con Playwright headless.

| Caso                                                                                                               | Resultado                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reordenar/ocultar: `renderOperationLayout` con una nota propia antes del playground, sin `authSchemes`/`callbacks` | ✅ La nota queda arriba del botón; la página no tiene la sección "Autorización".                                                                                              |
| Campo propio: chips para `status` (Petstore v3 `findPetsByStatus`) + API key precargada (`transformAuthInputs`)    | ✅ Chips en la sección "Consulta"; elegir `sold` actualiza el cURL (`status=sold`). En `/api-store/portal/v1/uso` el campo `X-API-Key` aparece con `demo-api-key` y se envía. |
| Colores/espaciado: CSS con scope en el diálogo                                                                     | ✅ "Enviar" e íconos en verde (`rgb(12, 141, 98)`), encabezados de sección de 48 px con fondo de acento; el resto del sitio sin cambios.                                      |
| Timeout + mensaje propio (`fetchOptions.requestTimeout: 60`, `components.ResultDisplay`)                           | ✅ Respuesta demorada 15 s (simulada) → `200 OK` a los 15,5 s; con el valor por defecto falla a los 10 s (Task 10).                                                           |

## Timeout de las solicitudes (arranque en frío de Render)

- El playground corta cada solicitud a los **10 s** (`requestTimeout = 10` en
  `playground/fetcher.js:14`). En Render (free) la API puede tardar ~1 min en despertar, y el
  playground muestra "La solicitud falló · Client side error: [TimeoutError] signal timed out" más
  una pista sobre CORS/proxy que confunde.
- **Se puede subir** desde `createOpenAPIPage` (no desde `createOpenAPI`): `use-playground.js:146`
  pasa `fetchOptions` al fetcher. Valor en segundos; `false` lo desactiva. **Aplicado**: el portal
  usa 90 s para todas las APIs (`src/components/OpenApiPage/index.tsx`).

```tsx
export const OpenApiPage = createOpenAPIPage({
  playground: { fetchOptions: { requestTimeout: 90 } },
})
```

- El pedido de token OAuth (`playground/auth.js:124`, `postForm`) no tiene timeout propio.
- Mensaje más claro: envolver `DefaultResultDisplay` en `components.ResultDisplay` y agregar un
  aviso cuando `data.type === 'client_error'` y el mensaje contiene `TimeoutError` (probado en el
  spike).
- Mientras espera, "Enviar" sí queda deshabilitado (`panels.js:299`), pero solo baja la opacidad al
  80 %, por eso parece activo.

## Autenticación

Parte de [`autenticacion-apis.md`](../../docs/research/autenticacion-apis.md) y su evidencia
[`autenticacion-evidencia.md`](../../docs/research/autenticacion-evidencia.md) (carpeta
`devportal-poc/docs/research`, fuera de este repo). Estado de cada fila de Fumadocs con lo probado
en esta PoC (Task 11 contra la Portal API local, más `NOTES.md`):

| Esquema / función                    | Fumadocs 12.5.5                                            | Estado                                                                                                                                                                                                                                                                                                |
| ------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API key en header                    | ✅                                                         | ✅ Verificado: `GET /usage` con `X-API-Key: demo-api-key` → 200, directo a la API (sin proxy). También Petstore `api_key`.                                                                                                                                                                            |
| API key en query                     | ✅                                                         | 📄 Mismo código que header.                                                                                                                                                                                                                                                                           |
| API key en cookie                    | ⚠️ solo con proxy                                          | 📄 Sin verificar; en Pages no hay proxy.                                                                                                                                                                                                                                                              |
| HTTP Basic                           | ✅                                                         | 📄 Sin endpoint de prueba.                                                                                                                                                                                                                                                                            |
| Bearer pegado                        | ⚠️ prefijo `Bearer ` precargado; si se borra, se pierde    | ✅ Verificado (`bearerAuth`, `GET /dashboard/stats` → 200, Task 10 e2e).                                                                                                                                                                                                                              |
| OAuth2 client credentials            | ✅                                                         | ✅ Verificado: `POST /oauth/token` con Basic (por defecto) y con credenciales en el body → token → `GET /subscriptions` 200. **Corrección:** sin `proxyUrl` el pedido de token va **directo** (el proxy solo se usa si está configurado). `tokenUrl` relativo se resuelve contra el servidor elegido. |
| Selección de scopes                  | ✅                                                         | ✅ Verificado: `subscriptions:read` marcado por defecto.                                                                                                                                                                                                                                              |
| Varios esquemas (OR)                 | ✅ selector                                                | ✅ Verificado: `bearerAuth` / `oauth2` en la sección "Autorización" de `GET /subscriptions`.                                                                                                                                                                                                          |
| Varios esquemas (AND)                | ✅                                                         | 📄 Sin caso en la spec.                                                                                                                                                                                                                                                                               |
| OAuth2 implicit                      | ✅                                                         | ✅ Verificado con un proveedor simulado (`NOTES.md`, "Funciones del playground").                                                                                                                                                                                                                     |
| OAuth2 password, code + PKCE, device | ✅                                                         | 📄 Sin IdP en la PoC.                                                                                                                                                                                                                                                                                 |
| OpenID Connect (discovery)           | ✅                                                         | 📄 Sin IdP en la PoC.                                                                                                                                                                                                                                                                                 |
| mTLS                                 | ❌ solo un aviso                                           | 📄                                                                                                                                                                                                                                                                                                    |
| Persistencia                         | `sessionStorage` por esquema; `clientId` en `localStorage` | 📄                                                                                                                                                                                                                                                                                                    |
| Hook para firmar (HMAC/JWS/DPoP)     | ⚠️ `onRequest` y `onRequestInit` no ven la URL             | 📄 Para firmar: copiar el playground (`add openapi/playground`) o firmar en un proxy propio (`createProxy`).                                                                                                                                                                                          |

En GitHub Pages los tres esquemas de la Portal API (Bearer, API key, client credentials) deberían
funcionar sin proxy (nada depende de `/api/proxy`) si `ALLOWED_ORIGINS` de la API incluye el
origen de Pages; en Pages solo Bearer quedó verificado (e2e de Task 10).
