/**
 * Verificacion de datos y links.
 * Corre con: node scripts/check.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'src/data/site.ts'), 'utf8')

let failures = 0
const ok = (label) => console.log(`  \x1b[32mOK\x1b[0m    ${label}`)
const bad = (label) => {
  failures++
  console.log(`  \x1b[31mFAIL\x1b[0m  ${label}`)
}

/* ---- 1. Slugs unicos y en formato correcto ---- */
console.log('\n\x1b[1mSlugs\x1b[0m')
// Los slugs de propiedades viven dentro del array PROPERTIES; los de servicios,
// en SERVICES. Solo contamos los de propiedades.
//
// El corte se hace por el siguiente "export " en columna 0. Buscar un separador
// de comentario es frágil: si el archivo no lo tiene, indexOf devuelve -1 y el
// bloque se extiende hasta el final, contando los slugs de servicios como si
// fueran propiedades.
const propStart = src.indexOf('export const PROPERTIES')
const propEnd = src.indexOf('\nexport ', propStart + 1)
const propBlock = src.slice(propStart, propEnd === -1 ? src.length : propEnd)
const slugs = [...propBlock.matchAll(/^\s{2,4}slug: '([^']+)'/gm)].map((m) => m[1])
const serviceSlugs = [...src.matchAll(/^\s{4}slug: '([^']+)'/gm)].map((m) => m[1]).filter((s) => !slugs.includes(s))
slugs.length === 0 ? bad('no se encontro ningun slug') : ok(`${slugs.length} propiedades + ${serviceSlugs.length} servicios`)

const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i)
dupes.length === 0 ? ok('sin slugs duplicados') : bad(`duplicados: ${[...new Set(dupes)].join(', ')}`)

const badSlug = slugs.filter((s) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s))
badSlug.length === 0 ? ok('todos en formato kebab-case') : bad(`mal formados: ${badSlug.join(', ')}`)

/* ---- 2. Todos los precios son numeros ---- */
console.log('\n\x1b[1mPrecios\x1b[0m')
const prices = [...src.matchAll(/priceUsd: (\d+)/g)].map((m) => Number(m[1]))
prices.length === slugs.length
  ? ok(`${prices.length} precios, uno por propiedad`)
  : bad(`${prices.length} precios para ${slugs.length} propiedades`)
prices.every((p) => p > 0) ? ok('todos los precios > 0') : bad('hay precios en 0')

/* ---- 3. El mensaje de WhatsApp queda bien codificado ---- */
console.log('\n\x1b[1mLinks de WhatsApp\x1b[0m')
const phone = src.match(/whatsapp: '(\d+)'/)?.[1]
phone && /^\d{10,15}$/.test(phone) ? ok(`numero ${phone} (formato wa.me correcto)`) : bad(`telefono invalido: ${phone}`)

const sample = 'Hola ARNEDO LR, vi la propiedad "Casa en El Tipal" (El Tipal) en la web y me interesa. ¿Me podés pasar más información?'
const encoded = encodeURIComponent(sample)
encoded.includes('%20') && !encoded.includes(' ') && encoded.includes('%C2%BF')
  ? ok('el mensaje con acentos y signos se codifica bien')
  : bad('fallo la codificacion del mensaje')

/* ---- 4. No quedaron restos de caracteres corruptos ---- */
console.log('\n\x1b[1mSanidad del texto\x1b[0m')
const suspect = src.match(/[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/g)
suspect === null ? ok('sin caracteres CJK accidentales') : bad(`caracteres sospechosos: ${[...new Set(suspect)].join(' ')}`)

const mojibake = src.match(/\b[a-zA-Z]*[\uFFFD\u0080-\u009F][a-zA-Z]*\b/g)
mojibake === null ? ok('sin mojibake') : bad(`posible mojibake: ${[...new Set(mojibake)].slice(0, 5).join(', ')}`)

/* ---- 5. Erratas del sitio original que no deben volver ---- */
console.log('\n\x1b[1mCorrecciones aplicadas\x1b[0m')
src.includes('suitte') ? bad('quedo el typo "suitte"') : ok('typo "suitte" corregido')
src.includes('GALPON') ? bad('quedo "GALPON" sin acento') : ok('acentos en mayusculas ok')
src.includes('Lunes a Domingos') ? bad('quedo "Domingos" sin acento') : ok('"Días" con acento')

/* ---- 6. Coherencia de tipos usados en el codigo ---- */
console.log('\n\x1b[1mCoherencia de tipos\x1b[0m')
const defined = new Set([...src.matchAll(/export const (\w+): Record<PropertyType, string>/g)].map((m) => m[1]))
defined.size >= 2 ? ok(`Record<PropertyType,...> definidos: ${[...defined].join(', ')}`) : bad('faltan Records de PropertyType')

/* ---- Resumen ---- */
console.log('')
if (failures === 0) {
  console.log('\x1b[32m\x1b[1mTodo OK.\x1b[0m')
} else {
  console.log(`\x1b[31m\x1b[1m${failures} fallo(s).\x1b[0m`)
  process.exit(1)
}
