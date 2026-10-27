# Portal de APIs · Fumadocs

Prueba de concepto de un **developer portal**: un sitio donde se publican APIs (con su
referencia generada desde OpenAPI y un playground para probarlas) junto con documentación
escrita en MDX. Está construido con **Next.js 16** y el ecosistema **Fumadocs**, y reproduce la
experiencia del sandbox de Zudoku con toda la interfaz en español.

Las notas de la evaluación (qué se tradujo, qué funciona en el playground, qué costó y qué falta
respecto de Zudoku) están en [`NOTES.md`](NOTES.md).

## Qué se puede hacer

- **Inicio, Dashboard y API Store**: páginas propias en React. El API Store es un catálogo con
  buscador y filtros por API.
- **Referencia de APIs** generada desde specs OpenAPI (Petstore, Blog v1/v2, Auth y Portal API):
  una página por recurso (tag); en la barra lateral cada recurso lista sus endpoints con el verbo
  HTTP.
- **Playground** en cada endpoint: completar parámetros, autenticarse (API key, Bearer, OAuth2
  implícito), elegir servidor y enviar la solicitud. También muestra ejemplos en cURL,
  JavaScript, Go, Python, Java, C# y Rust.
- **Selector de versión** por API, con el `info.version` de cada spec. Al cambiar de versión se
  va a la página equivalente.
- **Documentación en MDX** con componentes listos (callouts, tabs, pasos, tarjetas, etc.),
  separadores y links externos en la barra lateral.
- **Búsqueda** global (Ctrl+K) sobre documentación y referencia.
- **Tema claro/oscuro**, diseño responsive y un único header en todo el sitio.

## Requisitos

- Node 24
- npm 11

## Puesta en marcha

```bash
npm install
npm run dev
```

El portal queda disponible en http://localhost:3000 (la raíz redirige a `/home`).

En desarrollo, Next compila cada página la primera vez que se visita, así que la primera carga
tarda. Para ver la velocidad real: `npm run build && npm start`.

## Comandos

