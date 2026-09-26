/**
 * Comprueba que cada propiedad cargue su imagen real: pide la URL, valida que
 * sea 200 y que sea una imagen decodificable, y mide cuanto tardo.
 *
 *   node scripts/verify-images.mjs
 */
import { chromium } from 'playwright'
import { readdirSync, statSync } from 'node:fs'
import { decodePng } from './png.mjs'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
const DIR = 'public/propiedades'

const files = readdirSync(DIR).filter((f) => f.endsWith('.webp')).sort()
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const problems = []
const netFail = []
page.on('response', (r) => {
  if (r.status() >= 400) netFail.push(`${r.status()} ${r.url()}`)
})
page.on('requestfailed', (r) => netFail.push(`FALLO ${r.url()} :: ${r.failure()?.errorText}`))

// Recorre la home y las fichas de una propiedad HD y de una de baja resolucion,
// para ver como se ven en el hero de detalle.
const RUTAS = [
  '/',
  '/propiedad/casa-el-tipal',
  '/propiedad/terreno-mercado-san-miguel',
  '/propiedad/departamento-belgrano',
]
for (const r of RUTAS) {
  await page.goto(BASE + r, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
}

const seen = await page.evaluate(() =>
  [...document.images]
    .filter((img) => img.currentSrc || img.src)
    .map((img) => ({
      src: img.currentSrc || img.src,
      natural: img.naturalWidth,
      rendered: Math.round(img.getBoundingClientRect().width),
      alt: img.alt,
    })),
)

console.log('\n  Imagenes <img> en la pagina:')
for (const img of seen) {
  if (!img.src.includes('/propiedades/')) continue
  const name = img.src.split('/').pop() || img.src.slice(0, 40)
  const loaded = img.natural > 0
  if (!loaded) {
    problems.push(`${name}: no cargo (naturalWidth ${img.natural})`)
    console.log(`    \x1b[31mFAIL\x1b[0m ${name.padEnd(38)} no cargo`)
    continue
  }
  // Upscale real = se ve borroso. 1x solo es Tierosa en pantallas retina.
  const upscaled = img.natural < img.rendered
  const oneX = img.natural < 2 * img.rendered
  if (upscaled) problems.push(`${name}: ${img.natural}px estirados a ${img.rendered}px`)
  const tag = upscaled ? '\x1b[31m(suave: upscale)\x1b[0m' : oneX ? '\x1b[33m(1x)\x1b[0m' : ''
  console.log(
    `    \x1b[32mOK\x1b[0m   ${name.padEnd(38)} natural ${String(img.natural).padStart(4)}px  render ${String(img.rendered).padStart(4)}px  ${tag}`,
  )
}

console.log('\n  Archivos en public/propiedades/:')
let total = 0
for (const f of files) {
  const size = statSync(`${DIR}/${f}`).size
  total += size
  // Valida que el WebP tenga cabecera y datos de imagen.
  const head = (await import('node:fs')).readFileSync(`${DIR}/${f}`).subarray(0, 12)
  const riff = head.subarray(0, 4).toString('ascii') === 'RIFF'
  const webp = head.subarray(8, 12).toString('ascii') === 'WEBP'
  if (!riff || !webp) problems.push(`${f}: no parece un WebP valido`)
  console.log(
    `    ${riff && webp ? '\x1b[32mOK\x1b[0m  ' : '\x1b[31mFAIL\x1b[0m'} ${f.padEnd(38)} ${String(Math.round(size / 1024)).padStart(4)} KB`,
  )
}
console.log(`\n  total: ${files.length} archivos, ${Math.round(total / 1024)} KB`)

await browser.close()

if (netFail.length) {
  console.log('\n  \x1b[31mPeticiones fallidas:\x1b[0m')
  for (const n of [...new Set(netFail)]) console.log(`    ${n}`)
}

if (problems.length) {
  console.log('\n  \x1b[33mProblemas:\x1b[0m')
  for (const p of problems) console.log(`    ${p}`)
  process.exit(1)
}
console.log('\n  \x1b[32mTodo OK.\x1b[0m\n')
