/** Volca la cadena de fondos de un texto concreto. node scripts/inspect.mjs "texto" */
import { chromium } from 'playwright'

const needle = process.argv[2] || 'Contactarme'
const route = process.argv[3] || '/'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const found = await page.evaluate((needle) => {
  const out = []
  for (const el of document.querySelectorAll('*')) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('')
    if (!own.toLowerCase().includes(needle.toLowerCase())) continue

    const chain = []
    let n = el
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n)
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || (cs.backgroundImage && cs.backgroundImage !== 'none')) {
        chain.push(`${n.tagName.toLowerCase()}.${(n.className || '').toString().split(' ').slice(0, 4).join('.')}  bg=${cs.backgroundColor}  img=${String(cs.backgroundImage).slice(0, 70)}`)
      }
      n = n.parentElement
    }

    const cs = getComputedStyle(el)
    out.push({
      sel: `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ').slice(0, 6).join('.')}`,
      text: own.slice(0, 40),
      color: cs.color,
      fontSize: cs.fontSize,
      weight: cs.fontWeight,
      opacity: cs.opacity,
      ariaHidden: el.getAttribute('aria-hidden'),
      chain,
    })
  }
  return out
}, needle)

for (const f of found) {
  console.log(`\n\x1b[1m${f.sel}\x1b[0m`)
  console.log(`  texto:   ${JSON.stringify(f.text)}`)
  console.log(`  color:   ${f.color}`)
  console.log(`  font:    ${f.fontSize} / ${f.weight}   opacity: ${f.opacity}   aria-hidden: ${f.ariaHidden}`)
  console.log('  fondo (de adentro hacia afuera):')
  for (const c of f.chain) console.log(`    ${c}`)
}

await browser.close()
