/** Captura screenshots para revision visual. node scripts/shots.mjs */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

// El dev server corre en 5173, pero en CI se sirve el build con vite preview en
// 4173. BASE_URL lo sobreescribe; si no esta, se usa el dev.
const BASE = process.env.BASE_URL || 'http://localhost:5173'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()

/* Desktop */
const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await desk.goto(BASE, { waitUntil: 'networkidle' })
await desk.waitForTimeout(1200)
await desk.screenshot({ path: `${OUT}/01-home-hero.png` })

// Scroll a catalogo
await desk.locator('#propiedades').scrollIntoViewIfNeeded()
await desk.waitForTimeout(1200)
await desk.screenshot({ path: `${OUT}/02-home-catalogo.png` })

await desk.locator('#servicios').scrollIntoViewIfNeeded()
await desk.waitForTimeout(1000)
await desk.screenshot({ path: `${OUT}/03-home-servicios.png` })

await desk.locator('#nosotros').scrollIntoViewIfNeeded()
await desk.waitForTimeout(1000)
await desk.screenshot({ path: `${OUT}/04-home-nosotros.png` })

// Ficha
await desk.goto(`${BASE}/propiedad/casa-el-tipal`, { waitUntil: 'networkidle' })
await desk.waitForTimeout(1200)
await desk.screenshot({ path: `${OUT}/05-ficha-top.png` })
await desk.locator('h2:has-text("Ubicación")').scrollIntoViewIfNeeded()
await desk.waitForTimeout(1000)
await desk.screenshot({ path: `${OUT}/06-ficha-mapa.png` })

// 404
await desk.goto(`${BASE}/no-existe`, { waitUntil: 'networkidle' })
await desk.waitForTimeout(800)
await desk.screenshot({ path: `${OUT}/07-404.png` })

/* Mobile */
const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
await mob.goto(BASE, { waitUntil: 'networkidle' })
await mob.waitForTimeout(1200)
await mob.screenshot({ path: `${OUT}/08-mobile-hero.png` })

// Menu abierto
await mob.locator('button[aria-label="Abrir menú"]').click()
await mob.waitForTimeout(700)
await mob.screenshot({ path: `${OUT}/09-mobile-menu.png` })
await mob.locator('button[aria-label="Cerrar menú"]').click()
await mob.waitForTimeout(500)

// Catalogo mobile
await mob.locator('#propiedades').scrollIntoViewIfNeeded()
await mob.waitForTimeout(1000)
await mob.screenshot({ path: `${OUT}/10-mobile-catalogo.png` })

// FAB de WhatsApp visible
await mob.evaluate(() => window.scrollBy(0, 700))
await mob.waitForTimeout(900)
await mob.screenshot({ path: `${OUT}/11-mobile-fab.png` })

// Ficha mobile
await mob.goto(`${BASE}/propiedad/galpon-zona-norte`, { waitUntil: 'networkidle' })
await mob.waitForTimeout(1200)
await mob.screenshot({ path: `${OUT}/12-mobile-ficha.png` })

await browser.close()
console.log('Screenshots en ./' + OUT)
