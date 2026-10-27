// Downloads the third-party specs into `apis/` (run by hand; the result is committed).
// Only `servers` is changed (plus `id` required in Petstore v3's Pet); Petstore v2 is converted from Swagger 2.0 to OpenAPI 3.
import { isDeepStrictEqual } from 'node:util'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import converter from 'swagger2openapi'
import { parse } from 'yaml'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const apisDir = path.join(root, 'apis')

const sources = {
  petstoreV3: 'https://petstore3.swagger.io/api/v3/openapi.json',
  petstoreV2: 'https://petstore.swagger.io/v2/swagger.json',
  pokeapi: 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/openapi.yml',
}

async function download(url) {
  console.log(`Descargando ${url}`)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`La descarga de ${url} respondió ${response.status}.`)
  return response.text()
}

// Replaces `servers` keeping its position; if the spec has none, it goes right after `info`.
function withServers(spec, servers) {
  const entries = Object.entries(spec)
  const current = entries.findIndex(([key]) => key === 'servers')
  if (current !== -1) entries[current] = ['servers', servers]
  else
    entries.splice(entries.findIndex(([key]) => key === 'info') + 1, 0, [
      'servers',
      servers,
    ])
  return Object.fromEntries(entries)
}

// Edits the YAML as text so the rest of the provider's file stays byte for byte.
function withYamlServers(text, url) {
  const lines = text.split('\n')
  const block = ['servers:', `- url: ${url}`]
  const start = lines.findIndex((line) => /^servers\s*:/.test(line))
  if (start !== -1) {
    // The block ends at the next top-level key (sequence items may start at column 0).
    let end = start + 1
    while (end < lines.length && !/^[^\s#-]/.test(lines[end])) end++
    lines.splice(start, end - start, ...block)
  } else {
    const paths = lines.findIndex((line) => /^paths\s*:/.test(line))
    if (paths === -1)
      throw new Error('La spec de PokeAPI no tiene `paths` en el primer nivel.')
    lines.splice(paths, 0, ...block)
  }
  const result = lines.join('\n')

  const expected = withServers(parse(text), [{ url }])
  if (!isDeepStrictEqual(parse(result), expected))
    throw new Error(
      'Al agregar `servers` a la spec de PokeAPI cambió otra parte del documento.',
    )
  return result
}

async function writeJson(name, data) {
  await writeFile(path.join(apisDir, name), `${JSON.stringify(data, null, 2)}\n`)
  console.log(`Escrito apis/${name}`)
}

// petstore3.swagger.io answers 500 to POST /pet without `id`. The playground builds the
// example from the required properties only, so `id` is made required to include it.
function withRequiredPetId(spec) {
  const pet = spec.components.schemas.Pet
  if (!pet.required.includes('id')) pet.required = ['id', ...pet.required]
  return spec
}

const petstoreV3 = JSON.parse(await download(sources.petstoreV3))
await writeJson(
  'petstore-v3.json',
  withServers(withRequiredPetId(petstoreV3), [
    { url: 'https://petstore3.swagger.io/api/v3' },
  ]),
)

const petstoreV2Swagger = JSON.parse(await download(sources.petstoreV2))
await writeJson('petstore-v2.swagger.json', petstoreV2Swagger)
console.log('Convirtiendo Petstore v2 de Swagger 2.0 a OpenAPI 3')
const { openapi: petstoreV2 } = await converter.convertObj(
  structuredClone(petstoreV2Swagger),
  {},
)
await writeJson(
  'petstore-v2.json',
  withServers(petstoreV2, [{ url: 'https://petstore.swagger.io/v2' }]),
)

const pokeapi = await download(sources.pokeapi)
await writeFile(
  path.join(apisDir, 'pokeapi.yaml'),
  withYamlServers(pokeapi, 'https://pokeapi.co'),
)
console.log('Escrito apis/pokeapi.yaml')

console.log('Listo. Revisar el diff con `git diff apis/` antes de commitear.')
