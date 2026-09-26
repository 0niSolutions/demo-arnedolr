/**
 * Corre despues de vite build (netlify.toml no lo invoca; lo encadena package.json).
 *
 * Solo valida, no genera archivos: en Netlify el fallback de rutas lo resuelve
 * la regla de redireccion de netlify.toml, asi que no hace falta el 404.html
 * trick de GitHub Pages.
 *
 * Lo que si se verifica, porque el fallo es silencioso:
 *  - que los assets cuelguen de la raiz (si el base queda mal, dan 404 y la
 *    pagina sale en blanco)
 *  - que canonical y og:url apunten al dominio configurado (si no, el link
 *    compartido en redes apunta al sitio viejo)
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const INDEX = join('dist', 'index.html')

if (!existsSync(INDEX)) {
  console.error('  No existe dist/index.html. Corré primero "npm run build".')
  process.exit(1)
}

const html = readFileSync(INDEX, 'utf8')

// Origen esperado, segun lo que define netlify.toml en el build.
const esperado = process.env.VITE_SITE_ORIGIN?.replace(/\/$/, '')

const VIEJO = 'arnedolr.my.canva.site'
if (html.includes(VIEJO)) {
  console.error(`\n  \x1b[31mERROR\x1b[0m dist/index.html todavia referencia ${VIEJO}`)
  console.error('         Actualizá canonical, og:url y og:image en index.html.')
  process.exit(1)
}

if (esperado) {
  const canonicas = [...html.matchAll(/(?:rel="canonical" href|og:url" content)="([^"]+)"/g)].map(
    (m) => m[1],
  )
  const desviadas = canonicas.filter((u) => !u.startsWith(esperado))
  if (desviadas.length > 0) {
    console.error(`\n  \x1b[31mERROR\x1b[0m canonical/og:url no coinciden con VITE_SITE_ORIGIN (${esperado}):`)
    for (const d of desviadas) console.error(`         ${d}`)
    process.exit(1)
  }
  console.log(`  postbuild: canonical y og:url -> ${esperado}`)
}

// Assets: tienen que estar todos bajo la raiz. Un base con subpath solo
// funciona si el sitio se sirve bajo ese subpath, y en Netlify es la raiz.
const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((u) => /\.(js|css|webp|png|jpe?g|svg)$/i.test(u))
const relative = assets.filter((u) => u.startsWith('.'))

if (relative.length > 0) {
  console.log(`  \x1b[31mALERTA\x1b[0m ${relative.length} asset(s) con ruta relativa: ${relative.join(', ')}`)
  console.log('         Se rompe con rutas anidadas (/propiedad/x). Revisar VITE_BASE.')
} else {
  const conPrefijo = assets.filter((u) => u.split('/').length > 3)
  if (conPrefijo.length > 0) {
    console.log(`  \x1b[33mOJO\x1b[0m ${conPrefijo.length} asset(s) con subpath (ej: ${conPrefijo[0]}).`)
    console.log('         Si el sitio se sirve en la raiz (Netlify), esos dan 404. Revisar VITE_BASE.')
  } else {
    console.log(`  postbuild: ${assets.length} assets en la raiz, sin subpath`)
  }
}
