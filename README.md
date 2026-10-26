# Portal de APIs · Fumadocs

Prueba de concepto de un developer portal construido con Next.js 16, Fumadocs 16 y
fumadocs-openapi 12. Reproduce la experiencia del sandbox de Zudoku (Inicio, Dashboard,
API Store, Documentación y la referencia de cuatro especificaciones OpenAPI) con toda la
interfaz en español.

## Requisitos

- Node 24
- npm 11

## Puesta en marcha

```bash
npm install
npm run dev
```

El portal queda disponible en http://localhost:3000 (la raíz redirige a `/home`).

## Comandos

| Comando             | Qué hace                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `npm install`       | Instala las dependencias.                                                                                             |
| `npm run dev`       | Levanta el servidor de desarrollo en http://localhost:3000.                                                           |
| `npm run build`     | Genera el build de producción.                                                                                        |
| `npm run start`     | Sirve el build de producción (requiere `npm run build` antes).                                                        |
| `npm test`          | Corre los tests unitarios (Vitest).                                                                                   |
| `npm run test:e2e`  | Corre el smoke test de Playwright. Hace el build y levanta el servidor en el puerto 3100 si no hay uno corriendo ahí. |
| `npm run lint`      | Corre ESLint.                                                                                                         |
| `npm run typecheck` | Genera los tipos de Next (`next typegen`) y corre `tsc --noEmit`.                                                     |

Otros scripts: `lint:fix`, `format`, `format:check` y `test:watch`.

La primera vez que se corren los tests e2e hace falta instalar el navegador:
`npx playwright install chromium`.

Las capturas de `docs/screenshots/` se regeneran con la variable `SCREENSHOTS=1` (igual que
`test:e2e`, reutilizan el servidor del puerto 3100 o levantan uno):

```powershell
$env:SCREENSHOTS = '1'; npx playwright test e2e/screenshots.spec.ts
```

## Rutas

| Ruta                                       | Contenido                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `/`                                        | Redirige a `/home`.                                                         |
| `/home`                                    | Landing con hero y carrusel de clientes.                                    |
| `/dashboard`                               | Estadísticas y actividad reciente filtrable.                                |
| `/api-store`                               | Catálogo de APIs con buscador y filtros.                                    |
| `/docs/introduction`                       | Introducción de la documentación; `/docs` y `/introduction` redirigen aquí. |
| `/api-store/petstore`                      | Referencia y playground de Petstore (lleva a la primera página).            |
| `/api-store/blog/v1`, `/api-store/blog/v2` | Blog con selector de versión; `/api-store/blog` lleva a v1.                 |
| `/api-store/auth`                          | Referencia y playground de Auth.                                            |

## Dónde se configura cada cosa

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
| APIs                  | `src/lib/openapi.ts` y `content/api-store/**/meta.json` |

Otras piezas:

- `src/lib/source.ts`: une el contenido MDX (`content/`) con las páginas generadas desde los
  YAML.
- `src/app/(docs)/[...slug]/page.tsx`: renderiza las páginas de documentación y de referencia,
  y redirige las carpetas sin página propia a su primera página.
- `src/app/api/proxy/route.ts`: proxy que usa el playground para evitar CORS.
- `src/app/(home)/{home,dashboard,api-store}/`: vistas, hooks y `_components/` de cada página, junto a su `page.tsx`.
- `content/docs/`: páginas MDX de la documentación.

Los archivos de `apis/` son copias byte a byte de los del sandbox. No se editan; si cambian, se
reemplaza el archivo completo.

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

4. Crear `content/api-store/orders/meta.json`:

   ```json
   { "title": "Orders API", "root": true, "pages": ["...(generated)"] }
   ```

5. Agregar `"orders"` a `pages` en `content/api-store/meta.json`.
6. Agregar la tarjeta al catálogo en `src/data/apis.ts` (la versión y la cantidad de endpoints
   se leen del YAML) y, si corresponde, el link del footer en `src/data/footer.ts`.

La ruta `/api-store/orders` redirige automáticamente a la primera página de la API. Para una
API con versiones, se sigue el ejemplo de `content/api-store/blog/`: una carpeta por versión con
`"root": "version"`.
