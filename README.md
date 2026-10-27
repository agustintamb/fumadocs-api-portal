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
- **Referencia de APIs** generada desde specs OpenAPI (Portal API v1/v2, Petstore v2/v3 y
  PokeAPI; ver [Catálogo](#catálogo-de-apis)): una página por recurso (tag); en la barra lateral
  cada recurso lista sus endpoints con el verbo HTTP.
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
| `npm run spec:sync`   | Copia las specs v1 y v2 de la Portal API desde `../devportal-api/openapi/` a `apis/portal-api.json` y `apis/portal-api-v2.json`.   |
| `npm run spec:vendor` | Descarga las specs de Petstore (v2 y v3) y PokeAPI a `apis/` (ver [Specs de terceros](#specs-de-terceros-vendorizadas)).           |

Otros scripts: `lint:fix`, `format`, `format:check` y `test:watch`.

La primera vez que se corren los tests e2e hace falta instalar el navegador:
`npx playwright install chromium`.

Las capturas de `docs/screenshots/` (evidencia para `NOTES.md`, la app no las usa) se regeneran
con la variable `SCREENSHOTS=1`:

```powershell
$env:SCREENSHOTS = '1'; npx playwright test e2e/screenshots.spec.ts
```

La prueba conjunta con la Portal API (`e2e/portal-api.spec.ts`) también queda fuera del smoke
test y se activa con `PORTAL_API=1`. Recorre el playground: pide un token con el usuario demo,
consulta `GET /dashboard/stats` autorizado y crea y cancela una suscripción. Contra el build
local usa la API en `http://localhost:5080` (levantada con `dotnet run` en `devportal-api`);
con `BASE_URL` corre contra un portal ya desplegado, sin levantar servidor, y usa la API de
Render:

```powershell
$env:PORTAL_API = '1'; npm run test:e2e -- e2e/portal-api.spec.ts
$env:BASE_URL = 'https://agustintamb.github.io/fumadocs-api-portal/'; $env:PORTAL_API = '1'; npx playwright test e2e/portal-api.spec.ts
Remove-Item Env:BASE_URL, Env:PORTAL_API  # si no, el smoke test siguiente apunta a Pages
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

| Paquete            | Rol                                                                                                                                                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fumadocs-mdx`     | Lee los `.mdx` y `meta.json` de `content/`, valida su frontmatter (con `zod`) y los compila. Se conecta a Next con `createMDX()` en `next.config.mjs`; `defineDocs` (en `src/lib/source.ts`) define la colección.                                                                                   |
| `fumadocs-core`    | El motor sin UI. Su `loader()` une varias fuentes de contenido en un único **page tree** (el árbol de la barra lateral) y resuelve URL → página. También provee la búsqueda (Orama), los plugins del loader y utilidades como `flattenTree`.                                                        |
| `fumadocs-ui`      | La interfaz: layouts (`HomeLayout`, `DocsLayout` Notebook), página de docs (`DocsPage`, TOC, anterior/siguiente), componentes MDX, diálogo de búsqueda, tema claro/oscuro e i18n. En este proyecto es un alias de `@fumadocs/base-ui` (construido sobre Base UI + Tailwind CSS 4).                  |
| `fumadocs-openapi` | Convierte specs OpenAPI en páginas: `createOpenAPI()` carga la spec (YAML o JSON) y `staticSource()` genera una página virtual por tag, que se suma al `loader()` como una fuente más. En el cliente, `createOpenAPIPage()` renderiza la referencia y el playground; `createProxy()` arma el proxy. |

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
   (`/docs`, `/api-store/portal`), redirige a su primera página; `generateStaticParams` también
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
apis/                       Specs OpenAPI (no se editan: portal-api*.json salen de spec:sync y el resto de spec:vendor)
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
e2e/                        Smoke test, capturas y prueba con la Portal API (Playwright)
scripts/                    sync-spec.mjs (spec:sync), vendor-specs.mjs (spec:vendor) y build-pages.mjs (build:pages)
public/clients/             Logos SVG del carrusel de clientes (de simpleicons, CC0)
docs/screenshots/           Capturas referenciadas desde NOTES.md
```

## Rutas

| Ruta                                               | Contenido                                                                   |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| `/`                                                | Redirige a `/home`.                                                         |
| `/home`                                            | Landing con hero y carrusel de clientes.                                    |
| `/dashboard`                                       | Estadísticas y actividad reciente filtrable.                                |
| `/api-store`                                       | Catálogo de APIs con buscador y filtros.                                    |
| `/docs/introduction`                               | Introducción de la documentación; `/docs` y `/introduction` redirigen aquí. |
| `/docs/components`                                 | Ejemplos de componentes de Fumadocs en MDX.                                 |
| `/docs/api-catalog`                                | Catálogo de APIs escrito en MDX.                                            |
| `/docs/customization`                              | Dónde se personaliza cada aspecto del portal.                               |
| `/docs/project-structure`                          | Carpetas y archivos clave.                                                  |
| `/api-store/portal/v1`, `/api-store/portal/v2`     | Portal API con selector de versión; `/api-store/portal` lleva a v2.         |
| `/api-store/petstore/v2`, `/api-store/petstore/v3` | Petstore con selector de versión; `/api-store/petstore` lleva a v3.         |
| `/api-store/pokeapi`                               | Referencia y playground de PokeAPI (lleva a la primera página).             |

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

## Catálogo de APIs

El API Store publica tres APIs. El catálogo vive en `src/data/apis.ts` (mismo orden y valores
que el `seed.sql` del backend); la versión y la cantidad de endpoints de cada tarjeta se leen de
las specs.

| API          | Visibilidad | Specs (`apis/`)                                   | Origen                             | Rutas                                                  |
| ------------ | ----------- | ------------------------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| Portal API   | Interna     | `portal-api.json` (v1), `portal-api-v2.json` (v2) | Propia: `npm run spec:sync`        | `/api-store/portal/v1/…`, `/api-store/portal/v2/…`     |
| Petstore API | Pública     | `petstore-v2.json` (v2), `petstore-v3.json` (v3)  | Vendorizada: `npm run spec:vendor` | `/api-store/petstore/v2/…`, `/api-store/petstore/v3/…` |
| PokeAPI      | Pública     | `pokeapi.yaml`                                    | Vendorizada: `npm run spec:vendor` | `/api-store/pokeapi/…`                                 |

- **Visibilidad** (`visibility` en `src/data/apis.ts`, textos en `es.apiStore.visibility`):
  `internal` (**Interna**) es una API de la empresa y `public` (**Pública**) una de terceros. No
  dice nada sobre credenciales. Se muestra como badge, junto al estado, en la tarjeta del API
  Store y al lado del título de cada página de la API (componente `ApiBadges`).
- **Versiones**: cada versión es una carpeta con el id de la API como `root`, y el `meta.json`
  de la API lista la más nueva primero (`["v2", "v1"]`). Así `/api-store/portal` abre la v2 y el
  selector la muestra arriba.
- **Sin proxy**: las tres APIs permiten CORS, así que el playground las llama directo desde el
  navegador, también en GitHub Pages.

## Cómo agregar una API

1. Guardar la spec en `apis/`, en JSON o YAML (OpenAPI 3; una Swagger 2.0 hay que convertirla,
   como hace `spec:vendor` con Petstore v2):
   - **API propia**: que la genere su build y copiarla con un script, como `spec:sync` con la
     Portal API.
   - **API de terceros**: agregar su URL a `scripts/vendor-specs.mjs` y correr
     `npm run spec:vendor` (ver [Specs de terceros](#specs-de-terceros-vendorizadas)).
2. Crear la instancia en `src/lib/openapi.ts`:

   ```ts
   export const orders = createOpenAPI({ input: ['./apis/orders-api.yaml'] })
   ```

   Si el servidor de la API no permite CORS, agregar `proxyUrl: '/api/proxy'` para que el
   playground pase por el proxy del portal. El proxy solo existe con servidor (`npm run dev` o
   `npm start`), no en GitHub Pages, y rechaza hosts privados como `localhost`.

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
6. Agregar la tarjeta al catálogo en `src/data/apis.ts` (con su `visibility`; la versión y la
   cantidad de endpoints se leen de la spec) y, si corresponde, el link del footer en
   `src/data/footer.ts`.

La ruta `/api-store/orders` redirige automáticamente a la primera página de la API. Cada página
toma su URL del nombre del tag en minúsculas, con guiones y sin tildes (`Autenticación` →
`/api-store/portal/v2/autenticacion`).

Para una API con versiones se sigue el ejemplo de `content/api-store/portal/`: una carpeta por
versión (`v1/meta.json`, `v2/meta.json`), todas con el id de la API como `root`, una fuente por
versión en `source.ts` (`'api-store/portal/v2/(generated)'`) y el `meta.json` de la API sin
`root` y con la versión más nueva primero:

```json
{ "title": "Portal API", "pages": ["v2", "v1"] }
```

Las specs de `apis/` no se editan a mano: las de la Portal API salen de `spec:sync` y las de
terceros de `spec:vendor`.

`apis/portal-api.json` (v1) y `apis/portal-api-v2.json` (v2) son las specs de la API propia del
portal (repo `devportal-api`). Las genera el build del backend y se actualizan solo con
`npm run spec:sync`, que las copia desde `../devportal-api/openapi/` (`portal-api.json` y
`portal-api_v2.json`, el nombre que elige el generador). El repo del backend tiene que estar
clonado en la misma carpeta que este y compilado con `dotnet build`; si no encuentra una spec, el
script falla con un mensaje. Esta API se registra sin `proxyUrl` (ver
[`NOTES.md`](NOTES.md#funciones-del-playground)).

### Specs de terceros (vendorizadas)

Las specs de APIs públicas se descargan una vez del proveedor y se guardan en el repo
("vendorizar"): el build no depende de internet y un cambio del proveedor no rompe nada sin
aviso. Se actualizan solo con `npm run spec:vendor` (`scripts/vendor-specs.mjs`), nunca a mano:

| Archivo                         | Origen                                                                 | Qué cambia el script                                    |
| ------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| `apis/petstore-v3.json`         | `https://petstore3.swagger.io/api/v3/openapi.json` (OpenAPI 3.0)       | `servers` → `https://petstore3.swagger.io/api/v3`       |
| `apis/petstore-v2.swagger.json` | `https://petstore.swagger.io/v2/swagger.json` (Swagger 2.0)            | Nada: es el original, para comparar con la conversión   |
| `apis/petstore-v2.json`         | El anterior, convertido a OpenAPI 3 con `swagger2openapi`              | `servers` → `https://petstore.swagger.io/v2` (sin http) |
| `apis/pokeapi.yaml`             | `https://raw.githubusercontent.com/PokeAPI/pokeapi/master/openapi.yml` | `servers` → `https://pokeapi.co`                        |

- Los JSON se escriben con 2 espacios de sangría, así el diff entre versiones se puede leer.
- El YAML de PokeAPI queda igual al del proveedor salvo el bloque `servers` (se edita como texto
  y el script verifica que el resto del documento no cambió). Hoy el proveedor ya trae
  `https://pokeapi.co`, así que el archivo es idéntico al original; si lo sacara, el script lo
  vuelve a agregar antes de `paths`.
- La salida es determinística: correr el script dos veces seguidas no deja cambios.

Para actualizarlas: correr `npm run spec:vendor`, revisar `git diff apis/` (rutas nuevas o
borradas, cambios de `info.version`) y probar el playground de cada API antes de commitear.

**Riesgos de la conversión de Petstore v2.** `swagger2openapi` convierte bien lo esencial, pero
la spec del proveedor tiene detalles que en el playground pueden verse raros. No se corrigen: lo
único que se toca son los `servers`.

- **Credenciales**: la spec declara `api_key` (header) y OAuth implícito (`petstore_auth`, con
  `authorizationUrl` en `https://petstore.swagger.io/oauth/authorize`), pero el servidor no las
  exige. En el playground se pueden dejar vacías o escribir cualquier valor; el login OAuth no
  funciona. Lo mismo vale para Petstore v3.
- **Respuestas sin documentar**: `POST /pet`, `PUT /pet` y `POST /pet/{petId}` solo declaran
  códigos de error (400/404/405) y los `/user` de escritura solo `default`. El servidor responde
  200 con datos, que el playground muestra igual, pero la página no tiene el esquema del 200.
- **`consumes`/`produces`**: pasan a `content` con `application/json` y `application/xml` en
  cuerpos y respuestas. El servidor elige el formato según el header `Accept`; si una respuesta
  llega en XML, revisar qué tipo eligió el playground.
- **Formularios y archivos**: `POST /pet/{petId}/uploadImage` queda como `multipart/form-data`
  con `file` (`format: binary`) y `POST /pet/{petId}` como `application/x-www-form-urlencoded`.
- **Arrays en la query**: `status` de `GET /pet/findByStatus` (antes `collectionFormat: multi`)
  queda con `explode: true` (`?status=available&status=sold`) y su valor por defecto pasa a los
  ítems del array.
- **Cuerpos compartidos**: el cuerpo de `POST /pet` y `PUT /pet` pasa a
  `components/requestBodies/Pet`, y el de `createWithArray`/`createWithList` a `UserArray`.
- **Servers**: la conversión genera uno `https` y otro `http`; el script deja solo el `https`
  (desde Pages el navegador bloquearía el `http`).

### URL de la Portal API por ambiente

La spec trae dos servers ("Producción" y "Local"), pero cada ambiente del portal muestra en el
playground la URL de la API que le corresponde. `src/lib/openapi.ts` la lee de la variable
`PORTAL_API_URL` al momento del build (o al arrancar `npm run dev`) y reemplaza los `servers`
de la spec con `selectServers` (`src/utils/select-servers.ts`):

| Ambiente                     | `PORTAL_API_URL`                              | Servers en el playground                      |
| ---------------------------- | --------------------------------------------- | --------------------------------------------- |
| Local (`dev`, `build/start`) | Opcional; por defecto `http://localhost:5080` | Esa URL primero y después el resto de la spec |
| GitHub Pages (`build:pages`) | Obligatoria; el workflow usa la URL de Render | Solo esa URL                                  |

Para apuntar el portal local a otra API, se define en `.env.local` (ignorado por git), por
ejemplo `PORTAL_API_URL=https://devportal-api.onrender.com`. Un ambiente nuevo (staging, etc.)
solo necesita su propia `PORTAL_API_URL`; la descripción del server se toma de la spec si la URL
figura ahí.

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
   No conviene correrlo con `npm run dev` abierto: el dev server pierde la ruta del proxy mientras dura
   el build.

Con `STATIC_EXPORT=1`, `next.config.mjs` activa `output: 'export'`, `basePath`, `assetPrefix` y
`trailingSlash: true`, y `src/lib/openapi.ts` deja en la
Portal API solo el server de `PORTAL_API_URL`, que es obligatoria: sin ella el script corta antes
de compilar (ver [URL de la Portal API por ambiente](#url-de-la-portal-api-por-ambiente)). La
búsqueda usa
el mismo índice estático en ambos modos (`staticGET` en `/api/search` y `type: 'static'` en el
`RootProvider`, con el `basePath` explícito). Las redirecciones (`/`, `/introduction` y las
carpetas como `/docs`) son páginas con `<meta http-equiv="refresh">`, además del redirect por JS.

Después de `build:pages`, `.next/` queda con el build estático: para `npm start` hay que volver a
correr `npm run build` (el e2e ya lo hace).

Para revisar `out/` en local hay que servirlo bajo `/fumadocs-api-portal/` (por ejemplo, copiarlo
a `<carpeta>/fumadocs-api-portal/` y correr `npx serve <carpeta>`).

Limitaciones del sitio estático:

- **Sin proxy**: el playground llama directo desde el navegador a cada servidor. Funciona porque
  las tres APIs del catálogo permiten CORS (la Portal API, desde `https://agustintamb.github.io`);
  una API sin CORS solo se podría probar con servidor, a través del proxy.
- **Sin redirecciones del servidor**: las redirecciones son páginas HTML (sin código 307).
- Ver otros detalles en [`NOTES.md`](NOTES.md#build-estático-para-github-pages).

### Publicación

El sitio está publicado en <https://agustintamb.github.io/fumadocs-api-portal/>. El workflow
`.github/workflows/pages.yml` corre `npm ci` y `npm run build:pages` (con
`PORTAL_API_URL=https://devportal-api.onrender.com`) en cada push a `master` y
publica `out/` en GitHub Pages (fuente: GitHub Actions). Para redeployar sin cambios de código:
`gh workflow run pages.yml` o "Run workflow" en la pestaña Actions.

## Limitaciones conocidas

- El proxy del playground (`/api/proxy`) acepta cualquier host público; para producción
  convendría limitarlo con `allowedOrigins`.
- En GitHub Pages (`npm run build:pages`) no hay proxy ni servidor: ver
  [Build estático para GitHub Pages](#build-estático-para-github-pages).
- El resto de las diferencias con Zudoku están en [`NOTES.md`](NOTES.md#qué-falta-respecto-de-zudoku).
