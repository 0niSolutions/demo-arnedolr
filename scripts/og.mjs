/**
 * Genera public/og-default.png (1200x630) renderizando la marca con Playwright,
 * reusando las fuentes ya cargadas por el sitio.
 *   node scripts/og.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:5173'
mkdirSync('public', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })

// Las fuentes viven en el sitio: entrar primero para que queden en cache.
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)

await page.setViewportSize({ width: 1200, height: 630 })

await page.evaluate(() => {
  document.documentElement.style.cssText = 'background:#150d03'
  document.body.style.cssText = 'margin:0'

  const style = document.createElement('style')
  style.textContent = `
    @font-face { font-family: 'Fraunces'; src: local('Fraunces'); }
    .og {
      width: 1200px; height: 630px; position: relative; overflow: hidden;
      display: flex; flex-direction: column; justify-content: space-between;
      padding: 72px 80px; box-sizing: border-box;
      font-family: 'DM Sans', system-ui, sans-serif;
      background:
        radial-gradient(1100px 620px at 88% 8%, rgba(255,145,77,.30), transparent 62%),
        radial-gradient(820px 520px at 6% 96%, rgba(203,91,59,.26), transparent 60%),
        linear-gradient(150deg, #2c1d0b 0%, #150d03 62%);
      color: #f8f8f0;
    }
    .brand { display: flex; align-items: center; gap: 18px; }
    .mark {
      width: 62px; height: 62px; border-radius: 18px; display: grid; place-items: center;
      background: linear-gradient(140deg, #ff914d, #cb5b3b);
      font-family: 'Fraunces', Georgia, serif; font-weight: 700; font-size: 30px; color: #fff;
      box-shadow: 0 12px 30px rgba(0,0,0,.34);
    }
    .name { font-size: 30px; font-weight: 700; letter-spacing: .14em; }
    .tag { font-size: 17px; letter-spacing: .16em; text-transform: uppercase; color: rgba(248,248,240,.66); margin-top: 3px; }
    h1 {
      font-family: 'Fraunces', Georgia, serif; font-weight: 500;
      font-size: 82px; line-height: 1.04; margin: 0 0 22px; letter-spacing: -.015em;
    }
    h1 em { font-style: normal; color: #ffab6b; }
    .sub { font-size: 29px; line-height: 1.4; color: rgba(248,248,240,.80); margin: 0; max-width: 900px; }
    .foot { display: flex; align-items: center; gap: 14px; font-size: 22px; color: rgba(248,248,240,.66); }
    .pill { border: 1px solid rgba(248,248,240,.26); border-radius: 999px; padding: 9px 20px; }
  `
  document.head.appendChild(style)

  const el = document.createElement('div')
  el.className = 'og'
  el.innerHTML = `
    <div class="brand">
      <div class="mark">A</div>
      <div>
        <div class="name">ARNEDO LR</div>
        <div class="tag">Inmobiliaria &middot; Salta</div>
      </div>
    </div>
    <div>
      <h1>Encontr&aacute; la casa<br>que estabas <em>esperando.</em></h1>
      <p class="sub">Casas, departamentos, galpones y terreno en San Lorenzo, Grand Bourg, Tres Cerritos y El Tipal.</p>
    </div>
    <div class="foot">
      <span class="pill">Precios a la vista</span>
      <span class="pill">14 propiedades</span>
      <span class="pill">WhatsApp 3874 19-9305</span>
    </div>
  `
  document.body.innerHTML = ''
  document.body.appendChild(el)
})

await page.waitForTimeout(600)
await page.locator('.og').screenshot({ path: 'public/og-default.png' })
await browser.close()

console.log('public/og-default.png generado (1200x630)')
