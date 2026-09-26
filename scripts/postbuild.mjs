/**
 * GitHub Pages no tiene rewrite de rutas: si alguien entra directo a
 * /propiedad/casa-el-tipal, Pages busca ese archivo, no lo encuentra y devuelve
 * 404. La unica salida sin dominio propio es servir un 404.html que sea el
 * index.html, para que la SPA arranque y lea la ruta de window.location.
 *
 * Se ejecuta despues de vite build.
 *
 *   node scripts/postbuild.mjs
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const INDEX = join(DIST, 'index.html')
const NOT_FOUND = join(DIST, '404.html')

if (!existsSync(INDEX)) {
  console.error('  No existe dist/index.html. Corré primero "npm run build".')
  process.exit(1)
}

copyFileSync(INDEX, NOT_FOUND)

/**
 * Pages sirve .nojekyll para no pasarle los archivos que empiezan con _ y evitar
 * que los Theme de Jekyll los toque. Sin esto, cualquier carpeta con _ puede
 * desaparecer del deploy.
 */
writeFileSync(join(DIST, '.nojekyll'), '')

const html = readFileSync(INDEX, 'utf8')

// La URL del sitio de Canva era el origen de la demo. Si se queda pegada en
// las etiquetas estaticas, los buscadores y las redes van a apuntar al sitio
// viejo, y no se nota mirando la pagina: hay que revisarlo.
const VIEJO = 'arnedolr.my.canva.site'
if (html.includes(VIEJO)) {
  console.error(`\n  \x1b[31mERROR\x1b[0m dist/index.html todavia referencia ${VIEJO}`)
  console.error('         Actualizá canonical, og:url y og:image en index.html.')
  process.exit(1)
}

// Reporta con que base quedaron los assets, que es lo primero que se rompe.
const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((u) => /\.(js|css|webp|png|jpe?g|svg)$/i.test(u))

const absolute = assets.filter((u) => u.startsWith('/'))
const relative = assets.filter((u) => u.startsWith('.'))

console.log('  postbuild: dist/404.html generado (fallback de SPA)')
console.log('  postbuild: dist/.nojekyll generado')

if (relative.length > 0) {
  console.log(`  \x1b[31mALERTA\x1b[0m ${relative.length} asset(s) con ruta relativa: ${relative.join(', ')}`)
  console.log('         En Pages eso se rompe con rutas anidadas. Revisar el base de vite.config.ts.')
} else if (absolute.length > 0) {
  const prefix = absolute[0].split('/').slice(0, 2).join('/')
  console.log(`  postbuild: base detectado "${prefix}/" en ${absolute.length} asset(s)`)
  if (prefix === '/assets' || prefix === '/') {
    console.log('  \x1b[33mOJO\x1b[0m el base es "/". Si el repo NO es USUARIO.github.io, los assets van a 404.')
  }
} else {
  console.log('  \x1b[33mOJO\x1b[0m no se encontro ningun asset con ruta absoluta en index.html')
}
