# Notas de la prueba de concepto

Notas sobre la versión Fumadocs del portal: qué se tradujo, qué funciona en el playground, qué
costó y qué falta respecto del sandbox de Zudoku.

Versiones: Next.js 16, Fumadocs (core/ui/mdx) 16 y fumadocs-openapi 12.5.5.

## Catálogo actual

El API Store publica la **Portal API** (propia, v1 y v2, specs de `npm run spec:sync`), **Petstore**
(v2 y v3, contra el servidor público de Swagger) y **PokeAPI** (v2.10.0); las dos de terceros son
specs vendorizadas con `npm run spec:vendor`. Cómo se agrega una API (JSON o YAML, propia o
vendorizada) está en el [README](README.md#cómo-agregar-una-api).

Ninguna usa el proxy: las tres permiten CORS y el playground las llama directo, también desde
GitHub Pages. El proxy (`/api/proxy`) sigue disponible en modo servidor como opción para una API
sin CORS (`proxyUrl` en `src/lib/openapi.ts`).

Hasta el 27/10/2026 el catálogo era el del sandbox de Zudoku (Petstore 1.0.19, Blog v1/v2 y
Auth). Los hallazgos de esa etapa quedan abajo como registro, marcados "(API ya eliminada)".

## Qué se tradujo

- **Textos propios** (Inicio, Dashboard, API Store, navegación, footer, página 404): en español,
  centralizados en `src/i18n/es.ts` y `src/data/`.
- **Textos de Fumadocs UI y fumadocs-openapi**: en español mediante `src/lib/translations.ts`
  (más de 200 claves de fumadocs-ui y fumadocs-openapi). El archivo usa `satisfies` contra el tipo de la librería, así que el typecheck
  falla si una versión nueva agrega claves sin traducir. Ejemplos: "Enviar", "Parámetros de
  consulta", "Autorización", "Autorizar", "Alcances", "Implícito", "Solicitud de ejemplo",
  "Respuesta de ejemplo", "URL del servidor", "400 Solicitud incorrecta".
- **Contenido de las especificaciones** (títulos de tags, descripciones de operaciones y campos):
  queda en inglés a propósito: las specs de terceros (`apis/petstore-*.json`, `apis/pokeapi.yaml`)
  son las del proveedor, solo con los `servers` ajustados. La excepción es la Portal API
  (`apis/portal-api.json` y `apis/portal-api-v2.json`), cuya spec ya viene en español desde el
  backend.

Algunas traducciones fueron decisiones de criterio (por ejemplo "Sección" para el disparador de
pestañas del layout, "Layout Tab" en el original). Están todas en `src/lib/translations.ts` para revisarlas en un solo lugar.

## Qué quedó en inglés

| Texto                                                                                            | Dónde aparece                                                 | Por qué                                                                                                           |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Authorization`                                                                                  | Etiqueta de la fila de autenticación del playground           | Es el nombre del header HTTP; la librería lo escribe fijo en el código (`auth.js`), no pasa por las traducciones. |
| `header`                                                                                         | Chip de ubicación del parámetro de autenticación              | Fijo en la librería; además es el valor técnico (`in: header`).                                                   |
| `flow`, `client_id`, `authorization_url`, `redirect_uri`                                         | Panel de OAuth2                                               | Nombres de campos de OAuth2 escritos fijos en la librería.                                                        |
| `body`, `response`                                                                               | Raíz del esquema en la referencia                             | Etiquetas fijas en la librería (`operation/index.js`).                                                            |
| `string`, `integer`, `array<…>`, `unknown`                                                       | Tipos de los campos                                           | Notación de tipos de JSON Schema; se dejan como literales técnicos.                                               |
| `TypeScript`                                                                                     | Botón para copiar el tipo                                     | Fijo en la librería (`copy-typescript.js`).                                                                       |
| `cURL`, `JSON`, `Bearer <token>`, `Basic <token>`, `Ctrl`                                        | Ejemplos de código, selector de formato, placeholders y atajo | Nombres propios, formatos o valores literales de headers.                                                         |
| `Callbacks`, `Cookies`, `OK`                                                                     | Secciones y respuestas de la referencia                       | Se dejaron en inglés en `translations.ts` porque son términos técnicos habituales.                                |
| Mensaje de error del proxy (`[Proxy] The host "localhost" doesn't resolve to a public address…`) | Respuesta al enviar una solicitud a un host privado           | Lo genera `createProxy` de fumadocs-openapi; no tiene hook de traducción.                                         |

Capturas:

- Fila de autenticación con `Authorization` y `header`:
  [`docs/screenshots/gap-playground-auth.png`](docs/screenshots/gap-playground-auth.png)
- Campos de OAuth2 con nombres en inglés:
  [`docs/screenshots/gap-oauth-fields.png`](docs/screenshots/gap-oauth-fields.png)
- Referencia de Petstore (`body`, `response`, tipos y contenido de la spec):
  [`docs/screenshots/petstore-light.png`](docs/screenshots/petstore-light.png)

El smoke test (`e2e/smoke.spec.ts`) comprueba que no aparezcan visibles "Authorize", "Send",
"Scopes", "Implicit" ni "Path". La ausencia de "Authorization" se comprueba solo dentro del panel
de OAuth2, porque fuera de él aparece como nombre de header.

## Funciones del playground

Verificadas a mano con Playwright contra el build de producción.

| Función                         | Estado | Nota                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API key                         | ✅     | En Petstore (`getPetById`) el selector ofrece `api_key` y `petstore_auth`. Con `api_key` el valor se manda como header (`-H 'api_key: …'` en el cURL y en los demás lenguajes).                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Bearer                          | ⚠️     | Funciona en Blog (API ya eliminada; `bearerAuth`): el header queda `Authorization: Bearer <token>`. El campo viene precargado con `Bearer ` y el token hay que agregarlo a continuación; si se borra todo y se pega solo el token, el prefijo se pierde.                                                                                                                                                                                                                                                                                                                                               |
| OAuth2 implícito                | ✅     | Panel en español ("Implícito", "Alcances", "Autorizar"). Redirige a `authorizationUrl` con `response_type=token`, los alcances elegidos y `redirect_uri` a la misma página; al volver con `#access_token=…` el playground se reabre con `Authorization: Bearer <token>`. Probado con un proveedor simulado: el de petstore3 no es real.                                                                                                                                                                                                                                                                |
| Upload `binary` (`uploadImage`) | ❌     | No aparece el selector de archivo. fumadocs-openapi pasa las specs 3.0 por `@scalar/openapi-upgrader`, que al convertirlas a 3.1 quita `type: string` / `format: binary` del cuerpo `application/octet-stream`. El playground solo muestra "Elegir un archivo" para `string` + `binary`, así que el cuerpo queda como `unknown` y el cURL manda `-d '{}'`. Captura: [`docs/screenshots/gap-upload-image.png`](docs/screenshots/gap-upload-image.png). Una salida posible es un campo propio con la opción `renderBodyField` del playground; no se hizo para no tocar la spec ni sumar código a medida. |
| Selección de servidor           | ✅     | Blog (API ya eliminada) ofrece Production y Staging en el popover "URL del servidor"; al cambiarlo se actualizan la URL y los ejemplos. El server del Petstore del sandbox (API ya eliminada) era relativo (`/api/v3`), así que el playground lo resuelve contra el origen del portal y los ejemplos estáticos muestran `https://example.com/api/v3`.                                                                                                                                                                                                                                                  |
| Ejemplos de código              | ✅     | cURL, JavaScript, Go, Python, Java, C# y Rust, bajo "Solicitud de ejemplo" y "Respuesta de ejemplo".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

Envío de solicitudes: hoy ninguna API del catálogo pasa por `/api/proxy` (ver
[Catálogo actual](#catálogo-actual)). Con el catálogo del sandbox, todas salvo la Portal API
usaban el proxy (`createProxy` de fumadocs-openapi) para evitar CORS. El proxy rechaza hosts
privados (por eso el Petstore del sandbox, con server relativo, devolvía 400 desde localhost) y
acepta cualquier host público; para producción convendría limitarlo con `allowedOrigins`. La
respuesta se muestra en español ("Cuerpo", "Encabezados").

**Portal API sin proxy**: la API propia (`portalApiV1` y `portalApiV2` en `src/lib/openapi.ts`) se registra sin
`proxyUrl`, así el playground llama directo desde el navegador. Con el proxy, el servidor "Local"
(`http://localhost:5080`) no funcionaría porque el proxy rechaza hosts privados; además la API ya
permite CORS desde el portal (`localhost:3000`, `localhost:3100` y GitHub Pages), y en Pages no
hay proxy porque el sitio es estático. Verificado con Playwright contra `npm run dev` y la API
local: con el servidor "Local", `POST /auth/token` con el usuario demo devuelve el token; en la
sección "Autorización" (esquema `bearerAuth`) el campo viene con `Bearer ` (con el espacio) y se completa con el
token; `GET /dashboard/stats` responde 200.

## Build estático para GitHub Pages

`npm run build:pages` (ver el README) genera `out/` con `output: 'export'`. Lo que se resolvió:

- **Proxy**: Next falla el export si existe `src/app/api/proxy/` (un route handler que necesita
  servidor), y `dynamic` no puede depender de una variable de entorno. El script mueve la carpeta
  afuera durante el build y la restaura en un `finally`. Sin proxy, el playground llama directo a
  cada servidor; las tres APIs del catálogo permiten CORS. Con el catálogo del sandbox (APIs ya
  eliminadas), Petstore, Blog y Auth podían fallar por CORS y Petstore, con server relativo
  (`/api/v3`), apuntaba al propio sitio de Pages.
- **Tipos de rutas viejos**: `.next/types` y `.next/dev/types` (de `next build`/`next dev`)
  siguen apuntando a `api/proxy/route.js` y el chequeo de tipos del build falla; el script los
  borra antes (se regeneran solos).
- **Búsqueda**: `/api/search` exporta `staticGET` con `dynamic = 'force-static'` y el
  `RootProvider` usa `type: 'static'`, así el índice es un JSON (`out/api/search`) y se busca en el
  navegador, en ambos modos. El `api` va con el `basePath` explícito porque fumadocs-core toma la
  base de `import.meta.env.BASE_URL` (Vite) y en Next cae a `/`.
- **Redirecciones**: con Next 16.4, `redirect()` en el cuerpo de una página prerenderizada deja un
  shell `__next_error__` que solo redirige cuando carga el JS; lanzado dentro de un `<Suspense>`,
  Next agrega además `<meta http-equiv="refresh" content="1;url=/fumadocs-api-portal/…">`.
  `PageRedirect` usa `redirect()` directo en modo servidor (307, como antes con
  `next.config.mjs`) y la variante con `Suspense` en el export. Las carpetas (`/docs`,
  `/api-store/portal`, …) se suman a `generateStaticParams` para que tengan su `index.html`.
- **Prefetch en Windows**: al exportar en Windows, Next 16.4 guarda los datos de prefetch por
  segmento en subcarpetas (`__next.!KGRvY3Mp\$c$slug\__PAGE__.txt`) en lugar de un archivo con
  puntos (`__next.!KGRvY3Mp.$c$slug.__PAGE__.txt`), porque arma la ruta con `path.relative` y
  después reemplaza solo `/`. Al servir ese `out/`, los prefetch dan 404 y la navegación igual
  funciona (carga la página completa). En Linux, donde corre el deploy, los nombres salen bien.
- `out/` está en `.gitignore`; después de `build:pages`, `git status` queda limpio.

## Prueba conjunta con la Portal API

`e2e/portal-api.spec.ts` (con `PORTAL_API=1`, ver el README) recorre el playground como lo haría
una persona: despierta la API (`GET /health`, hasta 90 s por el arranque en frío de Render,
porque el playground corta cada solicitud a los 10 s), pide un token con `demo` / `demo1234`,
autoriza `GET /dashboard/stats` y ve el 200 con
"Solicitudes totales", y crea (`POST /subscriptions`, 201) y cancela (`DELETE`, 204) una
suscripción a Petstore. Antes borra por API una suscripción a Petstore que pudiera haber
quedado de una corrida fallida, porque crearla de nuevo daría 409. Usa la v1 de la Portal API
y las rutas son relativas
(`api-store/portal/v1/...`) para que funcionen bajo `/fumadocs-api-portal/`, y la prueba verifica
que el servidor preseleccionado sea el del entorno: "Local" (`http://localhost:5080`) en el
build local y "Producción" (`https://devportal-api.onrender.com`) en Pages.

Resultado del 27/10/2026: en verde contra el build local con la API en `localhost:5080` y contra
GitHub Pages con la API en Render.

### Checklist manual

Hecho con scripts de Playwright (Chromium headless) contra Pages y contra el build local en el
puerto 3100. Es un registro del 27/10/2026, previo al catálogo actual: las rutas de Blog y Auth
ya no existen y las de la Portal API pasaron a `/api-store/portal/v1/…` y `/api-store/portal/v2/…`.

| Ítem                                          | Resultado | Cómo se verificó                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Búsqueda en Pages                             | ✅        | Con el botón "Buscar" del header, "token" devuelve 21 resultados; al elegir "Token operations" navega a `/fumadocs-api-portal/api-store/auth/tokens/` (Auth, API ya eliminada). Igual en local.                                                                                                                                                                                                                                                                                                                         |
| Ctrl+K en `/home`                             | ✅        | Abre el diálogo de búsqueda en Pages y en local. En Playwright hay que mandar `Control+k`: con `Control+K` el evento llega con `key: 'K'` y Fumadocs compara `e.key === 'k'`, por eso una prueba anterior no lo abría. Con Bloq Mayús activado pasaría lo mismo con el teclado real (detalle de la librería).                                                                                                                                                                                                           |
| Cambio de versión del Blog (API ya eliminada) | ✅        | En `/api-store/blog/v2/comments` el selector muestra 2.0.0; al elegir 1.0.0 navega a `/fumadocs-api-portal/api-store/blog/v1/comments/` (y a `/api-store/blog/v1/comments` en local).                                                                                                                                                                                                                                                                                                                                   |
| Tema                                          | ✅        | "Cambiar tema" alterna entre claro y oscuro (clase `dark` en `<html>` y `theme` en `localStorage`) y la elección se mantiene al recargar. Pages y local.                                                                                                                                                                                                                                                                                                                                                                |
| Mobile (390 × 844)                            | ✅        | En `/api-store/portal/dashboard` el artículo ocupa el ancho (390 px, sin scroll horizontal); "Abrir barra lateral" muestra el árbol y navega a Suscripciones; el playground abre a pantalla completa con las pestañas "Solicitud" y "Respuesta". La URL del servidor queda recortada (`https:/…`), pero el selector funciona. Pages y local.                                                                                                                                                                            |
| 404                                           | ✅        | `/fumadocs-api-portal/no-existe` responde 404 con la página propia y el header; el logo lleva a `/fumadocs-api-portal/home/`. En local, 404 con el header y el logo a `/home`.                                                                                                                                                                                                                                                                                                                                          |
| URLs profundas y de carpeta en Pages          | ✅        | Desde una pestaña nueva, `/api-store/blog/v2/` (Blog, API ya eliminada) termina en `/api-store/blog/v2/posts/` y `/docs/` en `/docs/introduction/`; `/api-store/portal/dashboard` carga directo.                                                                                                                                                                                                                                                                                                                        |
| Cold start de Render desde el playground      | ⚠️        | Tras 16 min sin tráfico, `GET /health` desde el playground de Pages falla a los 10 s con "La solicitud falló · Client side error: [TimeoutError] signal timed out" y la sugerencia de revisar CORS o usar un proxy, que no es la causa. Al repetir con la API ya despierta responde 200 en ~1 s. El corte es el `requestTimeout` por defecto del playground de fumadocs-openapi (10 s); con una respuesta simulada de 8 s llega el 200 y con una de 20 s falla a los 10 s. Mientras espera, "Enviar" no se deshabilita. |

## Qué costó

- **Traducciones completas**: entre fumadocs-ui y fumadocs-openapi hay más de 200 claves y algunas solo se ven
  en estados puntuales del playground. El `satisfies` contra el tipo de la librería evita que
  falte alguna.
- **Un solo header en todo el sitio**: `SiteHeader` (`src/components/SiteHeader/`) es un
  componente propio (logo, links con `aria-current` vía `NavLink`, búsqueda y tema) que se conecta
  con el mecanismo oficial `slots.header` de `HomeLayout` y del `DocsLayout` Notebook. Docs y APIs
  siguen en Notebook con `nav.mode: 'top'` porque es el único layout de docs cuyo header puede
  ocupar todo el ancho arriba de la barra lateral. Detalles:
  - En Notebook el header ocupa toda la primera fila de la grilla y lleva
    `contain: inline-size`; sin eso su contenido ensancha las columnas externas y en mobile la
    página queda aplastada en una columna angosta.
  - El header declara `--fd-header-height` (variante `layout:` de Fumadocs) para que la barra
    lateral y el TOC sticky queden debajo.
  - Docs usa el mismo ancho que `HomeLayout` (`--fd-layout-width: 1400px`) para que el header se
    vea igual en todas las páginas.
  - En mobile el botón de menú de Inicio, Dashboard y API Store abre un popover con los links; en
    Docs y APIs abre el cajón de la barra lateral de Fumadocs, que muestra los links del navbar
    (items `on: 'menu'`) y la sección actual. El toggle de tema está siempre en el header, así
    que se desactiva el de Fumadocs (`themeSwitch.enabled: false`) para que no se repita en el
    cajón. Desde 768 px el header muestra los links y no hay botón de menú, igual en Inicio y
    Docs (entre 768 px y 1024 px la barra lateral de Docs también lista los links).
  - El botón para contraer la barra lateral de escritorio (nativo del header de Fumadocs) no
    está en el header propio; `Ctrl+B` (⌘+B) sigue contrayéndola. No se agregó UI nueva.
  - La página 404 (`not-found.tsx`) usa el mismo header (`HomeHeader`).
- **Selector de versión**: la barra lateral muestra solo la sección actual (carpetas `root`); a
  Docs y a las APIs se llega desde el navbar. Cada API tiene su propio tipo de `root` en
  `meta.json` (`"portal"` en v1 y v2, `"petstore"` en v2 y v3, `"pokeapi"`), así el desplegable de Fumadocs
  (`SidebarTabsDropdown`) agrupa solo las versiones de esa API. Las pestañas salen de
  `getVersionTabs` (`src/utils/get-version-tabs.ts`, una versión de `getLayoutTabs` que
  entiende las carpetas de endpoints) con el `info.version` de cada spec como
  título, leído con `getSchema()` de la primera página generada de cada carpeta (las páginas
  MDX no lo tienen, así Docs queda sin selector). El desplegable nativo del layout no se
  puede deshabilitar, así que se desactiva (`tabs={false}`) y el mismo componente se monta en el
  `banner` de la barra lateral (`src/components/VersionSelect/`) con `disabled` cuando la API
  tiene una sola versión; su nombre accesible incluye la versión ("Versión 2.10.0"). Al
  cambiar de versión, Fumadocs lleva a la página equivalente (`portal/v2/autenticacion` →
  `portal/v1/autenticacion`) o a la primera de la otra versión. Las versiones aparecen en el
  orden del `meta.json` de la API, que lista la más nueva primero.
- **Carpetas sin página**: `/api-store/portal`, `/api-store/pokeapi`, etc. no tienen página propia;
  se redirigen a la primera página de la carpeta (en `[...slug]/page.tsx`, con `flattenTree`). En
  las APIs con versiones es la más nueva (`/api-store/portal` → `/api-store/portal/v2/salud`).
- **Endpoints en la barra lateral** (como Zudoku): se mantiene una página por recurso (tag) y un
  plugin del loader (`src/lib/endpoints-plugin.tsx`, `transformPageTree`) convierte cada página
  generada en una carpeta cuyo índice es la página y cuyos hijos son links a las anclas de sus
  endpoints, con el `summary` y el verbo. Las anclas salen del `toc` de la página (mismo slugger
  que los `h2`) y los verbos de `getOpenAPIPageProps().operations`, en el orden del YAML. El
  plugin actúa en `folder()` porque `file()` solo puede devolver una página. `MethodLabel` de
  fumadocs-openapi no está en `exports`, así que `MethodBadge` (`src/components/MethodBadge/`)
  copia sus colores. Fumadocs despliega sola la carpeta de la página abierta. Como los links a
  anclas también son páginas del árbol, el pie "anterior / siguiente" de las páginas de API se
  arma con `findPageNeighbours` (`src/utils/`), que los saltea; si no, desde "Pet" el siguiente
  sería su propio primer endpoint.
- **Títulos cortos en la barra lateral**: Fumadocs no tiene un campo para eso. Se agregó
  `sidebarTitle` al frontmatter (con `zod`) y un plugin del loader que lo aplica.
- **Specs byte a byte**: con `core.autocrlf=true` en Windows, Git convertía los finales de línea.
  `.gitattributes` marca `apis/**` como `-text` para que queden idénticos al original; el resto del
  repo usa LF.
- **Detectar páginas de OpenAPI**: las páginas generadas se distinguen de las MDX con
  `'getOpenAPIPageProps' in data`.

## Qué falta respecto de Zudoku

- Subida de archivos `binary` en el playground (ver arriba).
- En la barra lateral no se resalta el endpoint visible al scrollear; solo queda resaltado el
  recurso (la página abierta).
- Algunos textos fijos de la librería siguen en inglés (ver la tabla).
- En el cajón móvil de Docs y APIs los links del navbar marcan el activo con `data-active`, sin
  `aria-current`, porque son los items nativos de Fumadocs.
- El buscador del API Store busca en nombre, descripción y tags, como pide el spec. El ejemplo
  del plan de buscar "CONTENIDO" (categoría de la Blog API, ya eliminada) necesitaría buscar
  también por categoría; no se agregó ni se prueba en el smoke test.
- El buscador de la documentación (Orama) usa un tokenizador multilingüe y no distingue
  acentos ("pagina" encuentra "página"); no hace falta configurarlo.
- La página 404 de la raíz (`src/app/not-found.tsx`) no está dentro de ningún layout: la barra
  superior aparece recién después de la hidratación y, con JavaScript desactivado, la respuesta es
  un shell `__next_error__` vacío.
- Fumadocs no tiene un token de radio de borde; los componentes propios usan `rounded-lg`.

## Alternativas previstas en el plan (plan original, Tasks 3 y 4)

- **Task 3**: el plan preveía mover `introduction.mdx` a la raíz si una carpeta `(grupo)` no
  podía ser raíz. Después se movió a `content/docs` (URL `/docs/introduction`), con `root: true`.
- **Task 4**: el plan preveía un ajuste mínimo si la colección de contenido rechazaba carpetas
  que solo tienen `meta.json`. Tampoco hizo falta.
- Desvío que sí se tomó: `generateMetadata` devolviendo `{}` en lugar de `notFound()` cuando la
  URL es una carpeta, para que la redirección a la primera página no termine en 404.

## Otros detalles

- `content/meta.json` tiene el título "Portal de APIs" para que la búsqueda no muestre la raíz
  como "Docs".
- El build muestra advertencias de CSS sobre `::highlight`; vienen de los estilos de la librería
  y no afectan el resultado.
- Si queda una carpeta `.next/` vieja, `tsc` puede fallar por tipos generados de rutas que ya no
  existen. Se resuelve borrando `.next/`.
- Vitest a veces falla en frío por timeout de un worker; al volver a correrlo pasa.
- El logo es simulado (`src/components/SiteLogo/`): un círculo con degradé en el violeta del tema
  y el texto "Fumadocs". `es.site.title` ("Portal de APIs · Fumadocs") se mantiene para el
  `<title>` de las páginas; el header muestra solo "Fumadocs".
- Las capturas en modo claro y oscuro están en `docs/screenshots/`.