| Comando               | Qué hace                                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `npm install`         | Instala las dependencias.                                                                                                          |
| `npm run dev`         | Levanta el servidor de desarrollo en http://localhost:3000.                                                                        |
| `npm run build`       | Genera el build de producción.                                                                                                     |
| `npm run build:pages` | Genera el export estático para GitHub Pages en `out/` (ver [Build estático para GitHub Pages](#build-estático-para-github-pages)). |
| `npm run start`       | Sirve el build de producción (requiere `npm run build` antes).                                                                     |
| `npm test`            | Corre los tests unitarios (Vitest).                                                                                                |
| `npm run test:e2e`    | Corre el smoke test de Playwright. Hace el build y levanta el servidor en el puerto 3100 si no hay uno corriendo ahí.              |
| `npm run lint`        | Corre ESLint.                                                                                                                      |
| `npm run typecheck`   | Genera los tipos de Next (`next typegen`) y corre `tsc --noEmit`.                                                                  |
| `npm run spec:sync`   | Copia la spec de la Portal API desde `../devportal-api/openapi/portal-api.json` a `apis/portal-api.json`.                          |

Otros scripts: `lint:fix`, `format`, `format:check` y `test:watch`.

La primera vez que se corren los tests e2e hace falta instalar el navegador:
`npx playwright install chromium`.

Las capturas de `docs/screenshots/` (evidencia para `NOTES.md`, la app no las usa) se regeneran
con la variable `SCREENSHOTS=1`:

```powershell
$env:SCREENSHOTS = '1'; npx playwright test e2e/screenshots.spec.ts
```

## Cómo funciona

### Next.js como base

Es una app de Next.js con **App Router**. Las rutas están en `src/app/` y se agrupan en dos
_route groups_, cada uno con su layout:

- `(home)`: Inicio, Dashboard y API Store. Usa el `HomeLayout` de Fumadocs (header + contenido a
  todo el ancho + footer propio).
- `(docs)`: documentación y referencia de APIs. Usa el `DocsLayout` **Notebook** de Fumadocs
  (header arriba, barra lateral, contenido y tabla de contenidos). Una sola ruta catch-all,
  `[...slug]/page.tsx`, renderiza todas estas páginas.

Además hay dos route handlers: `/api/search` (índice de búsqueda, generado en el build y
consultado en el navegador) y `/api/proxy` (proxy del playground). Las páginas se generan
estáticamente en el build (`generateStaticParams`). `/` e `/introduction` son páginas que
redirigen (componente `PageRedirect`), así funcionan igual en el servidor y en el export estático.

### Las piezas de Fumadocs

Fumadocs no es un sitio armado sino un conjunto de librerías que se integran en una app de Next.
Este proyecto usa cuatro:

| Paquete            | Rol                                                                                                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fumadocs-mdx`     | Lee los `.mdx` y `meta.json` de `content/`, valida su frontmatter (con `zod`) y los compila. Se conecta a Next con `createMDX()` en `next.config.mjs`; `defineDocs` (en `src/lib/source.ts`) define la colección.                                                                     |
| `fumadocs-core`    | El motor sin UI. Su `loader()` une varias fuentes de contenido en un único **page tree** (el árbol de la barra lateral) y resuelve URL → página. También provee la búsqueda (Orama), los plugins del loader y utilidades como `flattenTree`.                                          |
| `fumadocs-ui`      | La interfaz: layouts (`HomeLayout`, `DocsLayout` Notebook), página de docs (`DocsPage`, TOC, anterior/siguiente), componentes MDX, diálogo de búsqueda, tema claro/oscuro e i18n. En este proyecto es un alias de `@fumadocs/base-ui` (construido sobre Base UI + Tailwind CSS 4).    |
| `fumadocs-openapi` | Convierte specs OpenAPI en páginas: `createOpenAPI()` carga el YAML y `staticSource()` genera una página virtual por tag, que se suma al `loader()` como una fuente más. En el cliente, `createOpenAPIPage()` renderiza la referencia y el playground; `createProxy()` arma el proxy. |

El recorrido de una página es:

```text
content/*.mdx ──(fumadocs-mdx)──┐
                                ├─► loader() + plugins ─► page tree + páginas ─► [...slug]/page.tsx
apis/*.yaml ──(fumadocs-openapi)┘        (fumadocs-core)                          (fumadocs-ui)
```

1. `src/lib/source.ts` arma el `loader()` con la colección MDX y una fuente generada por cada
   spec. El orden y los títulos de la barra lateral salen de los `meta.json`.
2. Los plugins del loader ajustan el árbol: `sidebar-title` (títulos cortos), `endpointsPlugin`
   (endpoints con verbo bajo cada recurso), el de fumadocs-openapi (badges) y el de íconos Lucide.
3. `[...slug]/page.tsx` busca la página: si es OpenAPI renderiza `<OpenApiPage>`, si es MDX su
   contenido con los componentes de `src/components/mdx.tsx`. Si la URL es una carpeta sin página
   (`/docs`, `/api-store/blog`), redirige a su primera página; `generateStaticParams` también
   lista esas carpetas (`getFolderSlugs`) para que el export estático genere su redirección.
4. `src/app/(docs)/layout.tsx` pasa el árbol al `DocsLayout`, que dibuja la barra lateral. Las
   carpetas con `root` en `meta.json` son secciones: la barra lateral muestra solo la sección
   actual, y entre secciones se navega con el header.

### Otras librerías

- **Tailwind CSS 4**: estilos de los componentes propios y de Fumadocs (sus colores son
  variables `--color-fd-*`).
- **lucide-react**: íconos (también usables desde `meta.json` y frontmatter con `icon`).
- **geist**: tipografías Geist Sans y Mono.
- **yaml**: lee las specs (YAML o JSON) para el catálogo del API Store (versión y cantidad de
  endpoints).
- **zod**: esquema del frontmatter (`sidebarTitle`).
- **Vitest + Testing Library** (unitarios) y **Playwright** (e2e y capturas).

## Estructura

```text
apis/                       Specs OpenAPI (copias byte a byte; no se editan; portal-api.json sale de spec:sync)
content/
  meta.json                 Raíz del árbol
  docs/                     Documentación MDX + meta.json (orden, separadores, link externo)
  api-store/                Una carpeta por API con su meta.json (las páginas se generan)
src/
  app/
    page.tsx, introduction/ Páginas que redirigen a /home y a /docs/introduction
    (home)/                 Inicio, Dashboard y API Store: page.tsx + vista + hook + _components/
    (docs)/                 Layout Notebook y [...slug]/page.tsx (docs y referencia)
    api/search/, api/proxy/ Route handlers
    layout.tsx              RootProvider de Fumadocs (tema, búsqueda, traducciones)
    global.css              Tailwind + presets de Fumadocs + colores del tema
    not-found.tsx           Página 404
  components/               Componentes compartidos (SiteHeader, SiteLogo, VersionSelect, MethodBadge, ...)
  lib/                      source.ts, openapi.ts, endpoints-plugin.tsx, layout.shared.tsx, translations.ts
  utils/                    Funciones puras (con tests al lado)
  data/                     Datos de ejemplo (catálogo, dashboard, clientes, footer)
  i18n/es.ts                Textos propios de la interfaz
e2e/                        Smoke test y capturas (Playwright)
scripts/                    sync-spec.mjs (spec:sync) y build-pages.mjs (build:pages)
docs/screenshots/           Capturas referenciadas desde NOTES.md
```

## Rutas

| Ruta                                       | Contenido                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `/`                                        | Redirige a `/home`.                                                         |
| `/home`                                    | Landing con hero y carrusel de clientes.                                    |
| `/dashboard`                               | Estadísticas y actividad reciente filtrable.                                |
| `/api-store`                               | Catálogo de APIs con buscador y filtros.                                    |
| `/docs/introduction`                       | Introducción de la documentación; `/docs` y `/introduction` redirigen aquí. |
| `/docs/components`                         | Ejemplos de componentes de Fumadocs en MDX.                                 |
| `/docs/api-catalog`                        | Catálogo de APIs escrito en MDX.                                            |
| `/docs/customization`                      | Dónde se personaliza cada aspecto del portal.                               |
| `/docs/project-structure`                  | Carpetas y archivos clave.                                                  |
| `/api-store/petstore`                      | Referencia y playground de Petstore (lleva a la primera página).            |
| `/api-store/blog/v1`, `/api-store/blog/v2` | Blog con selector de versión; `/api-store/blog` lleva a v1.                 |
| `/api-store/auth`                          | Referencia y playground de Auth.                                            |

## Qué se puede configurar y extender

Fumadocs se personaliza por niveles, de menor a mayor esfuerzo. Conviene usar siempre el nivel
más bajo que resuelva el caso.

| Nivel                       | Qué permite                                                                                                                                                                        | Dónde en este proyecto                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Contenido**               | Páginas, orden, separadores (`---Título---`), links externos, íconos, secciones (`root`), títulos cortos (`sidebarTitle`).                                                         | `content/**` (MDX y `meta.json`)                                                          |
| **Opciones de los layouts** | Links del navbar, búsqueda, toggle de tema, banner de la barra lateral, pestañas.                                                                                                  | `src/lib/layout.shared.tsx`, `src/app/(home)/layout.tsx`, `src/app/(docs)/layout.tsx`     |
| **Tema**                    | Colores (`--color-fd-*`), tipografías y ancho del layout (`--fd-layout-width`) por variables CSS, en claro y oscuro.                                                               | `src/app/global.css`                                                                      |
| **Textos**                  | Traducción de todos los textos de fumadocs-ui y fumadocs-openapi (tipado: el typecheck falla si falta una clave) y textos propios.                                                 | `src/lib/translations.ts`, `src/i18n/es.ts`                                               |
| **Componentes MDX**         | Registrar componentes propios o reemplazar los de Fumadocs para usarlos en cualquier `.mdx`.                                                                                       | `src/components/mdx.tsx`                                                                  |
| **Slots**                   | Reemplazar partes de un layout (header, barra lateral, búsqueda, toggle de tema, etc.) por componentes propios, sin copiar el resto.                                               | `slots.header` con `SiteHeader` en ambos layouts                                          |
| **Plugins del loader**      | Transformar el page tree o las páginas (renombrar, agrupar, agregar nodos).                                                                                                        | `src/lib/source.ts` (`sidebar-title`), `src/lib/endpoints-plugin.tsx`                     |
| **Opciones de OpenAPI**     | Una página por tag, por operación o por archivo; servidores, proxy y orígenes permitidos; render propio de campos del playground (`renderBodyField`) y de partes de la referencia. | `src/lib/openapi.ts`, `src/lib/source.ts` (`staticSource`), `src/components/OpenApiPage/` |
| **Componentes propios**     | Usar las piezas de Fumadocs (`Popover`, `Collapsible`, `buttonVariants`, `SidebarTabsDropdown`, hooks de contexto) para armar componentes nuevos.                                  | `SiteHeader`, `VersionSelect`, `MethodBadge`                                              |
| **Copiar el código fuente** | `npx @fumadocs/cli customize` o `add` copian layouts y componentes al repo (como shadcn/ui) para modificarlos libremente. Se pierde la actualización automática de esas piezas.    | No se usó                                                                                 |

Los componentes de Fumadocs están hechos con Base UI y Tailwind, así que los propios se escriben
con las mismas clases (`bg-fd-card`, `text-fd-muted-foreground`, etc.) y quedan integrados con el
tema.

### Dónde se configura cada cosa

| Qué                   | Dónde                                                   |
| --------------------- | ------------------------------------------------------- |
| Especificaciones      | `apis/`                                                 |
| Textos de la librería | `src/lib/translations.ts`                               |
| Textos propios        | `src/i18n/es.ts`                                        |
| Datos de ejemplo      | `src/data/`                                             |
| Tema                  | `src/app/global.css`                                    |
| Navegación            | `src/lib/layout.shared.tsx` (`NAV_LINKS`)               |
| Header                | `src/components/SiteHeader/`                            |
| Logo                  | `src/components/SiteLogo/index.tsx`                     |
| Redirecciones fijas   | `next.config.mjs`                                       |
| APIs                  | `src/lib/openapi.ts` y `content/api-store/**/meta.json` |

## Cómo agregar una página de documentación

1. Crear `content/docs/mi-pagina.mdx` con frontmatter:

   ```mdx
   ---
   title: Mi página
   description: Descripción corta.
   sidebarTitle: Mi página # opcional, si el título es largo
   ---
   ```

2. Agregar `"mi-pagina"` a `pages` en `content/docs/meta.json`, en el lugar donde debe aparecer
   (ahí también van los separadores `"---Título---"` y los links `"[Texto](https://...)"`).

## Cómo agregar una API

1. Copiar el YAML a `apis/`, por ejemplo `apis/orders-api.yaml`.
2. Crear la instancia en `src/lib/openapi.ts`:

   ```ts
   export const orders = createOpenAPI({
     proxyUrl: PROXY_URL,
     input: ['./apis/orders-api.yaml'],
   })
   ```

3. Registrar la fuente en el `loader()` de `src/lib/source.ts`:

   ```ts
   orders: await apiSource(orders, 'api-store/orders/(generated)'),
   ```

   El selector de versión lee `info.version` de las páginas generadas, sin otro registro.

4. Crear `content/api-store/orders/meta.json`. `root` lleva el id de la API, así el selector de
   versión solo ofrece las versiones de esa API:

   ```json
   { "title": "Orders API", "root": "orders", "pages": ["...(generated)"] }
   ```

5. Agregar `"orders"` a `pages` en `content/api-store/meta.json`.
6. Agregar la tarjeta al catálogo en `src/data/apis.ts` (la versión y la cantidad de endpoints
   se leen de la spec) y, si corresponde, el link del footer en `src/data/footer.ts`.

La ruta `/api-store/orders` redirige automáticamente a la primera página de la API. Cada página
toma su URL del nombre del tag en minúsculas, con guiones y sin tildes (`Autenticación` →
`/api-store/portal/autenticacion`). Para una API con versiones, se sigue el ejemplo de
`content/api-store/blog/`: una carpeta por versión, todas con el id de la API como `root` (en
Blog, `"blog"`).

Los archivos de `apis/` son copias byte a byte de los del sandbox. No se editan; si cambian, se
reemplaza el archivo completo.

La excepción es `apis/portal-api.json`, la spec de la API propia del portal (repo
`devportal-api`). No viene del sandbox: la genera el build del backend y se actualiza solo con
`npm run spec:sync`, que la copia desde `../devportal-api/openapi/` (el repo del backend tiene que
estar clonado en la misma carpeta que este y compilado con `dotnet build`; si no encuentra la
spec, el script falla con un mensaje). Tampoco se edita a mano. Esta API se registra sin
`proxyUrl` (ver [`NOTES.md`](NOTES.md#funciones-del-playground)).

## Build estático para GitHub Pages

`npm run build:pages` genera una versión estática del portal en `out/` (ignorada por git), para
publicarla en GitHub Pages bajo `/fumadocs-api-portal`. `npm run dev` y
`npm run build && npm start` no cambian.

El script (`scripts/build-pages.mjs`, multiplataforma):

1. Mueve `src/app/api/proxy/` a `node_modules/.cache/build-pages/` (Next no puede exportar un
   route handler que necesita servidor) y borra los tipos de rutas viejos de `.next/`.
2. Corre `next build` con `STATIC_EXPORT=1` y la base de las URLs en `PAGES_BASE_PATH` y
   `NEXT_PUBLIC_BASE_PATH` (por defecto `/fumadocs-api-portal`; se cambia definiendo
   `PAGES_BASE_PATH` antes de correrlo).
3. Restaura la carpeta del proxy siempre, aunque el build falle o se corte con Ctrl+C. Si una
   corrida anterior quedó a medias, la siguiente la restaura al empezar.

Con `STATIC_EXPORT=1`, `next.config.mjs` activa `output: 'export'`, `basePath`, `assetPrefix` y
`trailingSlash: true`, y `src/lib/openapi.ts` registra las APIs sin `proxyUrl`. La búsqueda usa
el mismo índice estático en ambos modos (`staticGET` en `/api/search` y `type: 'static'` en el
`RootProvider`, con el `basePath` explícito). Las redirecciones (`/`, `/introduction` y las
carpetas como `/docs`) son páginas con `<meta http-equiv="refresh">`, además del redirect por JS.

Después de `build:pages`, `.next/` queda con el build estático: para `npm start` hay que volver a
correr `npm run build` (el e2e ya lo hace).

Para revisar `out/` en local hay que servirlo bajo `/fumadocs-api-portal/` (por ejemplo, copiarlo
a `<carpeta>/fumadocs-api-portal/` y correr `npx serve <carpeta>`).

Limitaciones del sitio estático:

- **Sin proxy**: el playground de Petstore, Blog y Auth llama directo desde el navegador a cada
  servidor, que puede rechazar la solicitud por CORS. Petstore, además, tiene un server relativo
  (`/api/v3`) que en Pages apunta al propio sitio. La Portal API funciona porque permite CORS
  desde `https://agustintamb.github.io`.
- **Sin redirecciones del servidor**: las redirecciones son páginas HTML (sin código 307).
- Ver otros detalles en [`NOTES.md`](NOTES.md#build-estático-para-github-pages).

## Limitaciones conocidas

- El proxy del playground (`/api/proxy`) acepta cualquier host público; para producción
  convendría limitarlo con `allowedOrigins`.
- En GitHub Pages (`npm run build:pages`) no hay proxy ni servidor: ver
  [Build estático para GitHub Pages](#build-estático-para-github-pages).
- El resto de las diferencias con Zudoku están en [`NOTES.md`](NOTES.md#qué-falta-respecto-de-zudoku).
