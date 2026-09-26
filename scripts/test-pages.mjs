/**
 * Test end-to-end del comportamiento de GitHub Pages, sinpushear.
 *
 * Levanta un server que se comporta como Pages (dist en /<base>/, rutas
 * desconocidas -> 404.html con status 404) y abre la app con Playwright en
 * varias rutas, incluidas profundas y una inexistente.
 *
 *   node scripts/test-pages.mjs
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { chromium } from 'playwright'

const BASE = process.env.SIM_BASE || '/demo-arnedolr'
const PORT = Number(process.env.SIM_PORT || 4310)
const DIST = 'dist'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
}

const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent((req.url || '/').split('?')[0])
  const send = (status, body, type) => {
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' })
    res.end(body)
  }

  if (!pathname.startsWith(BASE)) return send(404, 'outside base', 'text/plain')

  let rel = normalize(pathname.slice(BASE.length) || '/')
  if (rel.includes('..')) return send(403, 'forbidden', 'text/plain')

  const file = join(DIST, rel)
  try {
    const s = await stat(file)
    if (s.isFile()) return send(200, await readFile(file), TYPES[extname(file)] || 'application/octet-stream')
    const idx = join(file, 'index.html')
    if ((await stat(idx)).isFile()) return send(200, await readFile(idx), TYPES['.html'])
  } catch {
    /* cae al 404 */
  }

  // Pages devuelve 404.html con status 404, no una redireccion a index.html.
  try {
    return send(404, await readFile(join(DIST, '404.html')), TYPES['.html'])
  } catch {
    return send(404, 'no 404.html', 'text/plain')
  }
})

await new Promise((r) => server.listen(PORT, r))
const base = `http://localhost:${PORT}${BASE}`
console.log(`  Servidor con comportamiento Pages en ${base}\n`)

const browser = await chromium.launch()
let failed = 0

const rutas = [
  { path: '/', h1: 'casa', status: 200 },
  // El status 404 con el h1 correcto es el comportamiento NORMAL de Pages en un
  // deep link: devuelve 404.html con status 404 y la SPA monta igual. Lo que
  // importa es que la ruta se resuelva, no el status.
  { path: '/propiedad/casa-praderas-san-lorenzo-chico', h1: 'Praderas', status: 404 },
  { path: '/propiedad/departamento-belgrano', h1: 'Belgrano', status: 404 },
  { path: '/propiedad/terreno-mercado-san-miguel', h1: 'Mercado San Miguel', status: 404 },
  { path: '/propiedad/departamento-zuviria', h1: 'Zuviria', status: 404 },
  { path: '/no-existe', h1: 'no existe', status: 404 },
]

for (const { path, h1: h1Esperado, status: statusEsperado } of rutas) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errores = []
  page.on('pageerror', (e) => errores.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()))

  const res = await page.goto(base + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  const info = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')]
    const logo = imgs.find((i) => i.src.includes('logo'))
    return {
      h1: document.querySelector('h1')?.textContent?.trim() ?? null,
      cuerpo: document.body.innerText.length,
      imgs: imgs.length,
      rotas: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
      // Con lazy-loading las de abajo del fold todavia no cargaron; se miran
      // las que deberian estar visibles.
      fotos: imgs.filter((i) => i.src.includes('/propiedades/')).length,
      logo: logo ? `${logo.naturalWidth}x${logo.naturalHeight}` : 'NO',
      rootVacio: (document.getElementById('root')?.innerHTML.length ?? 0) < 50,
    }
  })

  const problemas = []
  if (info.rootVacio) problemas.push('root vacio (base mal)')
  if (info.rotas > 0) problemas.push(`${info.rotas} imgs rotas`)
  if (info.logo === 'NO' || info.logo === '0x0') problemas.push('logo no cargo')
  if (info.cuerpo < 400) problemas.push('pagina vacia')
  if (info.fotos < 1) problemas.push('sin fotos de propiedades')
  if (!info.h1 || !info.h1.toLowerCase().includes(h1Esperado.toLowerCase())) {
    problemas.push(`h1 no contiene "${h1Esperado}" (dice "${info.h1}")`)
  }
  if (res.status() !== statusEsperado) {
    problemas.push(`status ${res.status()}, esperado ${statusEsperado}`)
  }
  // El unico error de consola tolerable es el 404 del deep link, que es Pages.
  const erroresReales = errores.filter((e) => !/status of 404|Failed to load resource/.test(e))
  if (erroresReales.length) problemas.push(`consola: ${erroresReales[0].slice(0, 70)}`)

  const ok = problemas.length === 0
  if (!ok) failed++

  const marca = ok ? '\x1b[32mOK  \x1b[0m' : '\x1b[31mFAIL\x1b[0m'
  console.log(
    `  ${marca} ${String(res.status()).padEnd(3)} ${path.padEnd(42)} h1="${String(info.h1).slice(0, 28)}" ` +
      `fotos=${info.fotos} rotas=${info.rotas} logo=${info.logo}`,
  )
  for (const p of problemas) console.log(`         \x1b[31m- ${p}\x1b[0m`)

  await page.close()
}

await browser.close()
server.close()

console.log(
  failed === 0
    ? '\n  \x1b[32mTodo OK: el fallback de SPA funciona como en GitHub Pages.\x1b[0m'
    : `\n  \x1b[31m${failed} ruta(s) con problemas.\x1b[0m`,
)
process.exit(failed === 0 ? 0 : 1)
