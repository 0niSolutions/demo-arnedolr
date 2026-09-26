/**
 * Auditoria de estilos: contraste medido sobre los pixeles reales, paleta, tipografia y animacion.
 *   node scripts/styles.mjs
 *
 * El fondo se toma como el color DOMINANTE de la region de cada texto, leyendo una
 * captura real de la pagina. Asi gradients, overlays y sombras se resuelven solos.
 */
import { chromium } from 'playwright'
import { decodePng, modalColor } from './png.mjs'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
const ROUTES = ['/', '/propiedad/casa-en-praderas-san-lorenzo-chico', '/no-existe']

/* ---------- WCAG ---------- */
const lum = ([r, g, b]) => {
  const f = (v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
/** Oklab -> sRGB 0-255 (matriz de Bjoern Ottosson). */
function oklabToRgb(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3

  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  // lineal -> sRGB con la curva de transferencia
  const enc = (c) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.max(c, 0) ** (1 / 2.4) - 0.055
    return Math.min(255, Math.max(0, v * 255))
  }
  return [enc(lr), enc(lg), enc(lb)]
}

const parse = (c) => {
  const s = c || ''
  const num = '[-+]?[\\d.]+(?:e[-+]?\\d+)?'

  // color-mix() de Tailwind v4 serializa en oklab: hay que convertir el espacio.
  const ok = s.match(new RegExp(`oklab\\(\\s*(${num})\\s+(${num})\\s+(${num})(?:\\s*\\/\\s*(${num}))?\\s*\\)`))
  if (ok) {
    const [r, g, b] = oklabToRgb(Number(ok[1]), Number(ok[2]), Number(ok[3]))
    return [r, g, b, ok[4] === undefined ? 1 : Number(ok[4])]
  }

  // color(srgb ...) son floats en 0-1.
  const srgb = s.match(new RegExp(`color\\(srgb\\s+(${num})\\s+(${num})\\s+(${num})(?:\\s*\\/\\s*(${num}))?\\s*\\)`))
  if (srgb) {
    return [
      Number(srgb[1]) * 255,
      Number(srgb[2]) * 255,
      Number(srgb[3]) * 255,
      srgb[4] === undefined ? 1 : Number(srgb[4]),
    ]
  }

  const m = s.match(/rgba?\(([^)]+)\)/)
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number)
    return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]
  }
  return null
}
const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })

let total = 0
let fails = 0
const failed = []

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  // Deja que los elementos con animacion de entrada terminen.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(900)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(700)

  const samples = await page.evaluate(() => {
    const out = []
    const seen = new Set()
    const sel = 'p, h1, h2, h3, h4, a, span, li, button, dt, dd, figcaption, blockquote, label, small, strong'

    for (const el of document.querySelectorAll(sel)) {
      // Solo texto propio: si el elemento tiene hijos con texto, el fondo se mezcla.
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join('')
      if (own.length < 2) continue

      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.95) continue
      // Decoracion pura: los lectores de pantalla la saltan, WCAG tambien.
      if (el.closest('[aria-hidden="true"]')) continue
      if (cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text') continue
      const ca = (cs.color.match(/[\d.]+/g) || [])[3]
      if (ca !== undefined && Number(ca) === 0) continue

      const rect = el.getBoundingClientRect()
      if (rect.width < 8 || rect.height < 8) continue
      // Sale del viewport horizontal: su fondo no esta en la captura.
      if (rect.left < 0 || rect.right > document.documentElement.clientWidth + 1) continue
      if (rect.top < 0 || rect.bottom > document.body.scrollHeight) continue

      const size = parseFloat(cs.fontSize)
      const weight = Number(cs.fontWeight) || 400
      const large = size >= 24 || (size >= 18.66 && weight >= 700)

      const key = `${cs.color}|${Math.round(size)}|${weight}`
      if (seen.has(key)) continue
      seen.add(key)

      out.push({
        tag: el.tagName.toLowerCase(),
        text: own.slice(0, 40),
        color: cs.color,
        size,
        weight,
        large,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        w: rect.width,
        h: rect.height,
      })
    }
    return out
  })

  if (route === '/') {
    console.log(`\n\x1b[1m\x1b[7m Contraste WCAG \x1b[0m  ${route}`)
  } else {
    console.log(`\n\x1b[1m\x1b[7m Contraste WCAG \x1b[0m  ${route}`)
  }

  const shot = await page.screenshot({ fullPage: true })
  const img = decodePng(shot)

  for (const s of samples) {
    // Muestrea una banda de la linea de texto.
    const bg = modalColor(
      img,
      s.x + 1,
      s.y + s.h * 0.15,
      s.x + s.w - 1,
      s.y + s.h * 0.85,
    )
    if (!bg) continue

    const bgc = [...bg, 1]
    const fgRaw = parse(s.color)
    if (!fgRaw) {
      console.log(`  \x1b[35m?\x1b[0m  color ilegible: ${s.color}  \x1b[90m${s.tag}\x1b[0m`)
      continue
    }
    const fg = over(fgRaw, bgc)
    const r = ratio(fg, bgc)
    const need = s.large ? 3 : 4.5
    const pass = r >= need
    total++
    if (!pass) {
      fails++
      failed.push({ route, ...s, r, bg })
    }

    const label = `${s.tag} ${s.size.toFixed(0)}px/${s.weight} ${JSON.stringify(s.text)}`.slice(0, 52)
    if (!pass) {
      console.log(
        `  \x1b[31mLOW\x1b[0m ${r.toFixed(2).padStart(6)}:1 (min ${need})  \x1b[90m${label}\x1b[0m  bg rgb(${bg.join(',')})`,
      )
    }
  }
}

