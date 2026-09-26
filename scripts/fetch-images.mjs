/**
 * Descarga las fotos reales de las propiedades del sitio Canva original y las
 * convierte a WebP, que pesa una fraccion contra los PNG de origen.
 *
 *   node scripts/fetch-images.mjs           # solo lo que falte
 *   node scripts/fetch-images.mjs --force   # rehace todo
 *
 * Escribe en public/propiedades/<slug>.webp y actualiza src/data/site.ts con el
 * campo `image` de cada propiedad.
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from 'node:fs'
import { Buffer } from 'node:buffer'

const ORIGIN = 'https://arnedolr.my.canva.site'
const OUT_DIR = 'public/propiedades'
const FORCE = process.argv.includes('--force')

/** slug del sitio nuevo -> archivo del Canva que le corresponde. */
const MAP = {
  'casa-praderas-san-lorenzo-chico': 'a1a3af1a85a3f8b081f4459bdfd27bc2.png', // 1200x900
  'casa-grand-bourg': 'e2d0a0822908dd6a2207a2462046ac2d.png', // 900x1200
  'casa-san-lorenzo-3000': '46a19feebfca957a436564d583e61408.png', // 1200x900
  'casa-san-lorenzo-4000': '82584b6c1a0163855fd1db9eb9b62bde.png', // 1200x900
  'casa-el-tipal': 'af646c445105f6ffadb91e78e6374550.png', // 1200x900
  'casa-san-luis': '5cbbd1eb49364b30c4569040baaae919.png', // 900x1200
  'casa-san-lorenzo-600': 'e7e3ad94dccb6397ec5cb01d4059acf2.png', // 1200x900
  'casa-tres-cerritos': 'c9ed13b7e2d6289c6760aadd7d09513c.png', // 900x1200
  'departamento-belgrano': '9b6d3488c904263b167669b1d2a94275.png', // 480x640
  'departamento-boedo': '177515c97fd577556f335c5fe2647799.png', // 768x1024
  'departamento-zuviria': '584adf0424aa96ac8f106c69e02772f6.png', // 900x1200
  'galpon-zona-norte': '1346588a5701eb5d17af90ec096196a1.png', // 900x1200
  'campo-rosario-de-lerma': '1be9230d0629feb85f86d0786f9f0f13.png', // 1200x900
  'terreno-mercado-san-miguel': '33deb9512c00851bdbe204f3eb07b99b.png', // 473x647
}

const MAX_W = 1200
const QUALITY = 0.82

mkdirSync(OUT_DIR, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('about:blank')

/** Reescala en canvas y exporta WebP. */
async function toWebP(buffer, contentType) {
  return page.evaluate(
    async ({ b64, contentType, maxW, quality }) => {
      const bin = atob(b64)
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)

      const blob = new Blob([bytes], { type: contentType })
      const bitmap = await createImageBitmap(blob)

      const scale = Math.min(1, maxW / bitmap.width)
      const w = Math.round(bitmap.width * scale)
      const h = Math.round(bitmap.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(bitmap, 0, 0, w, h)

      const dataUrl = canvas.toDataURL('image/webp', quality)
      return { dataUrl: dataUrl.split(',')[1], w, h, srcW: bitmap.width, srcH: bitmap.height }
    },
    { b64: buffer.toString('base64'), contentType, maxW: MAX_W, quality: QUALITY },
  )
}

let downloaded = 0
let skipped = 0
let failed = 0
let rawTotal = 0
let outTotal = 0

for (const [slug, file] of Object.entries(MAP)) {
  const dest = `${OUT_DIR}/${slug}.webp`

  if (!FORCE && existsSync(dest) && statSync(dest).size > 0) {
    skipped++
    outTotal += statSync(dest).size
    console.log(`  \x1b[90msaltado\x1b[0m ${slug}`)
    continue
  }

  const url = `${ORIGIN}/_assets/media/${file}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const raw = Buffer.from(await res.arrayBuffer())
    const type = res.headers.get('content-type') || 'image/png'
    rawTotal += raw.length

    const out = await toWebP(raw, type)
    const buf = Buffer.from(out.dataUrl, 'base64')
    writeFileSync(dest, buf)
    outTotal += buf.length
    downloaded++

    const kb = (n) => `${Math.round(n / 1024)} KB`
    console.log(
      `  \x1b[32mOK\x1b[0m    ${slug.padEnd(30)} ${out.srcW}x${out.srcH} -> ${out.w}x${out.h}  ` +
        `${kb(raw.length)} -> ${kb(buf.length)}`,
    )
  } catch (err) {
    failed++
    console.log(`  \x1b[31mFALLA\x1b[0m ${slug.padEnd(30)} ${url} :: ${err.message}`)
  }
}

await browser.close()

console.log(
  `\n  ${downloaded} descargadas, ${skipped} saltadas, ${failed} fallidas` +
    (rawTotal ? ` | origen ${Math.round(rawTotal / 1048576)} MB -> ${Math.round(outTotal / 1024)} KB` : ''),
)
console.log(`  salida: ${OUT_DIR}/`)
process.exit(failed > 0 ? 1 : 0)
