import { chromium } from "playwright"
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 390, height: 844 } })
await p.goto("http://localhost:5173/", { waitUntil: "networkidle" })
await p.waitForTimeout(1000)
const m = await p.evaluate(() => ({
  docScrollW: document.documentElement.scrollWidth,
  docClientW: document.documentElement.clientWidth,
  bodyScrollW: document.body.scrollWidth,
  innerW: window.innerWidth,
}))
console.log("mobile metrics:", JSON.stringify(m))
console.log("overflow horizontal:", m.docScrollW > m.docClientW ? `SI (+${m.docScrollW-m.docClientW}px)` : "no")

// Elementos que se desbordan
const over = await p.evaluate(() => {
  const w = document.documentElement.clientWidth
  return [...document.querySelectorAll("*")]
    .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > w + 1 || r.left < -1) })
    .slice(0, 12)
    .map(el => `${el.tagName.toLowerCase()}.${(el.className||"").toString().slice(0,60)} [${Math.round(el.getBoundingClientRect().left)}..${Math.round(el.getBoundingClientRect().right)}]`)
})
console.log("elementos fuera de viewport:", over.length)
over.forEach(x => console.log("  ", x))
await b.close()