console.log(
  fails === 0
    ? `\n  \x1b[32m${total} textos, todos por encima del minimo.\x1b[0m`
    : `\n  \x1b[33m${fails} de ${total} por debajo del minimo.\x1b[0m`,
)

/* ---------- Paleta y tipografia ---------- */
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)

console.log('\n\x1b[1m\x1b[7m Paleta aplicada \x1b[0m')
const palette = await page.evaluate(() => {
  const root = getComputedStyle(document.documentElement)
  return ['bark-900', 'bark-950', 'clay-500', 'clay-600', 'ember-400', 'ember-500', 'cream', 'sand', 'stone', 'ink', 'signal-500', 'signal-700']
    .map((n) => [n, root.getPropertyValue(`--color-${n}`).trim()])
})
for (const [n, v] of palette) {
  console.log(`  ${v ? '\x1b[32mOK\x1b[0m  ' : '\x1b[31mMISS\x1b[0m'} --color-${n.padEnd(12)} ${v}`)
}

console.log('\n\x1b[1m\x1b[7m Tipografia \x1b[0m')
const fonts = await page.evaluate(() => ({
  body: getComputedStyle(document.body).fontFamily,
  h1: getComputedStyle(document.querySelector('h1')).fontFamily,
  loaded: [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family))],
}))
console.log(`  body:            ${fonts.body}`)
console.log(`  h1:              ${fonts.h1}`)
console.log(`  fuentes cargadas: ${fonts.loaded.join(', ') || 'ninguna'}`)

console.log('\n\x1b[1m\x1b[7m Animacion \x1b[0m')
const anim = await page.evaluate(() => {
  const els = [...document.querySelectorAll('*')]
  return {
    total: els.length,
    transitioning: els.filter((el) => parseFloat(getComputedStyle(el).transitionDuration) > 0.15).length,
    keyframes: els.filter((el) => getComputedStyle(el).animationName !== 'none').length,
    reduced: els.filter((el) => getComputedStyle(el).willChange.includes('transform')).length,
  }
})
console.log(`  elementos totales:          ${anim.total}`)
console.log(`  con transicion (>150ms):     ${anim.transitioning}`)
console.log(`  con animation-name:           ${anim.keyframes}`)
console.log(`  con will-change: transform:   ${anim.reduced}`)

await browser.close()
console.log('')
process.exit(fails > 0 ? 1 : 0)
