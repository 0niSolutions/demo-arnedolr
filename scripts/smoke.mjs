/**
 * Smoke test end-to-end contra el dev server.
 * Corre con: node scripts/smoke.mjs  (con `npm run dev` ya levantado)
 *
 * Verifica: que la app monte, que las rutas naveguen, que los links
 * externos tengan el formato correcto y que no haya errores de consola.
 */
import { chromium } from 'playwright'

// El dev server corre en 5173, pero en CI se sirve el build con vite preview en
// 4173. BASE_URL lo sobreescribe; si no esta, se usa el dev.
const BASE = process.env.BASE_URL || 'http://localhost:5173'
const errors = []
const results = []

function check(label, pass, detail = '') {
  results.push({ label, pass, detail })
  const tag = pass ? '\x1b[32mOK\x1b[0m   ' : '\x1b[31mFAIL\x1b[0m '
  console.log(`  ${tag}${label}${detail ? `  \x1b[90m${detail}\x1b[0m` : ''}`)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push(String(e)))

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1mHome\x1b[0m')

const res = await page.goto(BASE, { waitUntil: 'networkidle' })
check('la home responde 200', res.status() === 200, `status ${res.status()}`)

check('el root monto (no quedó vacío)', (await page.locator('#root > *').count()) > 0)

const h1 = (await page.locator('h1').first().textContent())?.trim()
// El <br /> del hero no aporta espacios en textContent: normalizamos.
const h1Flat = h1?.replace(/\s+/g, ' ').trim()
check('el h1 tiene el copy del hero', !!h1Flat && h1Flat.includes('Encontrá la casa'), JSON.stringify(h1Flat))

check('el lang del documento es es-419', (await page.getAttribute('html', 'lang')) === 'es-419')

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1mSecciones del home\x1b[0m')

for (const id of ['servicios', 'propiedades', 'nosotros', 'contacto']) {
  const n = await page.locator(`#${id}`).count()
  check(`existe la sección #${id}`, n > 0)
}

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1mCatálogo\x1b[0m')

const cards = await page.locator('article a[href^="/propiedad/"]').count()
check('las 14 propiedades renderizan como cards clickeables', cards >= 14, `${cards} cards`)

const firstHref = await page.locator('a[href^="/propiedad/"]').first().getAttribute('href')
check('cada card apunta a /propiedad/:slug', /^\/propiedad\/[a-z0-9-]+$/.test(firstHref), firstHref)

const prices = await page.locator('article').filter({ hasText: 'Precio referencial' }).count()
check('las cards muestran precio', prices >= 14, `${prices} con precio`)

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1mNavegación a la ficha\x1b[0m')

await page.locator('a[href^="/propiedad/"]').first().click()

// waitForURL no alcanza: React Router todavia no re-renderizo. Esperamos a que
// aparezca un marcador unico de la ficha.
await page.waitForSelector('h2:has-text("Sobre la propiedad")', { timeout: 10000 })
check('la navegación cambia la URL', page.url().includes('/propiedad/'), page.url())

const detailH1 = (await page.locator('h1').first().textContent())?.trim()
check(
  'la ficha muestra el título de la propiedad como h1',
  !!detailH1 && /^Casa en |^Depto\. en |^Galpón en |^Campo en |^Terreno en /.test(detailH1),
  JSON.stringify(detailH1),
)

/* El CTA de la sidebar, no el del nav: buscamos el que menciona "Consultar". */
const waCta = page.locator('aside a[href^="https://wa.me/"]').first()
check('la sidebar tiene CTA de WhatsApp', (await waCta.count()) > 0)

/* El mensaje de WhatsApp debe traer el nombre de la propiedad */
const waHref = await waCta.getAttribute('href')
const waText = decodeURIComponent(waHref)
check(
  'el mensaje de WhatsApp va precargado con la propiedad',
  waHref.includes('text=') && /vi la propiedad "/.test(waText),
  waText.slice(0, 80) + '…',
)

check(
  'la ficha tiene link al mapa',
  (await page.locator('a[href^="https://www.google.com/maps/search/"]').count()) > 0,
)

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1mSEO por ruta\x1b[0m')

const title = await page.title()
check('el title incluye la marca', title.includes('ARNEDOLR'), title)

const desc = await page.getAttribute('meta[name="description"]', 'content')
check('hay meta description', !!desc && desc.length > 40, `${desc?.length} caracteres`)

const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content')
check('og:url apunta a la ficha', !!ogUrl && ogUrl.includes('/propiedad/'), ogUrl)

const canonical = await page.getAttribute('link[rel="canonical"]', 'href')
check('hay canonical', !!canonical, canonical)

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1mFooter y links externos\x1b[0m')

const tel = await page.locator('footer a[href^="tel:"]').all()
check('los teléfonos del footer son clickeables (tel:)', tel.length >= 2, `${tel.length} links tel:`)

const mailto = await page.locator('footer a[href^="mailto:"]').count()
check('el email del footer es clickeable (mailto:)', mailto >= 1)

const socials = await page.locator('footer a[target="_blank"]').count()
check('hay links a redes sociales', socials >= 2, `${socials} links externos`)

const footerText = (await page.locator('footer').textContent()) ?? ''
check('el footer conserva el teléfono real', footerText.includes('3874'))
check('el footer conserva el mail real', footerText.includes('arnedolr@gmail.com'))
check('el footer conserva la dirección real', footerText.includes('Vicente López'))
check('el footer corrige "Domingos" → "Días"', footerText.includes('Días'))

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1m404\x1b[0m')

await page.goto(`${BASE}/propiedad/no-existe-esta-propiedad`, { waitUntil: 'networkidle' })
check('una slug inexistente da 404', (await page.locator('text=404').count()) > 0)

const robots = await page.getAttribute('meta[name="robots"]', 'content')
check('la 404 está en noindex', robots === 'noindex, nofollow', robots)

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1mAccesibilidad\x1b[0m')

await page.goto(BASE, { waitUntil: 'networkidle' })
check('hay skip link al contenido', (await page.locator('a[href="#contenido"]').count()) > 0)

const h1s = await page.locator('h1').count()
check('hay exactamente un h1', h1s === 1, `${h1s} h1`)

const imgsNoAlt = await page.locator('img:not([alt])').count()
check('todas las img tienen alt', imgsNoAlt === 0, `${imgsNoAlt} sin alt`)

const btnNoLabel = await page
  .locator('button:not([aria-label]):not(:has(*))')
  .count()
check('ningún botón vacío sin etiqueta', btnNoLabel === 0, `${btnNoLabel} sin etiqueta`)

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1mResponsive\x1b[0m')

/* El bug de `inline-flex` vs `hidden` empujaba el menu hamburguesa fuera del
   viewport en mobile. Este check lo evita de volver. */
for (const width of [360, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  const m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }))
  check(
    `sin scroll horizontal a ${width}px`,
    m.scrollW <= m.clientW + 1,
    m.scrollW > m.clientW + 1 ? `overflow de ${m.scrollW - m.clientW}px` : '',
  )
}

/* El boton de menu tiene que estar dentro del viewport en mobile */
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)

const burger = page.locator('button[aria-label="Abrir menú"]')
const box = await burger.boundingBox()
check(
  'el botón de menú está dentro del viewport mobile',
  !!box && box.x >= 0 && box.x + box.width <= 390,
  box ? `x=${Math.round(box.x)} w=${Math.round(box.width)}` : 'no encontrado',
)

/* Y tiene que funcionar */
await burger.click()
await page.waitForTimeout(500)
check('el menú mobile abre', (await page.locator('a:has-text("Propiedades")').count()) > 0)

await page.setViewportSize({ width: 1440, height: 900 })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)

/* ---------------------------------------------------------------- */
console.log('\n\x1b[1mErrores de consola\x1b[0m')
check('sin errores de runtime', errors.length === 0, errors.slice(0, 2).join(' | ') || 'ninguno')

/* ---------------------------------------------------------------- */
await browser.close()

const failed = results.filter((r) => !r.pass)
console.log(
  `\n${results.length - failed.length}/${results.length} checks OK` +
    (failed.length ? `  \x1b[31m(${failed.length} fallaron)\x1b[0m` : '  \x1b[32m(todo OK)\x1b[0m'),
)
process.exit(failed.length ? 1 : 0)
