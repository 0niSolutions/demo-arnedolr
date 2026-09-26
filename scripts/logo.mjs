/**
 * Genera public/logo-mark.webp: el logo provisto por el cliente recortado a su
 * caja opaca y en WebP, para que el tamano en pantalla sea predecible.
 * No modifica public/logo.png.
 *
 *   node scripts/logo.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { decodePng } from './png.mjs'

const SRC = 'public/logo.png'
const DEST = 'public/logo-mark.webp'

if (!existsSync(SRC)) {
  console.error('No existe', SRC)
  process.exit(1)
}

// Caja de los pixeles con alfa, usando el mismo criterio que el resto del sitio.
const img = decodePng(readFileSync(SRC))
let minX = Infinity
let minY = Infinity
let maxX = -1
let maxY = -1
for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < img.width; x++) {
    const i = (y * img.width + x) * img.channels
    if (img.channels === 4 && img.data[i + 3] < 250) continue
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }
}
const box = { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
console.log(`  origen ${img.width}x${img.height}  ->  recorte ${box.w}x${box.h}`)

const raw = readFileSync(SRC)
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('about:blank')

const dataUrl = await page.evaluate(
  async ({ b64, box }) => {
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))

    const canvas = document.createElement('canvas')
    canvas.width = box.w
    canvas.height = box.h
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    // sx/sy en pixeles de la imagen fuente: recorta a la caja opaca.
    ctx.drawImage(bitmap, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h)

    return canvas.toDataURL('image/webp', 0.95).split(',')[1]
  },
  { b64: raw.toString('base64'), box },
)

writeFileSync(DEST, Buffer.from(dataUrl, 'base64'))
await browser.close()

console.log(`  ${DEST}  ${Math.round(readFileSync(DEST).length / 1024)} KB  (relacion ${(box.w / box.h).toFixed(2)}:1)`)
