/**
 * Inserta el campo `image` de cada propiedad en src/data/site.ts, a partir de
 * los .webp que dejo scripts/fetch-images.mjs. Es idempotente.
 *
 *   node scripts/wire-images.mjs
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'

const FILE = 'src/data/site.ts'
const DIR = 'public/propiedades'

let src = readFileSync(FILE, 'utf8')

// Se parte de los .webp reales, no de los slugs del archivo: asi los 3 slugs de
// SERVICES (que no son propiedades) nunca se tocan.
const slugs = readdirSync(DIR)
  .filter((f) => f.endsWith('.webp'))
  .map((f) => f.replace(/\.webp$/, ''))

if (slugs.length === 0) {
  console.error('No hay .webp en', DIR, '- corré primero scripts/fetch-images.mjs')
  process.exit(1)
}

let added = 0
let already = 0
const notFound = []

for (const slug of slugs) {
  const line = `image: '/propiedades/${slug}.webp'`

  if (src.includes(line)) {
    already++
    continue
  }

  // El archivo usa CRLF: hay que tolerar \r\n y \n.
  const re = new RegExp(`( {4}slug: '${slug}',\\r?\\n)`)
  if (!re.test(src)) {
    notFound.push(slug)
    continue
  }

  const eol = src.includes('\r\n') ? '\r\n' : '\n'
  src = src.replace(re, `$1    ${line},${eol}`)
  added++
}

writeFileSync(FILE, src, 'utf8')

const total = (src.match(/image: '\/propiedades\//g) || []).length
console.log(`  .webp en ${DIR}: ${slugs.length}`)
console.log(`  agregadas: ${added}   ya estaban: ${already}   total con image: ${total}`)
if (notFound.length) console.log(`  \x1b[31mno se encontro el slug:\x1b[0m ${notFound.join(', ')}`)

process.exit(notFound.length > 0 ? 1 : 0)
